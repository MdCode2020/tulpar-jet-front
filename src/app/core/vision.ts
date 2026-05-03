import { Language } from './language';

export interface Vision {
  id: number;
  title: string;
  description: string;
  isDeleted: boolean;
  language: Language;
}
