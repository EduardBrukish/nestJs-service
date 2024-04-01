import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    example: 'user login',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'very_strong_password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
