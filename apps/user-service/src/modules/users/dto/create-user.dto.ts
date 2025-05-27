import { IsEmail, IsString, IsEnum, IsOptional, MinLength, MaxLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@gigaeats/shared';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+60123456789',
  })
  @IsOptional()
  @IsPhoneNumber('MY')
  phone?: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.SALES_AGENT,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
