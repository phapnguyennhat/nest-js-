import { User } from './../users/user.entity';
import { PlaylistsService } from './../playlists/playlists.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/DTO/create-user-dto';
import { UsersService } from 'src/users/users.service';

import { LoginDTO } from 'src/DTO/login-dto';
import { AuthService } from './auth.service';
import { constrainedMemory } from 'process';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { ValidateTokenDTO } from 'src/DTO/validate-token.dto';
import { get } from 'http';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('signup')
  async signup(@Body() userDTO: CreateUserDTO): Promise<User> {
    return this.userService.create(userDTO);
  }
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(@Req() request) {
    console.log(request.user);
    return this.authService.enable2FA(request.user.userId);
  }

  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(@Req() request) {
    return this.authService.disable2FA(request.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(@Req() req, @Body() validateTokenDTO: ValidateTokenDTO) {
    return this.authService.validate2FAToken(
      req.user.userId,
      validateTokenDTO.token,
    );
  }

  @Get('profile')
  @UseGuards(AuthGuard('apikey'))
  getProfile(@Req() req) {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }

  @Get('test')
  testEnv() {
    return this.authService.getEnvVariables();
  }
}
