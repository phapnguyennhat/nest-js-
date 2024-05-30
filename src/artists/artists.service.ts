import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist) private artistsRepo: Repository<Artist>,
  ) {}
  findArtist(userId: number) {
    return this.artistsRepo.findOneBy({ user: { id: userId } }); // check current logged in uesr is an artist ?
  }
}
