import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';
import { Track } from '../../track/entity/track.entity';
import { Album } from '../../album/entity/album.entity';
import { Artist } from '../../artist/entity/artist.entity';

@Entity()
export class Favorite {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  artistId: string;

  @OneToOne(() => Artist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ nullable: true })
  albumId: string;

  @OneToOne(() => Album, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @Column({ nullable: true })
  trackId: string;

  @OneToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: Track;
}
