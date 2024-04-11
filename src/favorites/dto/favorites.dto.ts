import { ApiProperty } from '@nestjs/swagger';
import { Artist } from '../../artist/entity/artist.entity';
import { Album } from '../../album/entity/album.entity';
import { Track } from '../../track/entity/track.entity';

export class FavoritesResponseDto {
  @ApiProperty({ type: [Artist] })
  artists: Artist[];

  @ApiProperty({ type: [Album] })
  albums: Album[];

  @ApiProperty({ type: [Track] })
  tracks: Track[];
}
