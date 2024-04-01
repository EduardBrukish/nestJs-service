import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUpDto.dto';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entity/user.entity';
import { RefreshTokenDto } from './dto/refreshTokenDto.dto';

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

  async signUp(signUpDto: SignUpDto): Promise<UserDto> {
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
    const newUser = {} as User;
    newUser.id = uuidv4();
    newUser.login = signUpDto.login;
    newUser.password = hashPassword;
    newUser.version = 1;
    newUser.createdAt = new Date().getTime();
    newUser.updatedAt = new Date().getTime();
    newUser.accessToken = 'mock';
    newUser.refreshToken = 'mock';

    const userToSave = await this.userRepository.create(newUser);
    const savedUser = await this.userRepository.save(userToSave);

    const { password, ...user } = savedUser;
    return user;
  }

  async signIn(
    signInDto: SignUpDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findUserByLogin(signInDto.login);

    const isMatch = await bcrypt.compare(signInDto.password, user?.password);

    if (!isMatch) {
      throw new HttpException(`Wrong user password`, HttpStatus.FORBIDDEN);
    }
    const payload = { userId: user.id, login: user.login };

    const updatedUser = Object.assign({}, user);
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.generateRefreshToken(user);
    updatedUser.accessToken = accessToken;
    updatedUser.refreshToken = refreshToken;

    await this.userRepository.save(updatedUser);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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

    if (!user || user.refreshToken !== refreshTokenDto.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { userId: user.id, login: user.login };
    const updatedUser = Object.assign({}, user);
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.generateRefreshToken(user);
    updatedUser.accessToken = accessToken;
    updatedUser.refreshToken = refreshToken;

    await this.userRepository.save(updatedUser);

    return {
      accessToken,
      refreshToken,
    };
  }
}
