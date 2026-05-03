export interface Blog {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  publishedDate: string;
  seoUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  isShow: boolean;
  isActive: boolean;
  isDeleted: boolean;
}
