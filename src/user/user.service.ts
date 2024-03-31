import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entity/user.entity';
import { CommonNotFoundException } from '../exception/not-found.exception';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UserDto } from './dto/user.dto';

@Injectable({})
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<UserDto[]> {
    return await this.userRepository.find({
      select: ['id', 'login', 'version', 'updatedAt', 'createdAt'],
    });
  }

  async findUser(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'login', 'version', 'updatedAt', 'createdAt'],
    });

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findUserByLogin(login: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { login },
    });

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${login} not found`);
    }

    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<UserDto> {
    const newUser = {} as User;
    newUser.id = uuidv4();
    newUser.login = userDto.login;
    newUser.password = userDto.password;
    newUser.version = 1;
    newUser.createdAt = new Date().getTime();
    newUser.updatedAt = new Date().getTime();

    const userToSave = await this.userRepository.create(newUser);
    const savedUser = await this.userRepository.save(userToSave);

    const { password, ...user } = savedUser;
    return user;
  }

  async updateUserPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserDto | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException(`Wrong user password`, HttpStatus.FORBIDDEN);
    }

    const updatedUser = Object.assign({}, user);
    updatedUser.password = updatePasswordDto.newPassword;
    updatedUser.version = updatedUser.version + 1;
    updatedUser.updatedAt = new Date().getTime();

    const savedUser = await this.userRepository.save(updatedUser);

    const { password, ...userToReturn } = savedUser;
    return userToReturn;
  }

  async deleteUser(id: string): Promise<void> {
    const user: User = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);
  }
}
