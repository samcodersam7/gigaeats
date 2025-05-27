import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole, UserStatus, PaginationQuery } from '@gigaeats/shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 12);

    const query = `
      INSERT INTO user_service.users (
        email, password_hash, first_name, last_name, phone, role, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, first_name, last_name, phone, role, status, 
                email_verified, phone_verified, last_login_at, created_at, updated_at, deleted_at
    `;

    const values = [
      userData.email,
      passwordHash,
      userData.firstName,
      userData.lastName,
      userData.phone || null,
      userData.role,
      UserStatus.PENDING,
    ];

    const result = await this.databaseService.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, first_name, last_name, phone, role, status,
             email_verified, phone_verified, last_login_at, created_at, updated_at, deleted_at
      FROM user_service.users 
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] ? this.mapRowToUser(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, first_name, last_name, phone, role, status,
             email_verified, phone_verified, last_login_at, created_at, updated_at, deleted_at
      FROM user_service.users 
      WHERE email = $1 AND deleted_at IS NULL
    `;

    const result = await this.databaseService.query(query, [email]);
    return result.rows[0] ? this.mapRowToUser(result.rows[0]) : null;
  }

  async findByEmailWithPassword(email: string): Promise<(User & { passwordHash: string }) | null> {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, phone, role, status,
             email_verified, phone_verified, last_login_at, created_at, updated_at, deleted_at
      FROM user_service.users 
      WHERE email = $1 AND deleted_at IS NULL
    `;

    const result = await this.databaseService.query(query, [email]);
    if (!result.rows[0]) return null;

    const user = this.mapRowToUser(result.rows[0]);
    return { ...user, passwordHash: result.rows[0].password_hash };
  }

  async findMany(pagination: PaginationQuery): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', search } = pagination;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE deleted_at IS NULL';
    const queryParams: any[] = [];

    if (search) {
      whereClause += ` AND (first_name ILIKE $${queryParams.length + 1} OR last_name ILIKE $${queryParams.length + 1} OR email ILIKE $${queryParams.length + 1})`;
      queryParams.push(`%${search}%`);
    }

    // Count query
    const countQuery = `SELECT COUNT(*) FROM user_service.users ${whereClause}`;
    const countResult = await this.databaseService.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Data query
    const dataQuery = `
      SELECT id, email, first_name, last_name, phone, role, status,
             email_verified, phone_verified, last_login_at, created_at, updated_at, deleted_at
      FROM user_service.users 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);
    const dataResult = await this.databaseService.query(dataQuery, queryParams);
    const users = dataResult.rows.map(row => this.mapRowToUser(row));

    return { users, total };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(updateUserDto).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'firstName') {
          fields.push(`first_name = $${paramIndex}`);
        } else if (key === 'lastName') {
          fields.push(`last_name = $${paramIndex}`);
        } else {
          fields.push(`${key} = $${paramIndex}`);
        }
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    const query = `
      UPDATE user_service.users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id, email, first_name, last_name, phone, role, status,
                email_verified, phone_verified, last_login_at, created_at, updated_at, deleted_at
    `;

    values.push(id);
    const result = await this.databaseService.query(query, values);
    return result.rows[0] ? this.mapRowToUser(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const query = `
      UPDATE user_service.users 
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
    `;

    const result = await this.databaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  async updateLastLogin(id: string): Promise<void> {
    const query = `
      UPDATE user_service.users 
      SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;

    await this.databaseService.query(query, [id]);
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      emailVerified: row.email_verified,
      phoneVerified: row.phone_verified,
      lastLoginAt: row.last_login_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }
}
