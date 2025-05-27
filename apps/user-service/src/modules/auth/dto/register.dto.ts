import { CreateUserDto } from '../../users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto extends CreateUserDto {
  @ApiProperty({
    description: 'Confirm password (must match password)',
    example: 'SecurePassword123!',
  })
  confirmPassword: string;
}
