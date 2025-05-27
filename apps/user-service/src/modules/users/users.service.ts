import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationQuery, ResponseUtil, PaginatedResponse } from '@gigaeats/shared';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      const user = await this.userRepository.create(createUserDto);
      this.logger.log(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw error;
    }
  }

  async findAll(pagination: PaginationQuery): Promise<PaginatedResponse<User>> {
    try {
      const { users, total } = await this.userRepository.findMany(pagination);
      
      return ResponseUtil.paginated(
        users,
        pagination.page || 1,
        pagination.limit || 10,
        total,
        'Users retrieved successfully'
      );
    } catch (error) {
      this.logger.error('Failed to retrieve users:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(updateUserDto.email);
      if (userWithEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    try {
      const updatedUser = await this.userRepository.update(id, updateUserDto);
      this.logger.log(`User updated successfully: ${id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error('Failed to update user:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.userRepository.delete(id);
      this.logger.log(`User deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error('Failed to delete user:', error);
      throw error;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.userRepository.updateLastLogin(id);
    } catch (error) {
      this.logger.error('Failed to update last login:', error);
      // Don't throw error for last login update failure
    }
  }

  // Internal method for authentication service
  async findByEmailWithPassword(email: string): Promise<(User & { passwordHash: string }) | null> {
    return this.userRepository.findByEmailWithPassword(email);
  }
}
