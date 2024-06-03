import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from 'src/DTO/create-user-dto';
import { UsersController } from './users.controller';

describe('UsersService', () => {
  let service: UsersService;
  let controller: UsersController;
  let user: CreateUserDTO = {
    firstname: 'nguyen',
    lastname: 'phap',
    email: 'nguyenpahp@gmail.com',
    password: 'phap123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockImplementation((userDTO: CreateUserDTO) => {
              console.log('abc');
              return Promise.resolve(userDTO);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should give me  users', async () => {
    const result = await service.create(user);
    expect(result).toEqual(user);
  });
});
