import {
  Controller,
  Get,
  Delete,
  Param,
  UsePipes,
  ParseUUIDPipe,
  Body,
  Post,
  Put,
  HttpException,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CommonNotFoundException } from '../exception/not-found.exception';
import { User, UserWithoutPassword } from './interfaces/user.interface';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(): User[] {
    return this.userService.getUsers();
  }

  @Get(':id')
  @UsePipes(ParseUUIDPipe)
  getUser(@Param('id') id: string): User {
    const user = this.userService.findUser(id);

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): UserWithoutPassword {
    const newUser = this.userService.createUser(createUserDto);
    return newUser;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateUserPassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserPasswordDto: UpdatePasswordDto,
  ): UserWithoutPassword {
    const user = this.userService.findUser(id);

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserPasswordDto.oldPassword !== user.password) {
      throw new HttpException(`Wrong user password`, HttpStatus.FORBIDDEN);
    }

    const updatedUser = this.userService.updateUserPassword(
      user,
      updateUserPasswordDto.newPassword,
    );
    return updatedUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  deleteUser(@Param('id') id: string): string {
    const user = this.userService.findUser(id);

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    this.userService.deleteUser(id);

    return `User with ID ${id} was deleted successfully`;
  }
}
