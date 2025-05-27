import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './modules/database/database.module';
import { configuration } from './config/configuration';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // JWT module
    JwtModule.registerAsync({
      useFactory: (configService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
      inject: [ConfigModule],
    }),

    // Passport module
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Feature modules
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
