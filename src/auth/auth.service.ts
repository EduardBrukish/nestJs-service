import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signInDto';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';

@Injectable({})
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findUserByLogin(signInDto.login);
    console.log('signIn');
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, login: user.login };
    try {
      const token = await this.jwtService.signAsync(payload);
    } catch (e) {
      console.log(e);
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
