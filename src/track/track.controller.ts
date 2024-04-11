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
import { TrackService } from './track.service';
import { TrackDto } from './dto/track.dto';
import { Track } from './entity/track.entity';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiOkResponse({ type: [Track] })
  async getTracks(): Promise<Track[]> {
    return await this.trackService.getTracks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by id' })
  @ApiOkResponse({ type: Track })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Track with ID ${id} not found' })
  @UsePipes(ParseUUIDPipe)
  async getTrack(@Param('id') id: string): Promise<Track> {
    return await this.trackService.findTrack(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The track has been successfully created.',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  @HttpCode(HttpStatus.CREATED)
  async createTrack(@Body() trackDto: TrackDto): Promise<Track> {
    return await this.trackService.createTrack(trackDto);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The track data has been successfully updated.',
    type: Track,
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Track with ID ${id} not found' })
  async updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() trackDto: TrackDto,
  ): Promise<Track> {
    return await this.trackService.updateTrack(id, trackDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Track with ID ${id} was deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'Track with ID ${id} not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  async deleteTrack(@Param('id') id: string): Promise<string> {
    await this.trackService.deleteTrack(id);

    return `Track with ID ${id} was deleted successfully`;
  }
}
