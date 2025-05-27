import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus, BaseEntity } from '@gigaeats/shared';

export class User implements BaseEntity {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+60123456789',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.SALES_AGENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User account status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Whether email is verified',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Whether phone is verified',
    example: false,
  })
  phoneVerified: boolean;

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User deletion timestamp (soft delete)',
    example: null,
    required: false,
  })
  deletedAt?: Date;

  // Password hash is excluded from the entity for security
}
