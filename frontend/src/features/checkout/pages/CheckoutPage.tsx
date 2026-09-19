import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../app/providers/CartProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { ADDRESSES } from '../../../data/profile';
import { NewAddressModal } from '../components/NewAddressModal';
import styles from './CheckoutPage.module.css';
import type { Address } from '../../../types';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const toast = useToast();

  const [addresses] = useState<Address[]>(ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find(a => a.isDefault)?.id || addresses[0]?.id || null
  );
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [newAddresses, setNewAddresses] = useState<Address[]>([]);

  const allAddresses = [...addresses, ...newAddresses];
  const selectedAddress = allAddresses.find(a => a.id === selectedAddressId);

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleAddNewAddress = (address: Address) => {
    setNewAddresses([...newAddresses, address]);
    setSelectedAddressId(address.id);
    setShowNewAddressModal(false);
    toast.success('Address added successfully');
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    // TODO: Integrate with payment gateway
    toast.success('Proceeding to payment...');
    navigate('/profile/orders');
  };

  return (
    <div id="view-checkout">
      <div id="checkout-page">
        {/* Navbar */}
        <nav className={styles.checkoutNavbar}>
          <div className={styles.navInner}>
            <button className={styles.navBack} onClick={() => navigate('/cart')}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 2L4 6.5 8 11" />
              </svg>
              Back to bag
            </button>
            <a className={styles.navLogo} href="/">Mood<em>Buds</em></a>
            <div className={styles.navRight}>Secure checkout</div>
          </div>
        </nav>

        {/* Steps Progress */}
        <div className={styles.stepsContainer}>
          <div className={`${styles.step} ${styles.done}`}>
            <span className={styles.stepNum}>✓</span>Bag
          </div>
          <div className={styles.stepBar} />
          <div className={`${styles.step} ${styles.active}`}>
            <span className={styles.stepNum}>2</span>Address
          </div>
          <div className={styles.stepBar} />
          <div className={styles.step}>
            <span className={styles.stepNum}>3</span>Payment
          </div>
        </div>

        {/* Main Body */}
        <div className={styles.checkoutBody}>
          {/* Address Selection */}
          <div>
            <div className={styles.colTitle}>Select delivery address</div>
            <div className={styles.colSub}>Choose where you'd like your order delivered.</div>

            <div className={styles.addrList}>
              {allAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`${styles.addrCard}${selectedAddressId === addr.id ? ` ${styles.selected}` : ''}`}
                  onClick={() => handleAddressSelect(addr.id)}
                  role="radio"
                  aria-checked={selectedAddressId === addr.id}
                  tabIndex={0}
                >
                  <div className={styles.addrRadio} />
                  <div className={styles.addrBody}>
                    <div className={styles.addrTop}>
                      <div className={styles.addrName}>{addr.name}</div>
                      {addr.isDefault && <span className={`${styles.addrTag} ${styles.default}`}>Default</span>}
                    </div>
                    <div className={styles.addrText}>{addr.line}</div>
                    <div className={styles.addrPhone}>{addr.phone}</div>
                    <div className={styles.addrActions}>
                      <button className={styles.addrAction}>Edit</button>
                      {!addr.isDefault && <button className={styles.addrAction}>Set as default</button>}
                      <button className={styles.addrAction}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={styles.addNewBtn}
              onClick={() => setShowNewAddressModal(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add a new address
            </button>
          </div>

          {/* Order Summary */}
          <div className={styles.summary}>
            <div className={styles.sumLabel}>Order summary</div>

            <div className={styles.sumRow}>
              <span>{cart.items.length} items</span>
              <span>₹{cart.subtotal || 0}</span>
            </div>
            <div className={styles.sumRow}>
              <span>Delivery</span>
              <span>{cart.delivery === 0 ? 'Free' : `₹${cart.delivery}`}</span>
            </div>
            {cart.savings > 0 && (
              <div className={`${styles.sumRow} ${styles.saving}`}>
                <span>You save</span>
                <span>₹{cart.savings}</span>
              </div>
            )}

            <div className={styles.sumDivider} />
            <div className={styles.sumTotal}>
              <span className={styles.sumTotalLabel}>Total</span>
              <span className={styles.sumTotalVal}>₹{cart.total || 0}</span>
            </div>
            <div className={styles.taxNote}>Inclusive of all taxes</div>

            <button
              type="button"
              className={styles.proceedBtn}
              onClick={handleProceedToPayment}
              disabled={!selectedAddress}
            >
              Continue to payment
            </button>

            {selectedAddress && (
              <div className={styles.deliverTo}>
                Delivering to <b>{selectedAddress.name}</b>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {showNewAddressModal && (
        <NewAddressModal
          onAdd={handleAddNewAddress}
          onClose={() => setShowNewAddressModal(false)}
        />
      )}
    </div>
  );
}
