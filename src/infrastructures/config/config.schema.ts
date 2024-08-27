import * as Joi from 'joi';

export const configSchema = Joi.object({
  APP_NAME: Joi.string().optional(),
  APP_PORT: Joi.number().port().default(3000),
  APP_MODE: Joi.string()
    .valid('local', 'development', 'production', 'test')
    .default('local'),

  DB_URL: Joi.string(),

  REDIS_HOST: Joi.string(),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string(),
  REDIS_TTL: Joi.number().default(1000),

  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().port().default(587),
  SMTP_USERNAME: Joi.string().optional(),
  SMTP_PASSWORD: Joi.string().optional(),
  SMTP_FROM: Joi.string().optional(),
  SMTP_IGNORE_TLS: Joi.bool().default(false),
  SMTP_SECURE: Joi.bool().default(false),

  S3_HOST: Joi.string().allow('').optional(),
  S3_DEFAULT_REGION: Joi.string().allow('').optional(),
  S3_BUCKET: Joi.string().allow('').optional(),
  S3_BASE_DIR: Joi.string().allow('').optional(),
  S3_ACCESS_KEY_ID: Joi.string().allow('').optional(),
  S3_ACCESS_KEY_SECRET: Joi.string().allow('').optional(),

  JWT_SECRET: Joi.string().allow(''),
  JWT_ISSUER: Joi.string().allow('').optional(),
  JWT_AUDIENCE: Joi.string().allow('').optional(),
  JWT_EXPIRE: Joi.number().allow('').optional().default(300),

  FIREBASE_CREDENTIAL_PATH: Joi.string().allow('').optional(),

  MQTT_HOST: Joi.string(),
  MQTT_PORT: Joi.number().port().default(6379),
  MQTT_USER: Joi.string(),
  MQTT_PASSWORD: Joi.string(),
});
