import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  HttpStatus,
  UsePipes,
  ParseUUIDPipe,
  Param,
  HttpCode,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { AlbumDto } from './dto/album.dto';
import { Album } from './entity/album.entity';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiOkResponse({ type: [Album] })
  async getAlbums(): Promise<Album[]> {
    return await this.albumService.getAlbums();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by id' })
  @ApiOkResponse({ type: Album })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Album with ID ${id} not found' })
  @UsePipes(ParseUUIDPipe)
  async getAlbum(@Param('id') id: string): Promise<Album> {
    return await this.albumService.findAlbum(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The artist has been successfully created.',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(@Body() albumDto: AlbumDto): Promise<Album> {
    return await this.albumService.createAlbum(albumDto);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The album data has been successfully updated.',
    type: Album,
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Album with ID ${id} not found' })
  async updateAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() albumDto: AlbumDto,
  ): Promise<Album> {
    return await this.albumService.updateAlbum(id, albumDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Album with ID ${id} was deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Album with ID ${id} not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  async deleteAlbum(@Param('id') id: string): Promise<string> {
    await this.albumService.deleteAlbum(id);

    return `Album with ID ${id} was deleted successfully`;
  }
}
