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
import { SignUpDto } from './dto/signUpDto';
import { Public } from '../public.decorator';
import { UserDto } from '../user/dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiCreatedResponse({
    description: 'The track was successfully added to the favorites.',
  })
  @ApiBadRequestResponse({ description: 'Invalid login or password' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserDto> {
    return await this.authService.signUp(signUpDto)
  }

  @Public()
  @Post('login')
  @ApiCreatedResponse({
    description: 'The track was successfully added to the favorites.',
  })
  @ApiBadRequestResponse({ description: 'Invalid login or password' })
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() signInDto: SignUpDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signInDto);
  }
}
