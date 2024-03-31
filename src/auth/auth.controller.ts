import {
  Controller,
  Body,
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
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signInDto';
import { Public } from '../public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'The track was successfully added to the favorites.',
  })
  @ApiBadRequestResponse({ description: 'Invalid login or password' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signInDto: SignInDto): Promise<string> {
    return await 'this.favoritesService.addFavoriteTrack(id)';
  }

  @Public()
  @Post('login')
  @ApiCreatedResponse({
    description: 'The track was successfully added to the favorites.',
  })
  @ApiBadRequestResponse({ description: 'Invalid login or password' })
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
    return await this.authService.signIn(signInDto);
  }
}
