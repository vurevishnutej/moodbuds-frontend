import { useState } from 'react';
import { couponOffer } from '../../coupons/services/couponService';
import { useHomepageCoupon } from '../../coupons/hooks/useHomepageCoupon';

export function OfferBanner() {
  const [visible,setVisible]=useState(true); const coupon=useHomepageCoupon();
  if(!visible||!coupon)return null;
  return <div id="offer-banner"><div className="banner-inner"><span className="banner-badge">🔥 First-look deal</span><div className="banner-sep"/><span className="banner-main"><em>{couponOffer(coupon)}</em> on your first order</span><div className="banner-sep"/><span className="banner-sub">{coupon.minOrderValue?`Minimum order ₹${Math.round(coupon.minOrderValue/100).toLocaleString('en-IN')}`:'Made for your first MoodBuds moment'}</span><div className="banner-sep"/><span className="banner-code">CODE: {coupon.code}</span></div><button className="banner-close" type="button" onClick={()=>setVisible(false)}>✕</button></div>;
}
