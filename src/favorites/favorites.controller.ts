import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UsePipes,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { FavoritesResponseDto } from './dto/favorites.dto';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @ApiOkResponse({ type: [FavoritesResponseDto] })
  async getFavorites(): Promise<FavoritesResponseDto> {
    return await this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @ApiCreatedResponse({
    description: 'The track was successfully added to the favorites.',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiUnprocessableEntityResponse({
    description: 'Track with ID ${id} does not exist',
  })
  @UsePipes(ParseUUIDPipe)
  async addFavoriteTrack(@Param('id') id: string): Promise<string> {
    return await this.favoritesService.addFavoriteTrack(id);
  }

  @Delete('track/:id')
  @ApiNoContentResponse({
    description: 'Track with ID ${id} was deleted from favorites',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({
    description: 'Track with ID ${id} not found in favorites',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  async removeFavoriteTrack(@Param('id') id: string): Promise<string> {
    return await this.favoritesService.deleteFavoriteTrack(id);
  }

  @Post('album/:id')
  @ApiCreatedResponse({
    description: 'The album was successfully added to the favorites.',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiUnprocessableEntityResponse({
    description: 'Album with ID ${id} does not exist',
  })
  @UsePipes(ParseUUIDPipe)
  async addFavoriteAlbum(@Param('id') id: string): Promise<string> {
    return await this.favoritesService.addFavoriteAlbum(id);
  }

  @Delete('album/:id')
  @ApiNoContentResponse({
    description: 'Album with ID ${id} was deleted from favorites',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({
    description: 'Album with ID ${id} not found in favorites',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  async removeFavoriteAlbum(@Param('id') id: string): Promise<string> {
    return await this.favoritesService.deleteFavoriteAlbum(id);
  }

  @Post('artist/:id')
  @ApiCreatedResponse({
    description: 'The artist was successfully added to the favorites.',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiUnprocessableEntityResponse({
    description: 'Artist with ID ${id} does not exist',
  })
  @UsePipes(ParseUUIDPipe)
  async addFavoriteArtist(@Param('id') id: string): Promise<string> {
    return await this.favoritesService.addFavoriteArtist(id);
  }

  @Delete('artist/:id')
  @ApiNoContentResponse({
    description: 'Artist with ID ${id} was deleted from favorites',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({
    description: 'Artist with ID ${id} not found in favorites',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  async removeFavoriteArtist(@Param('id') id: string): Promise<string> {
    return await this.favoritesService.deleteFavoriteArtist(id);
  }
}
