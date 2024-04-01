import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse
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
    description: 'The user was successfully added.',
  })
  @ApiBadRequestResponse({ description: 'Invalid login or password' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto): Promise<UserDto> {
    return await this.authService.signUp(signUpDto)
  }

  @Public()
  @Post('login')
  @ApiOkResponse({
    description: 'The user was successfully logged.',
  })
  @ApiBadRequestResponse({ description: 'Invalid login or password' })
  @ApiForbiddenResponse({ description: 'Wrong user password' })
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() signInDto: SignUpDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signInDto);
  }
}
