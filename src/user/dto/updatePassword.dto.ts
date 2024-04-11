import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'dskvfvk*&%bisd',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'dsfbfbf9)*&dfs',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
