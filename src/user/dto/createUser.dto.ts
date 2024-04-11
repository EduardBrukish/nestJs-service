import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user login',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'user password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
