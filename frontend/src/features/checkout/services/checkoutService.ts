import { apiClient } from '../../../services/api/apiClient';
import type { CustomerAddress } from '../../profile/services/profileService';

export interface CheckoutTotals {
  mrpSubtotal: number;
  productDiscount: number;
  sellingSubtotal: number;
  couponDiscount: number;
  taxableSubtotal: number;
  gstAmount: number;
  shippingCost?: number | null;
  grandTotal: number;
}

export interface CheckoutPreview {
  cartValid: boolean;
  addressValid: boolean;
  readyForOrderCreation: boolean;
  blockers: string[];
  pendingIntegrations: string[];
  shippingAddress: CustomerAddress;
  coupon?: { code: string } | null;
  totals: CheckoutTotals;
}

export const checkoutService = {
  preview: (addressId: number) =>
    apiClient.post<CheckoutPreview>('/customer/checkout/preview', { addressId }),
};
