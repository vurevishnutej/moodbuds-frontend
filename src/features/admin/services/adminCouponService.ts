import { apiClient } from '../../../services/api/apiClient';
import { adminAuthOptions } from './adminQuizService';
import type { AdminSummary } from './adminQuizService';

export type CouponType = 'FLAT' | 'PERCENTAGE';
export type AudienceType = 'PUBLIC' | 'PRIVATE_CODE' | 'ASSIGNED_USERS';
export interface AdminCoupon { id:number; code:string; description?:string; type:CouponType; discountValue:number; minOrderValue:number; maxDiscountAmount?:number|null; usageLimitGlobal?:number|null; usageLimitPerUser:number; currentUsageCount:number; audienceType:AudienceType; firstOrderOnly:boolean; showOnHomepage:boolean; active:boolean; status:string; validFrom:string; validUntil?:string|null; assignedUserCount:number; totalDiscountGiven:number; createdAt:string; updatedAt:string; }
export interface CouponDraft { code:string; description:string; type:CouponType; discountValue:number; minOrderValue:number; maxDiscountAmount:number|null; usageLimitGlobal:number|null; usageLimitPerUser:number; audienceType:AudienceType; firstOrderOnly:boolean; showOnHomepage:boolean; active:boolean; validFrom:string; validUntil:string|null; assignedUserIds?:number[]; }
export interface CouponStats { activeCoupons:number; redemptionsLast30Days:number; discountLast30Days:number; topCode:string|null; }
export interface CouponAssignment { id:number; couponId:number; userId:number; customerEmail:string; customerName:string; usageLimitOverride?:number|null; usageCount:number; active:boolean; assignedReason?:string; refundId?:number|null; }
export interface CustomerChoice { id:number; email:string; first_name?:string; last_name?:string; firstName?:string; lastName?:string; }
interface Page<T> { content:T[]; page:number; size:number; totalElements:number; totalPages:number; }

export const adminCouponService = {
  async login(username:string,password:string):Promise<AdminSummary>{
    const response=await apiClient.post<{accessToken:string;admin:AdminSummary}>('/admin/auth/login',{username,password},{includeAuth:false});
    if(response.admin.role!=='SUPER_ADMIN'&&!response.admin.permissions.includes('coupons.manage'))throw new Error('This account does not have coupon management access.');
    sessionStorage.setItem('moodbuds_admin_access_token',response.accessToken);
    sessionStorage.setItem('moodbuds_admin_summary',JSON.stringify(response.admin));
    return response.admin;
  },
  list: () => apiClient.get<Page<AdminCoupon>>('/admin/coupons?size=100', adminAuthOptions()),
  stats: () => apiClient.get<CouponStats>('/admin/coupons/stats', adminAuthOptions()),
  create: (draft:CouponDraft) => apiClient.post<AdminCoupon>('/admin/coupons', draft, adminAuthOptions()),
  update: (id:number,draft:CouponDraft) => apiClient.put<AdminCoupon>(`/admin/coupons/${id}`, draft, adminAuthOptions()),
  status: (id:number,active:boolean) => apiClient.patch<AdminCoupon>(`/admin/coupons/${id}/status`, {active}, adminAuthOptions()),
  assignments: (id:number) => apiClient.get<Page<CouponAssignment>>(`/admin/coupons/${id}/assignments?size=100`, adminAuthOptions()),
  assign: (couponId:number,userId:number,input:{usageLimitOverride:number|null;assignedReason:string;refundId:number|null}) => apiClient.post<CouponAssignment>(`/admin/coupons/${couponId}/assignments`,{userId,...input,active:true},adminAuthOptions()),
  customers: (query:string) => apiClient.get<Page<CustomerChoice>>(`/admin/customers?size=20&q=${encodeURIComponent(query)}`, adminAuthOptions()),
};
