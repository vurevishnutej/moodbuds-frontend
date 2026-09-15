import { useEffect, useState } from 'react';
import { useToast } from '../../../app/providers/ToastProvider';
import { couponOffer, couponService, type CustomerCoupon } from '../../coupons/services/couponService';

const money=(paise:number)=>`₹${Math.round(paise/100).toLocaleString('en-IN')}`;

export function CouponsPage() {
  const toast=useToast(); const [coupons,setCoupons]=useState<CustomerCoupon[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  const load=async()=>{setLoading(true);setError('');try{setCoupons(await couponService.available());}catch{setError('The offer vault is taking a tiny coffee break. Please try again shortly.');}finally{setLoading(false);}};
  useEffect(()=>{void load();},[]);
  const copyCode=async(code:string)=>{try{await navigator.clipboard.writeText(code);toast.success(`${code} copied`);}catch{toast.info(code);}};
  return <div className="prof-panel active"><div className="prof-panel-head"><div className="prof-panel-title">Coupons</div><div className="prof-panel-sub">Offers currently available for your account</div></div><div className="prof-box">
    {loading?<div className="mb-state"><div className="mb-spinner"/><div>Unlocking your offers…</div></div>:error?<div className="mb-state"><div className="mb-state-title">Our coupon confetti got tangled</div><div className="mb-state-subtitle">{error}</div><button className="mb-state-retry" onClick={()=>void load()}>Try again</button></div>:coupons.length===0?<div className="mb-state"><div className="mb-state-title">No coupons waiting right now</div><div className="mb-state-subtitle">Fresh offers will appear here as soon as they are eligible for your account.</div></div>:<div className="coupon-grid">{coupons.map((c,i)=><div className={`coupon-card${i%3===1?' pink':i%3===2?' gold':''}`} key={c.code}><span className="coupon-badge">{c.firstOrderOnly?'First order':c.audience==='ASSIGNED_USERS'?'Just for you':'Current offer'}</span><div className="coupon-code">{c.code}</div><div className="coupon-desc">{c.description||couponOffer(c)}</div><div className="coupon-validity">{couponOffer(c)}{c.minOrderValue?` · Min ${money(c.minOrderValue)}`:''}{c.validUntil?` · Until ${new Date(c.validUntil).toLocaleDateString('en-IN')}`:' · No expiry'} · {c.remainingUses} use{c.remainingUses===1?'':'s'} left</div><button type="button" className="coupon-copy-btn" onClick={()=>void copyCode(c.code)}>Copy</button></div>)}</div>}
  </div></div>;
}
