import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'; 
import { SignUpDto } from './dto/signUpDto';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entity/user.entity';

@Injectable({})
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findOne({ where: { login: signUpDto.login } });
console.log('signUpDto', existingUser)
    if (existingUser) {
      throw new UnauthorizedException();
    }

    const newUser = {} as User;
    newUser.id = uuidv4();
    newUser.login = signUpDto.login;
    newUser.password = signUpDto.password;
    newUser.version = 1;
    newUser.createdAt = new Date().getTime();
    newUser.updatedAt = new Date().getTime();

    const userToSave = await this.userRepository.create(newUser);
    const savedUser = await this.userRepository.save(userToSave);

    const { password, ...user } = savedUser;
    return user;
  }

  async signIn(signInDto: SignUpDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findUserByLogin(signInDto.login);

    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, login: user.login };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
