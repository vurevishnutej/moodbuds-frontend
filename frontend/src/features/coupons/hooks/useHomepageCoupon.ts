import { useEffect, useState } from 'react';
import { couponService, type CustomerCoupon } from '../services/couponService';

export function useHomepageCoupon() {
  const [coupon,setCoupon]=useState<CustomerCoupon|null>(null);
  useEffect(()=>{let live=true;couponService.homepage().then(value=>{if(live)setCoupon(value);}).catch(()=>{if(live)setCoupon(null);});return()=>{live=false;};},[]);
  return coupon;
}
