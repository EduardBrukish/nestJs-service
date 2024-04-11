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
import { ArtistService } from './artist.service';
import { ArtistDto } from './dto/artist.dto';
import { Artist } from './entity/artist.entity';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiOkResponse({ type: [Artist] })
  async getArtists(): Promise<Artist[]> {
    return await this.artistService.getArtists();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by id' })
  @ApiOkResponse({ type: Artist })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Artist with ID ${id} not found' })
  @UsePipes(ParseUUIDPipe)
  async getArtist(@Param('id') id: string): Promise<Artist> {
    return await this.artistService.findArtist(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The artist has been successfully created.',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  async createArtist(@Body() artistDto: ArtistDto): Promise<Artist> {
    return await this.artistService.createArtist(artistDto);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The artist data has been successfully updated.',
    type: Artist,
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Artist with ID ${id} not found' })
  async updateArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateArtistDto: ArtistDto,
  ): Promise<Artist> {
    return await this.artistService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Artist with ID ${id} was deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Artist with ID ${id} not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  async deleteArtist(@Param('id') id: string): Promise<string> {
    await this.artistService.deleteArtist(id);

    return `Artist with ID ${id} was deleted successfully`;
  }
}
