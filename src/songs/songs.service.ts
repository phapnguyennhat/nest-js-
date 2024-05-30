import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// import { throwError } from 'rxjs';
// import { Connection } from 'src/common/constant/connection';
import { Song } from './song.entity';
import { Repository, UpdateResult, DataSource } from 'typeorm';
import { CreateSongDTO } from '../DTO/create-song-dto';
import { UpdateSongDTO } from '../DTO/update-song-dto';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class SongsService {
  // init local DB
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  private readonly songs = [];
  //insert
  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;
    const artists = await this.artistRepository.findByIds(songDTO.artists);
    song.artists = artists;
    return await this.songRepository.save(song);
  }

  // truy van
  // lấy bản ghi theo số trang
  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ): Promise<{ data: Song[]; count: number }> {
    const [data, count] = await this.songRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
    });
    return { data, count };
  }
  findOne(id: number): Promise<Song> {
    return this.songRepository.findOneBy({ id });
  }
  async delete(id: number): Promise<void> {
    await this.songRepository.delete(id);
  }
  update(id: number, recordToUpdate: UpdateSongDTO): Promise<UpdateResult> {
    return this.songRepository.update(id, recordToUpdate);
  }
}
