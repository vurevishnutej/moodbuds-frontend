import { apiClient } from '../../../services/api/apiClient';

export type AddressType = 'HOME' | 'WORK' | 'OTHER';
export interface CustomerAddress {
  id: number;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  addressType: AddressType;
  defaultAddress: boolean;
}
export type AddressDraft = Omit<CustomerAddress, 'id'>;

export interface CustomerOrderSummary {
  orderNumber: string;
  status: string;
  paymentMethod: string;
  itemCount: number;
  totalQuantity: number;
  primaryImageUrl?: string | null;
  totalAmount: number;
  paymentRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Page<T> { content: T[]; page: number; size: number; totalElements: number; totalPages: number; }

export const profileService = {
  addresses: () => apiClient.get<CustomerAddress[]>('/customer/addresses'),
  createAddress: (draft: AddressDraft) => apiClient.post<CustomerAddress>('/customer/addresses', draft),
  updateAddress: (id: number, draft: AddressDraft) => apiClient.put<CustomerAddress>(`/customer/addresses/${id}`, draft),
  makeDefault: (id: number) => apiClient.put<CustomerAddress>(`/customer/addresses/${id}/default`),
  deleteAddress: (id: number) => apiClient.delete<void>(`/customer/addresses/${id}`),
  orders: async () => (await apiClient.get<Page<CustomerOrderSummary>>('/customer/orders?size=100')).content,
};
