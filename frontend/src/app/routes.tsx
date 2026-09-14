import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../features/home/pages/HomePage';
import { ProductListingPage } from '../features/products/pages/ProductListingPage';
import { ProductDetailsPage } from '../features/products/pages/ProductDetailsPage';
import { SearchResultsPage } from '../features/products/pages/SearchResultsPage';
import { CartPage } from '../features/cart/pages/CartPage';
import { WishlistPage } from '../features/wishlist/pages/WishlistPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ProfileLayout } from '../features/profile/pages/ProfileLayout';
import { ProfileOverviewPage } from '../features/profile/pages/ProfileOverviewPage';
import { ProfileInfoPage } from '../features/profile/pages/ProfileInfoPage';
import { OrdersPage } from '../features/profile/pages/OrdersPage';
import { AddressesPage } from '../features/profile/pages/AddressesPage';
import { CouponsPage } from '../features/profile/pages/CouponsPage';
import { ContactPage } from '../features/profile/pages/ContactPage';
import { AdminLayout, AdminHub } from '../features/admin/pages/AdminLayout';
import { EditProductsPage } from '../features/admin/pages/EditProductsPage';
import { CreateProductPage } from '../features/admin/pages/CreateProductPage';
import { OrderListPage } from '../features/admin/pages/OrderListPage';
import { OrderDetailsPage } from '../features/admin/pages/OrderDetailsPage';
import { StockOverviewPage } from '../features/admin/pages/StockOverviewPage';
import { MoodsPage } from '../features/admin/pages/MoodsPage';
import { QuizManagementPage } from '../features/admin/pages/QuizManagementPage';
import { BannersPage } from '../features/admin/pages/BannersPage';
import { AdminCouponsPage } from '../features/admin/pages/AdminCouponsPage';
import { CategoriesPage, SubcategoriesPage } from '../features/admin/pages/CategoryPages';
import {
  BulkImportExportPage,
  ShippingQueuePage,
  TrackingPage,
  ReturnRequestsPage,
  RefundCenterPage,
} from '../features/admin/pages/OperationsPages';
import {
  AboutContactPage,
  SocialLinksPage,
  AdminAccountsPage,
  RolesPermissionsPage,
} from '../features/admin/pages/GovernancePages';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Product Routes */}
      <Route path="/mood/:moodId" element={<ProductListingPage />} />
      <Route path="/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/search" element={<SearchResultsPage />} />

      {/* User Routes (Protected) */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />

      <Route path="/profile" element={<ProfileLayout />}>
        <Route index element={<ProfileOverviewPage />} />
        <Route path="info" element={<ProfileInfoPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="addresses" element={<AddressesPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="contact" element={<ContactPage />} />

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminHub />} />
          <Route path="edit-products" element={<EditProductsPage />} />
          <Route path="create-product" element={<CreateProductPage />} />
          <Route path="bulk-import-export" element={<BulkImportExportPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="subcategories" element={<SubcategoriesPage />} />
          <Route path="order-list" element={<OrderListPage />} />
          <Route path="order-details" element={<OrderDetailsPage />} />
          <Route path="shipping-queue" element={<ShippingQueuePage />} />
          <Route path="tracking-awbs" element={<TrackingPage />} />
          <Route path="return-requests" element={<ReturnRequestsPage />} />
          <Route path="refund-center" element={<RefundCenterPage />} />
          <Route path="stock-overview" element={<StockOverviewPage />} />
          <Route path="moods" element={<MoodsPage />} />
          <Route path="quiz-management" element={<QuizManagementPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="about-contact" element={<AboutContactPage />} />
          <Route path="social-links" element={<SocialLinksPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="admin-accounts" element={<AdminAccountsPage />} />
          <Route path="roles-permissions" element={<RolesPermissionsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
