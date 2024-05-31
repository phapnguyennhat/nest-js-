import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlayListDTO } from '../DTO/create-playlist-dto';
import { Playlist } from './playlists.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('playlists')
@ApiTags('PlayList')
export class PlaylistsController {
  constructor(private playListsService: PlaylistsService) {}
  @Post()
  create(@Body() playlistDTO: CreatePlayListDTO): Promise<Playlist> {
    return this.playListsService.create(playlistDTO);
  }
}
