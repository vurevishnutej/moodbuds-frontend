import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../app/providers/CartProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/States';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import { formatINR } from '../../../utils/format';
import { profileService, type AddressDraft, type CustomerAddress } from '../../profile/services/profileService';
import { AddressModal } from '../components/AddressModal';
import { checkoutService, type CheckoutPreview } from '../services/checkoutService';
import styles from './CheckoutPage.module.css';

const displayAddress = (address: CustomerAddress) => [
  address.addressLine1,
  address.addressLine2,
  address.city,
  address.state,
  address.pincode,
  address.country,
].filter(Boolean).join(', ');

const blockerLabel = (blocker: string) => blocker.toLowerCase().replaceAll('_', ' ');

export function CheckoutPage() {
  useBodyViewClass('checkout');
  const navigate = useNavigate();
  const toast = useToast();
  const { cart } = useCart();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState('');
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const loadAddresses = useCallback(async () => {
    setAddressesLoading(true);
    setAddressesError('');
    try {
      const next = await profileService.addresses();
      setAddresses(next);
      setSelectedAddressId((current) => {
        if (current != null && next.some((address) => address.id === current)) return current;
        return next.find((address) => address.defaultAddress)?.id ?? next[0]?.id ?? null;
      });
    } catch (cause) {
      setAddressesError(cause instanceof Error ? cause.message : 'Could not load your saved addresses.');
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  useEffect(() => { void loadAddresses(); }, [loadAddresses]);

  useEffect(() => {
    if (selectedAddressId == null || cart.items.length === 0) {
      setPreview(null);
      setPreviewError('');
      return;
    }
    let active = true;
    setPreviewLoading(true);
    setPreviewError('');
    checkoutService.preview(selectedAddressId)
      .then((next) => { if (active) setPreview(next); })
      .catch((cause) => {
        if (!active) return;
        setPreview(null);
        setPreviewError(cause instanceof Error ? cause.message : 'Checkout could not be validated.');
      })
      .finally(() => { if (active) setPreviewLoading(false); });
    return () => { active = false; };
  }, [selectedAddressId, cart.items.length, cart.promoCode, cart.total]);

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;
  const totalQuantity = useMemo(() => cart.items.reduce((sum, item) => sum + item.qty, 0), [cart.items]);
  const totals = preview?.totals;
  const money = (paise: number | null | undefined) => formatINR((paise ?? 0) / 100);

  const openAddressModal = (address: CustomerAddress | null = null) => {
    setEditingAddress(address);
    setAddressModalOpen(true);
  };

  const saveAddress = async (draft: AddressDraft) => {
    setSavingAddress(true);
    try {
      const saved = editingAddress
        ? await profileService.updateAddress(editingAddress.id, draft)
        : await profileService.createAddress(draft);
      await loadAddresses();
      setSelectedAddressId(saved.id);
      setAddressModalOpen(false);
      setEditingAddress(null);
      toast.success('Delivery address saved');
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Could not save the address');
    } finally {
      setSavingAddress(false);
    }
  };

  const makeDefault = async (addressId: number) => {
    try {
      await profileService.makeDefault(addressId);
      await loadAddresses();
      setSelectedAddressId(addressId);
      toast.success('Default address updated');
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Could not update the default address');
    }
  };

  const removeAddress = async (address: CustomerAddress) => {
    if (!window.confirm(`Remove the address for ${address.fullName}?`)) return;
    try {
      await profileService.deleteAddress(address.id);
      await loadAddresses();
      toast.info('Address removed');
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Could not remove the address');
    }
  };

  const continueToPayment = () => {
    if (!preview?.readyForOrderCreation) {
      toast.error('Resolve the checkout issues before continuing.');
      return;
    }
    toast.info('Your address and totals are ready. Razorpay payment will be connected next.');
  };

  return (
    <div id="view-checkout" className="mb-page-fade">
      <div className={styles.page}>
        <nav className={styles.navbar}>
          <div className={styles.navInner}>
            <button type="button" className={styles.navBack} onClick={() => navigate('/cart')}>← Back to bag</button>
            <Link className={styles.logo} to="/">Mood<em>Buds</em></Link>
            <div className={styles.secure}>Secure checkout</div>
          </div>
        </nav>

        <div className={styles.steps} aria-label="Checkout progress">
          <div className={`${styles.step} ${styles.done}`}><span>✓</span>Bag</div>
          <i />
          <div className={`${styles.step} ${styles.active}`}><span>2</span>Address</div>
          <i />
          <div className={styles.step}><span>3</span>Payment</div>
        </div>

        {cart.items.length === 0 ? (
          <div className={styles.empty}>
            <EmptyState title="Your bag is empty" subtitle="Add something to your bag before starting checkout." action={<Link to="/">Continue shopping</Link>} />
          </div>
        ) : (
          <main className={styles.body}>
            <section>
              <h1>Select delivery address</h1>
              <p className={styles.subtitle}>Choose where you would like this order delivered.</p>

              {addressesLoading && <LoadingState label="Loading your saved addresses…" />}
              {addressesError && <ErrorState message={addressesError} onRetry={() => void loadAddresses()} />}
              {!addressesLoading && !addressesError && addresses.length === 0 && (
                <div className={styles.noAddresses}>No saved delivery addresses yet.</div>
              )}

              <div className={styles.addressList} role="radiogroup" aria-label="Delivery address">
                {addresses.map((address) => {
                  const selected = address.id === selectedAddressId;
                  return (
                    <article
                      key={address.id}
                      className={`${styles.addressCard}${selected ? ` ${styles.selected}` : ''}`}
                      role="radio"
                      aria-checked={selected}
                      tabIndex={0}
                      onClick={() => setSelectedAddressId(address.id)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedAddressId(address.id); }}
                    >
                      <span className={styles.radio} />
                      <div className={styles.addressBody}>
                        <div className={styles.addressTop}>
                          <strong>{address.fullName}</strong>
                          <span className={styles.addressType}>{address.addressType}</span>
                          {address.defaultAddress && <span className={styles.defaultTag}>Default</span>}
                        </div>
                        <p>{displayAddress(address)}</p>
                        <small>{address.mobile}</small>
                        <div className={styles.addressActions}>
                          <button type="button" onClick={(event) => { event.stopPropagation(); openAddressModal(address); }}>Edit</button>
                          {!address.defaultAddress && <button type="button" onClick={(event) => { event.stopPropagation(); void makeDefault(address.id); }}>Set as default</button>}
                          <button type="button" onClick={(event) => { event.stopPropagation(); void removeAddress(address); }}>Remove</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <button type="button" className={styles.addAddress} onClick={() => openAddressModal()}>＋ Add a new address</button>
            </section>

            <aside className={styles.summary}>
              <div className={styles.summaryLabel}>Order summary</div>
              <div className={styles.summaryRow}><span>{totalQuantity} item{totalQuantity === 1 ? '' : 's'}</span><span>{totals ? money(totals.mrpSubtotal) : formatINR(cart.subtotal + cart.savings)}</span></div>
              {(totals?.productDiscount ?? Math.round(cart.savings * 100)) > 0 && <div className={`${styles.summaryRow} ${styles.saving}`}><span>Product discount</span><span>−{totals ? money(totals.productDiscount) : formatINR(cart.savings)}</span></div>}
              {(totals?.couponDiscount ?? Math.round(cart.discount * 100)) > 0 && <div className={`${styles.summaryRow} ${styles.saving}`}><span>Coupon{preview?.coupon?.code ? ` (${preview.coupon.code})` : ''}</span><span>−{totals ? money(totals.couponDiscount) : formatINR(cart.discount)}</span></div>}
              {totals && <div className={styles.summaryRow}><span>GST</span><span>{money(totals.gstAmount)}</span></div>}
              <div className={styles.summaryRow}><span>Delivery</span><span>{totals?.shippingCost == null || totals.shippingCost === 0 ? 'Free' : money(totals.shippingCost)}</span></div>
              <div className={styles.divider} />
              <div className={styles.total}><strong>Total</strong><strong>{totals ? money(totals.grandTotal) : formatINR(cart.total)}</strong></div>
              <div className={styles.taxNote}>Inclusive of all taxes</div>

              {previewLoading && <div className={styles.validation}>Validating address, stock and totals…</div>}
              {previewError && <div className={`${styles.validation} ${styles.validationError}`}>{previewError}</div>}
              {preview && preview.blockers.length > 0 && <div className={`${styles.validation} ${styles.validationError}`}>Please resolve: {preview.blockers.map(blockerLabel).join(', ')}.</div>}
              {preview?.readyForOrderCreation && <div className={`${styles.validation} ${styles.validationReady}`}>Address, stock, coupon and totals verified.</div>}

              <button type="button" className={styles.proceed} disabled={!preview?.readyForOrderCreation || previewLoading} onClick={continueToPayment}>Continue to payment</button>
              <p className={styles.paymentNote}>Payment and order creation will be enabled after Razorpay integration. No order is created at this stage.</p>
              {selectedAddress && <div className={styles.deliverTo}>Delivering to <b>{selectedAddress.fullName}</b></div>}
            </aside>
          </main>
        )}
      </div>

      {addressModalOpen && (
        <AddressModal
          address={editingAddress}
          saving={savingAddress}
          onSave={saveAddress}
          onClose={() => { if (!savingAddress) { setAddressModalOpen(false); setEditingAddress(null); } }}
        />
      )}
    </div>
  );
}
