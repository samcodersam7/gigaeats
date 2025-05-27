import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { UserStatus } from '@gigaeats/shared';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { confirmPassword, ...createUserData } = registerDto;

    // Validate password confirmation
    if (createUserData.password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    try {
      // Create user
      const user = await this.usersService.create(createUserData);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User registered successfully: ${user.email}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error('Registration failed:', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    try {
      // Find user with password
      const userWithPassword = await this.usersService.findByEmailWithPassword(email);
      if (!userWithPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, userWithPassword.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check user status
      if (userWithPassword.status === UserStatus.BANNED) {
        throw new UnauthorizedException('Account has been banned');
      }

      if (userWithPassword.status === UserStatus.SUSPENDED) {
        throw new UnauthorizedException('Account has been suspended');
      }

      // Remove password hash from user object
      const { passwordHash, ...user } = userWithPassword;

      // Update last login
      await this.usersService.updateLastLogin(user.id);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User logged in successfully: ${user.email}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error('Login failed:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const userWithPassword = await this.usersService.findByEmailWithPassword(email);
      if (!userWithPassword) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, userWithPassword.passwordHash);
      if (!isPasswordValid) {
        return null;
      }

      const { passwordHash, ...user } = userWithPassword;
      return user;
    } catch (error) {
      this.logger.error('User validation failed:', error);
      return null;
    }
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User | null> {
    try {
      const user = await this.usersService.findOne(payload.sub);
      
      // Check if user is still active
      if (user.status === UserStatus.BANNED || user.status === UserStatus.SUSPENDED) {
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error('JWT payload validation failed:', error);
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.generateAccessToken(user);
      return { accessToken };
    } catch (error) {
      this.logger.error('Token refresh failed:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    });
  }
}
