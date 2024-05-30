import { User } from 'src/users/user.entity';
import { CreateSongDTO } from '../DTO/create-song-dto';
import { SongsService } from './songs.service';
import { Song } from './song.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { Connection } from 'src/common/constant/connection';
import { UpdateSongDTO } from '../DTO/update-song-dto';
import { UpdateResult } from 'typeorm';
import { JwtArtistGuard } from 'src/artists/jwt-artist.guard';

@Controller({
  path: 'songs',
  scope: Scope.REQUEST,
})
export class SongsController {
  constructor(private songsService: SongsService) {}
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'duration',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Song[]; count: number }> {
    return this.songsService.findAll(
      Number(page),
      Number(limit),
      sortBy,
      sortOrder,
    );
  }
  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDTO,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDTO);
  }
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.delete(id);
  }
  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDTO: CreateSongDTO, @Req() request) {
    console.log(request.user);
    return this.songsService.create(createSongDTO);
  }
}
