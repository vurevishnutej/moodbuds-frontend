import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleNavbar } from '../../../components/layout/SimpleNavbar';
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
    <div id="view-checkout" className="mb-page-fade">
      <SimpleNavbar
        navId="checkout-navbar"
        innerClassName="checkout-nav-inner"
        backClassName="checkout-nav-back"
        logoClassName="checkout-nav-logo"
        rightClassName="checkout-nav-right"
        backLabel="Back"
      />

      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutContent}>
          <h1 className={styles.checkoutTitle}>Select Delivery Address</h1>

          <div className={styles.addressSelection}>
            <div className={styles.addressList}>
              {allAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`${styles.addressOption}${selectedAddressId === addr.id ? ` ${styles.selected}` : ''}`}
                  onClick={() => handleAddressSelect(addr.id)}
                  role="radio"
                  aria-checked={selectedAddressId === addr.id}
                  tabIndex={0}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => handleAddressSelect(addr.id)}
                  />
                  <div className={styles.addressDetails}>
                    <div className={styles.addressName}>{addr.name}</div>
                    <div className={styles.addressText}>
                      {addr.line}
                      <br />
                      {addr.phone}
                    </div>
                    {addr.isDefault && <span className={styles.addressDefault}>Default</span>}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={styles.addAddressBtn}
              onClick={() => setShowNewAddressModal(true)}
            >
              + Add new address
            </button>
          </div>

          <div className={styles.checkoutSummary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryItems}>
              {cart.items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span>{item.name}</span>
                  <span>×{item.qty}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{cart.subtotal || 0}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span>{cart.delivery === 0 ? 'Free' : `₹${cart.delivery || 0}`}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>₹{cart.total || 0}</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.proceedBtn}
              onClick={handleProceedToPayment}
              disabled={!selectedAddress}
            >
              Proceed to Payment
            </button>
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
