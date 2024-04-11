import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ArtistDto } from './dto/artist.dto';
import { Artist } from './entity/artist.entity';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { getEntityById } from '../helpers/getEntityById';
import { deleteEntityById } from '../helpers/deleteEntityById';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}

  async getArtists(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findArtist(id: string): Promise<Artist> {
    return await getEntityById<Artist>(this.artistRepository, id);
  }

  async findArtistsByIds(ids: string[]): Promise<Artist[]> {
    try {
      return await this.artistRepository.findBy({ id: In(ids) });
    } catch (error) {
      console.log('Error finding artists: ', error);
      return [];
    }
  }

  async createArtist(artistDto: ArtistDto): Promise<Artist> {
    const newArtist = new Artist();

    newArtist.id = uuidv4();
    newArtist.name = artistDto.name;
    newArtist.grammy = artistDto.grammy ?? false;

    const artist = await this.artistRepository.create(newArtist);

    return await this.artistRepository.save(artist);
  }

  async updateArtist(id: string, artistDto: ArtistDto): Promise<Artist> {
    const artistToUpdate = await getEntityById<Artist>(
      this.artistRepository,
      id,
    );

    const updatedArtist = Object.assign({}, artistToUpdate);
    updatedArtist.name = artistDto.name;
    updatedArtist.grammy = artistDto.grammy ?? false;

    return await this.artistRepository.save(updatedArtist);
  }

  async deleteArtist(id: string) {
    await deleteEntityById<Artist>(this.artistRepository, id);
  }
}
