export interface ProductSearchParams {
  page: number;
  pageSize: number;
  q?: string | null;
  categoryId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}
