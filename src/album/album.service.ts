import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlbumDto } from './dto/album.dto';
import { Album } from './entity/album.entity';
import { TrackService } from '../track/track.service';
import { getEntityById } from '../helpers/getEntityById';
import { deleteEntityById } from '../helpers/deleteEntityById';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
  ) {}

  async getAlbums(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async findAlbum(id: string): Promise<Album> {
    const relations = { artist: true };
    return await getEntityById<Album>(this.albumRepository, id, relations);
  }

  async findAlbumsByIds(ids: string[]): Promise<Album[]> {
    try {
      return await this.albumRepository.findBy({ id: In(ids) });
    } catch (error) {
      console.log('Error finding albums: ', error);
      return [];
    }
  }

  async createAlbum(albumDto: AlbumDto): Promise<Album> {
    const newAlbum = new Album();

    newAlbum.id = uuidv4();
    newAlbum.name = albumDto.name;
    newAlbum.year = albumDto.year;
    newAlbum.artistId = albumDto.artistId ?? null;

    const album = await this.albumRepository.create(newAlbum);

    return await this.albumRepository.save(album);
  }

  async updateAlbum(id: string, albumDto: AlbumDto): Promise<Album> {
    const album = await getEntityById<Album>(this.albumRepository, id);

    const updatedAlbum = Object.assign({}, album);
    updatedAlbum.name = albumDto.name;
    updatedAlbum.year = albumDto.year;
    updatedAlbum.artistId = albumDto.artistId ?? null;

    return await this.albumRepository.save(updatedAlbum);
  }

  async deleteAlbum(id: string): Promise<void> {
    await deleteEntityById<Album>(this.albumRepository, id);
  }
}
