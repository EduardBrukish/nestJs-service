import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refreshTokenDto.dto';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entity/user.entity';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable({})
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private async generateRefreshToken(user: User): Promise<string> {
    const payload = { userId: user.id, login: user.login };
    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });
  }

  private async updateUserTokens(user: User): Promise<TokenResponseDto> {
    const payload = { userId: user.id, login: user.login };

    const updatedUser = Object.assign({}, user);
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.generateRefreshToken(user);
    updatedUser.accessToken = accessToken;
    updatedUser.refreshToken = refreshToken;

    await this.userRepository.save(updatedUser);

    return { accessToken, refreshToken }
  }

  async signUp(signUpDto: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findOne({
      where: { login: signUpDto.login },
    });

    if (existingUser) {
      throw new UnauthorizedException();
    }

    const hashPassword = await bcrypt.hash(
      signUpDto.password,
      parseInt(process.env.CRYPT_SALT),
    );

    return await this.userService.createUser({ login: signUpDto.login, password: hashPassword });
  }

  async signIn(
    signInDto: CreateUserDto,
  ): Promise<TokenResponseDto> {
    const user = await this.userService.findUserByLogin(signInDto.login);

    const isMatch = await bcrypt.compare(signInDto.password, user?.password);

    if (!isMatch) {
      throw new HttpException(`Wrong user password`, HttpStatus.FORBIDDEN);
    }

    return await this.updateUserTokens(user);
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    if (!refreshTokenDto.refreshToken)
      throw new HttpException(`Not enough token`, HttpStatus.UNAUTHORIZED);

    let decoded;

    try {
      decoded = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken);
    } catch {
      throw new HttpException(
        `Wrong or expired refresh token`,
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userService.findUser(decoded.userId);

    if (!user || (user.refreshToken !== refreshTokenDto.refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return await this.updateUserTokens(user);
  }
}
