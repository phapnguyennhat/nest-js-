import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';

import { CreateSongDTO } from 'src/DTO/create-song-dto';
import { UpdateSongDTO } from 'src/DTO/update-song-dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Song } from './song.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SongsService', () => {
  let service: SongsService;

  let repo: Repository<Song>;
  const oneSong = { id: 1, title: 'Lover' };
  const songArray = [{ id: 1, title: 'Lover' }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: SongsService,
          useValue: {
            find: jest
              .fn()
              .mockImplementation(() => Promise.resolve(songArray)),

            findOneOrFail: jest
              .fn()
              .mockImplementation((options: FindOneOptions<Song>) => {
                return Promise.resolve(oneSong);
              }),

            create: jest
              .fn()
              .mockImplementation((createSongDTO: CreateSongDTO) => {
                return Promise.resolve(oneSong);
              }),

            save: jest.fn(),
            update: jest
              .fn()
              .mockImplementation(
                (id: string, updateSongDTO: UpdateSongDTO) => {
                  return Promise.resolve(oneSong);
                },
              ),
            delete: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve({ affected: 1 }),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    repo = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should give me the song by id', async () => {
  //   const song = await service.findOneOrFail('a uudi');
  //   const repoSpy = jest.spyOn(repo, 'findOneOrFail');
  //   expect(song).toEqual(oneSong);
  //   expect(repoSpy).toBeCalledWith({ where: { id: 'a uudi' } });
  // });
  // it('should create the song', async () => {
  //   const song = await service.create({ title: 'Lover' });
  //   expect(song).toEqual(oneSong);
  //   expect(repo.create).toBeCalledTimes(1);
  //   expect(repo.create).toBeCalledWith({ title: 'Lover' });
  // });
  // it('should update the song', async () => {
  //   const song = await service.update(1, { title: 'Lover' });
  //   expect(repo.update).toBeCalledTimes(1);
  //   expect(song).toEqual(oneSong);
  // });
  // it('should delete the song', async () => {
  //   const song = await service.delete(1);
  //   const repoSpyOn = jest.spyOn(repo, 'delete');
  //   expect(repo.delete).toBeCalledTimes(1);
  //   expect(song.affected).toBe(1);
  //   expect(repoSpyOn).toBeCalledWith('a uuid');
  // });
});
