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
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CommonNotFoundException } from '../exception/not-found.exception';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDto } from './dto/user.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { User } from './entity/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [UserDto] })
  getUsers(): Promise<UserDto[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'User with ID ${id} not found' })
  @UsePipes(ParseUUIDPipe)
  getUser(@Param('id') id: string): Promise<User> {
    const user = this.userService.findUser(id);

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'Body does not contain required fields',
  })
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const newUser = this.userService.createUser(createUserDto);
    return newUser;
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: UserDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'User with ID ${id} not found' })
  @ApiForbiddenResponse({ description: 'Wrong user password' })
  async updateUserPassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserPasswordDto: UpdatePasswordDto,
  ): Promise<UserDto> {
    return await this.userService.updateUserPassword(id, updateUserPasswordDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'User with ID ${id} was deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({ description: 'User with ID ${id} not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  async deleteUser(@Param('id') id: string): Promise<string> {
    await this.userService.deleteUser(id);
    return `User with ID ${id} was deleted successfully`;
  }
}
