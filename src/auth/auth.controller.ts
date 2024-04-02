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
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokenResponseDto } from './dto/token-response.dto';
import { Public } from '../public.decorator';
import { UserDto } from '../user/dto/user.dto';
import { CreateUserDto } from '../user/dto/createUser.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiCreatedResponse({
    description: 'The user was successfully added.',
    type: UserDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid login or password' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: CreateUserDto): Promise<UserDto> {
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('login')
  @ApiOkResponse({
    description: 'The user was successfully logged.',
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid login or password' })
  @ApiForbiddenResponse({ description: 'Wrong user password' })
  async login(
    @Body() signInDto: CreateUserDto,
  ): Promise<TokenResponseDto> {
    return await this.authService.signIn(signInDto);
  }

  @Public()
  @Post('refresh')
  @ApiOkResponse({
    description: 'The token was successfully updated.',
    type: TokenResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiForbiddenResponse({ description: 'Refresh token is invalid or expired' })
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshToken: { refreshToken: string },
  ): Promise<TokenResponseDto> {
    return await this.authService.refresh(refreshToken);
  }
}
