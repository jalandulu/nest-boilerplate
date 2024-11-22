export default () => {
  const host = process.env.APP_MODE === 'local' ? '127.0.0.1' : '0.0.0.0';

  return {
    app: {
      host,
      port: parseInt(process.env.APP_PORT || '3000'),
      mode: process.env.APP_MODE,
      name: process.env.APP_NAME,
      key: process.env.APP_KEY,
    },
    signature: {
      key: process.env.SIGNATURE_KEY,
      ttl: parseInt(process.env.SIGNATURE_TTL || '86400'),
    },
    client: {
      domain: process.env.CLIENT_DOMAIN.trim().split(','),
    },
    database: {
      url: process.env.DB_URL,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || null,
      ttl: parseInt(process.env.REDIS_TTL || '60000'),
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      username: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
      from: {
        name: process.env.SMTP_FROM_NAME,
        address: process.env.SMTP_FROM_ADDRESS,
      },
      ignoreTLS: process.env.SMTP_IGNORE_TLS === 'true',
      secure: process.env.SMTP_SECURE === 'true',
    },
    s3: {
      host: process.env.S3_HOST,
      url: process.env.S3_URL,
      region: process.env.S3_DEFAULT_REGION,
      bucket: process.env.S3_BUCKET,
      baseDir: process.env.S3_BASE_DIR,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      accessKeySecret: process.env.S3_ACCESS_KEY_SECRET,
    },
    jwt: {
      strategy: process.env.JWT_STRATEGY || 'cache',
      expiresIn: parseInt(process.env.JWT_EXPIRE || '300'),
      secretKey: process.env.JWT_SECRET,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      lifetime: parseInt(process.env.JWT_LIFETIME),
    },
    firebase: {
      credentialPath: process.env.FIREBASE_CREDENTIAL_PATH,
    },
    verification: {
      emailTtl: parseInt(process.env.EMAIL_VERIFICATION_TTL || '300'),
      emailRefreshTtl: parseInt(process.env.EMAIL_VERIFICATION_REFRESH_TTL || '60'),
      resetTtl: parseInt(process.env.RESET_VERIFICATION_TTL || '300'),
      resetRefreshTtl: parseInt(process.env.RESET_VERIFICATION_REFRESH_TTL || '60'),
    },
    mqtt: {
      host: process.env.MQTT_HOST,
      port: process.env.MQTT_PORT,
      user: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD,
    },
  };
};
