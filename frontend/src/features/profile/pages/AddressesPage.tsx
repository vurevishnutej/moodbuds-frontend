import { useEffect, useState } from 'react';
import { useToast } from '../../../app/providers/ToastProvider';
import { profileService, type AddressDraft, type CustomerAddress } from '../services/profileService';

const EMPTY: AddressDraft = { fullName: '', mobile: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', pincode: '', addressType: 'HOME', defaultAddress: false };

export function AddressesPage() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [draft, setDraft] = useState<AddressDraft>(EMPTY);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const load = async () => { setLoading(true); try { setAddresses(await profileService.addresses()); } catch (cause) { toast.error(cause instanceof Error ? cause.message : 'Could not load addresses'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const edit = (address: CustomerAddress) => { const { id: _id, ...value } = address; setEditing(address.id); setDraft(value); setShowForm(true); };
  const save = async (event: React.FormEvent) => { event.preventDefault(); try { if (editing) await profileService.updateAddress(editing, draft); else await profileService.createAddress(draft); setShowForm(false); setEditing(null); setDraft(EMPTY); await load(); toast.success('Address saved'); } catch (cause) { toast.error(cause instanceof Error ? cause.message : 'Could not save address'); } };
  const makeDefault = async (id: number) => { try { await profileService.makeDefault(id); await load(); toast.success('Default address updated'); } catch (cause) { toast.error(cause instanceof Error ? cause.message : 'Could not update address'); } };
  const remove = async (id: number) => { try { await profileService.deleteAddress(id); await load(); toast.info('Address removed'); } catch (cause) { toast.error(cause instanceof Error ? cause.message : 'Could not remove address'); } };

  return <div className="prof-panel active"><div className="prof-panel-head"><div className="prof-panel-title">Addresses</div><div className="prof-panel-sub">Manage delivery addresses stored with your account</div></div><div className="prof-box">
    {loading ? <div className="mb-state"><div className="mb-spinner"/></div> : <div className="addr-grid">{addresses.map((address) => <div className={`addr-card${address.defaultAddress ? ' default' : ''}`} key={address.id}>
      {address.defaultAddress && <span className="addr-default-tag">Default</span>}<div className="addr-name">{address.fullName}</div><div className="addr-text">{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br/>{address.city}, {address.state} {address.pincode}<br/>{address.country}<br/>{address.mobile}</div>
      <div className="addr-actions"><button type="button" className="addr-action-btn" onClick={() => edit(address)}>Edit</button>{!address.defaultAddress && <button type="button" className="addr-action-btn" onClick={() => void makeDefault(address.id)}>Set as default</button>}<button type="button" className="addr-action-btn" onClick={() => void remove(address.id)}>Remove</button></div>
    </div>)}</div>}
    <button type="button" className="addr-add-btn" onClick={() => { setDraft(EMPTY); setEditing(null); setShowForm((value) => !value); }}>+ Add new address</button>
    {showForm && <form className="prof-form address-form" onSubmit={save}>
      <div className="prof-form-row"><div className="prof-field"><label>Full name</label><input required value={draft.fullName} onChange={(e)=>setDraft({...draft,fullName:e.target.value})}/></div><div className="prof-field"><label>Mobile</label><input required value={draft.mobile} onChange={(e)=>setDraft({...draft,mobile:e.target.value.replace(/[\s()-]/g,'')})}/></div></div>
      <div className="prof-field"><label>Address line 1</label><input required value={draft.addressLine1} onChange={(e)=>setDraft({...draft,addressLine1:e.target.value})}/></div><div className="prof-field"><label>Address line 2</label><input value={draft.addressLine2 || ''} onChange={(e)=>setDraft({...draft,addressLine2:e.target.value})}/></div>
      <div className="prof-form-row"><div className="prof-field"><label>City</label><input required value={draft.city} onChange={(e)=>setDraft({...draft,city:e.target.value})}/></div><div className="prof-field"><label>State</label><input required value={draft.state} onChange={(e)=>setDraft({...draft,state:e.target.value})}/></div></div>
      <div className="prof-form-row"><div className="prof-field"><label>PIN code</label><input required value={draft.pincode} onChange={(e)=>setDraft({...draft,pincode:e.target.value})}/></div><div className="prof-field"><label>Type</label><select value={draft.addressType} onChange={(e)=>setDraft({...draft,addressType:e.target.value as AddressDraft['addressType']})}><option value="HOME">Home</option><option value="WORK">Work</option><option value="OTHER">Other</option></select></div></div>
      <label className="form-checkbox"><input type="checkbox" checked={draft.defaultAddress} onChange={(e)=>setDraft({...draft,defaultAddress:e.target.checked})}/> Make this my default address</label><button className="prof-save-btn" type="submit">{editing ? 'Update Address' : 'Save Address'}</button>
    </form>}
  </div></div>;
}
