import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

describe('SongsController', () => {
  let controller: SongsController;
  let provide: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            getSongs: jest
              .fn()
              .mockResolvedValue([{ id: 1, title: 'Dancing Feat' }]),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    provide = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
