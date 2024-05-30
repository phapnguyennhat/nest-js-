import { User } from 'src/users/user.entity';
import { Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Song } from 'src/songs/song.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User) // relationship 1:1 bảng artist có thêm cột thuộc tính userId khóa ngoại tham chiéu đến id của users
  @JoinColumn()
  user: User;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[];
}
