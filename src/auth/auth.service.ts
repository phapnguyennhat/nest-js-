import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/DTO/login-dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { User } from 'src/users/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types/payLoad.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly artistsService: ArtistsService,
    private configService: ConfigService,
  ) {}

  async login(loginDTO: LoginDTO) {
    const user = await this.userService.findOne(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (passwordMatched) {
      delete user.password;

      const payload: PayloadType = { email: user.email, userId: user.id };
      const artist = await this.artistsService.findArtist(user.id);
      if (artist) {
        payload.artistId = artist.id;
      }
      if (user.enable2FA && user.twoFASecret) {
        return {
          validate2FA: 'http://localhost:3000/auth/validate-2fa',
          message:
            'Please send the one-time password/toke from your Google Authenticator App',
        };
      }

      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Password does not match');
    }
  }

  async enable2FA(userId: number) {
    // khi enable 2FA muốn đăng nhập càn có mã OTP mã có tác dụng trong 30s
    // nên dù cho có tk mk thì phải có mã OTP này
    const user = await this.userService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret();
    console.log('secret in auth-service: ', secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(userId, user.twoFASecret);
    return { secret: user.twoFASecret };
  }

  async disable2FA(userId: number) {
    return this.userService.disable2FA(userId);
  }

  async validate2FAToken(userId: number, token: string) {
    try {
      // find the user on the based on id
      const user = await this.userService.findById(userId);

      // extract his 2FA secret
      // verify the secret with a token by
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async validateUserByApiKey(apiKey: string) {
    return this.userService.findByApiKey(apiKey);
  }

  getEnvVariables() {
    return this.configService.get('dbUsername');
  }
}
