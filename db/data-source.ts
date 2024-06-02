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
    return dataSourceOptions(configService);
  },
};

export const dataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('dbHost'),
  port: parseInt(configService.get<string>('dbPort')),
  username: configService.get<string>('dbUsername'),
  password: configService.get<string>('password'),
  database: configService.get<string>('dbName'),
  entities: [User, Playlist, Artist, Song],
  synchronize: false,
  migrations: ['dist/db/migration/*.js'],
});

// export const AppDataSource = new DataSource(dataSourceOptions());
