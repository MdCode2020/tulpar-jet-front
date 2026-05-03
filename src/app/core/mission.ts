import { Language } from './language';

export interface Mission {
  id: number;
  title: string;
  description: string;
  isDeleted: boolean;
  language: Language;
}
