import { Language } from './language';

export interface Slider {
  id: number;
  title: string;
  language: Language;
  titleRed: string;
  description: string;
  isDeleted: boolean;
}
