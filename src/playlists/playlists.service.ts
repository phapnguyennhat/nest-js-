import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlists.entity';
import { Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { CreatePlayListDTO } from '../DTO/create-playlist-dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playListsRepo: Repository<Playlist>,
    @InjectRepository(Song)
    private SongsRepo: Repository<Song>,
    @InjectRepository(User)
    private UsersRepo: Repository<User>,
  ) {}

  async create(playlistDTO: CreatePlayListDTO): Promise<Playlist> {
    const playList = new Playlist();
    playList.name = playlistDTO.name;
    const songs = await this.SongsRepo.findByIds(playlistDTO.songs);
    playList.songs = songs;
    const user = await this.UsersRepo.findOneBy({ id: playlistDTO.user });
    playList.user = user;
    return this.playListsRepo.save(playList);
  }
}
