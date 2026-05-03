import { Language } from './language';

export interface AboutUs {
  id: number;
  title: string;
  description: string;
  isDeleted: boolean;
  language: Language;
}
