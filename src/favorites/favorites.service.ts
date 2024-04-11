import {
  Injectable,
  Inject,
  forwardRef,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritesResponseDto } from './dto/favorites.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { Favorite } from './entity/favorites.entity';
import { createFavoriteByCategory } from 'src/helpers/createFavoriteByCategory';

@Injectable({})
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async getFavorites(): Promise<FavoritesResponseDto> {
    const favorites = await this.favoritesRepository.find();

    const favoritesIdsByCategories = favorites.reduce(
      (acc, entity) => {
        const idValue = Object.entries(entity).find(
          ([key, id]) => key !== 'id' && Boolean(id),
        );

        if (!idValue) return acc;
        const [category, id] = idValue;
        return { ...acc, [category]: [...acc[category], id] };
      },
      { trackId: [], albumId: [], artistId: [] },
    );

    const favoritesTracks = await this.trackService.findTracksByIds(
      favoritesIdsByCategories.trackId,
    );
    const favoritesAlbums = await this.albumService.findAlbumsByIds(
      favoritesIdsByCategories.albumId,
    );
    const favoritesArtists = await this.artistService.findArtistsByIds(
      favoritesIdsByCategories.artistId,
    );

    if (!favoritesTracks || !favoritesAlbums || !favoritesArtists) {
      throw new UnprocessableEntityException(`One of the IDs are not valid`);
    }

    return {
      tracks: favoritesTracks,
      albums: favoritesAlbums,
      artists: favoritesArtists,
    };
  }

  async addFavoriteTrack(id: string): Promise<string> {
    try {
      await createFavoriteByCategory(this.favoritesRepository, id, 'trackId');

      return `Track with ID ${id} was added to the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }
  }

  async deleteFavoriteTrack(id: string): Promise<string> {
    try {
      await this.favoritesRepository.delete(id);

      return `Track with ID ${id} was deleted from the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }
  }

  async addFavoriteArtist(id: string): Promise<string> {
    try {
      await createFavoriteByCategory(this.favoritesRepository, id, 'artistId');

      return `Artist with ID ${id} was added to the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Track with ID ${id} doesn't exist`,
      );
    }
  }

  async deleteFavoriteArtist(id: string): Promise<string> {
    try {
      await this.favoritesRepository.delete(id);

      return `Track with ID ${id} was deleted from the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Artist with ID ${id} doesn't exist`,
      );
    }
  }

  async addFavoriteAlbum(id: string): Promise<string> {
    try {
      await createFavoriteByCategory(this.favoritesRepository, id, 'albumId');

      return `Album with ID ${id} was added to the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Album with ID ${id} doesn't exist`,
      );
    }
  }

  async deleteFavoriteAlbum(id: string): Promise<string> {
    try {
      await this.favoritesRepository.delete(id);

      return `Album with ID ${id} was deleted from the favorites`;
    } catch {
      throw new UnprocessableEntityException(
        `Album with ID ${id} doesn't exist`,
      );
    }
  }
}
