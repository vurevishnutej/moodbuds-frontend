import { httpProductApi } from './httpProductApi';
import type { ProductApi } from './productApi';

export const productService: ProductApi = httpProductApi;
