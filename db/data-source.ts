import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlists.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { promiseHooks } from 'v8';
require('dotenv').config();

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return dataSourceOptions();
  },
};

export const dataSourceOptions = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Playlist, Artist, Song],
  synchronize: true,
  migrations: ['dist/db/migrations/*.js'],
});

export const AppDataSource = new DataSource(dataSourceOptions());
