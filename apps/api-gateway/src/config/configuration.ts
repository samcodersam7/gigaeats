export const configuration = () => ({
  port: parseInt(process.env.API_GATEWAY_PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'gigaeats_user',
    password: process.env.DATABASE_PASSWORD || 'password',
    name: process.env.DATABASE_NAME || 'gigaeats_dev',
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },

  // Microservices URLs
  services: {
    userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    vendorService: process.env.VENDOR_SERVICE_URL || 'http://localhost:3002',
    orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
    paymentService: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
    integrationService: process.env.INTEGRATION_SERVICE_URL || 'http://localhost:3005',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // Feature Flags
  features: {
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === 'true',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'combined',
  },

  // External APIs
  external: {
    lalamove: {
      apiKey: process.env.LALAMOVE_API_KEY,
      secret: process.env.LALAMOVE_SECRET,
      sandbox: process.env.LALAMOVE_SANDBOX === 'true',
    },
    payment: {
      billplz: {
        apiKey: process.env.BILLPLZ_API_KEY,
        xSignature: process.env.BILLPLZ_X_SIGNATURE,
        sandbox: process.env.BILLPLZ_SANDBOX === 'true',
      },
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    },
    communication: {
      sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        fromEmail: process.env.FROM_EMAIL || 'noreply@gigaeats.com',
      },
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
      },
    },
  },
});
