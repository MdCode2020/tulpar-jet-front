import { Language } from './language';

export interface PromoVideo {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  isDeleted: boolean;
  language: Language;
}
