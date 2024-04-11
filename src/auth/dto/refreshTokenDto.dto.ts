import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'test refresh token',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
