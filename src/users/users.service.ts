import { ApikeyStrategy } from './../auth/strategy/ApiKeyStrategy';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../DTO/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}
  async create(userDTO: CreateUserDTO) {
    const user = new User();
    user.firstname = userDTO.firstname;
    user.lastname = userDTO.lastname;
    user.email = userDTO.email;
    user.apiKey = uuid4();

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userDTO.password, salt);
    const saveduser = await this.usersRepo.save(user);
    delete saveduser.password;
    return saveduser;
  }
  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.usersRepo.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Cound not find user ');
    }
    return user;
  }

  async findById(id: number) {
    return this.usersRepo.findOneBy({ id: id });
  }

  async updateSecretKey(userId, secret: string) {
    return this.usersRepo.update(userId, {
      twoFASecret: secret,
      enable2FA: true,
    });
  }

  async disable2FA(userId: number) {
    return this.usersRepo.update(userId, {
      enable2FA: false,
      twoFASecret: null,
    });
  }

  async findByApiKey(apiKey: string) {
    return this.usersRepo.findOneBy({ apiKey });
  }
}
