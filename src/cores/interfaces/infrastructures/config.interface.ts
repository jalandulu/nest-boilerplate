type Mode = 'local' | 'development' | 'production';

export interface IEnvironment {
  host: string;
  port: number;
}

export interface IAppEnv extends IEnvironment {
  mode: Mode;
  name: string;
}

export interface IClientEnv {
  domain: string;
}

export interface IDataServiceEnv extends IEnvironment {
  url: string;
  name: string;
  user: string;
  password: string;
}

export interface ICacheServiceEnv extends IEnvironment {
  password: string;
  ttl: number;
}

export interface IMailServiceEnv extends IEnvironment {
  username: string;
  password: string;
  from?: {
    name?: string;
    address?: string;
  };
  ignoreTLS: boolean;
  secure: boolean;
}

export interface IFirebaseServiceEnv {
  credentialPath: string;
}

export interface IStorageServiceEnv {
  host: IEnvironment['host'];
  region: string;
  bucket: string;
  baseDir: string;
  accessKeyId: string;
  accessKeySecret: string;
}

export interface IJwtServiceEnv {
  expiresIn: number;
  secretKey: string;
  issuer: string;
  audience: string;
  lifetime: number;
}

export interface IMqttServiceEnv extends IEnvironment {
  user: string;
  password: string;
}
