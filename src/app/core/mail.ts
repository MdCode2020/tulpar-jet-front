import { Sertificate } from './sertificate';

export interface Mail {
  id: number;
  title: string;
  smtpServer: string;
  email: string;
  password: string;
  port: number;
  sertificate: Sertificate;
}
