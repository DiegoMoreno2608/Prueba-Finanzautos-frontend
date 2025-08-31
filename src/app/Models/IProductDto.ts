export interface IProductDto {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  categoryPhotoUrl: string;
  categoryId?: number;
  categoryName?: string;
}
