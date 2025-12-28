import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProductsScreen from './pages/ProductsScreen';
import ProductScreen from './pages/ProductScreen';

import OrdersScreen from './pages/OrdersScreen';
import OrderDetailsScreen from './pages/OrderDetailsScreen';
import ProfileScreen from './pages/ProfileScreen';
import LogoutScreen from './pages/LogoutScreen';
import CartScreen from './pages/CartScreen';
import ShippingScreen from './pages/ShippingScreen';
import TrackOrderScreen from './pages/TrackOrderScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import PaymentScreen from './pages/PaymentScreen';
import MySubscriptionsScreen from './pages/MySubscriptionsScreen';
import OrderSuccessScreen from './pages/OrderSuccessScreen';

import LandingPage from './pages/LandingPage';
import Toast from './components/Toast';
import SubscriptionScreen from './pages/SubscriptionScreen';
import ScrollToTop from './components/ScrollToTop';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import AdminProductListScreen from './pages/AdminProductListScreen';
import AdminEditProductScreen from './pages/AdminEditProductScreen';
import AdminDashboardScreen from './pages/AdminDashboardScreen';
import AdminOrderListScreen from './pages/AdminOrderListScreen';
import AdminUserListScreen from './pages/AdminUserListScreen';
import AdminPlaceholderScreen from './pages/AdminPlaceholderScreen';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

/**
 * Layout Component: Manages global UI elements
 * Handles conditional rendering of Header/Footer and dynamic page containers
 */
const Layout = () => {
  const location = useLocation();

  const hideHeaderRoutes = ['/login', '/register', '/logged-out'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  
  const isLandingPage = location.pathname === '/';
  const isShopPage = location.pathname === '/shop';

  return (
    <div className="flex flex-col min-h-screen">
      <Toast /> {/* Global notification system */}
      {showHeader && <Header />}

      {/* Main content area with dynamic padding/container logic */}
      <main className={`flex-grow ${showHeader && !isLandingPage && !isShopPage ? 'container mx-auto px-4 py-8' : ''}`}>
        <Routes>
          {/* Public & Core Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/logged-out" element={<LogoutScreen />} />

          {/* Checkout & Order Flow */}
          <Route path="/shipping" element={<ProtectedRoute><ShippingScreen /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentScreen /></ProtectedRoute>} />
          <Route path="/placeorder" element={<ProtectedRoute><PlaceOrderScreen /></ProtectedRoute>} />
          <Route path="/track-order/:id" element={<ProtectedRoute><TrackOrderScreen /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccessScreen /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersScreen /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetailsScreen /></ProtectedRoute>} />

          {/* Product & Subscription management */}
          <Route path="/products" element={<ProtectedRoute><ProductsScreen /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductScreen /></ProtectedRoute>} />
          <Route path="/subscribe/:id" element={<ProtectedRoute><SubscriptionScreen /></ProtectedRoute>} />
          <Route path="/subscriptions" element={<ProtectedRoute><MySubscriptionsScreen /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />

          {/* Nested Admin Management Suite */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboardScreen />} />
                  <Route path="productlist" element={<AdminProductListScreen />} />
                  <Route path="product/:id/edit" element={<AdminEditProductScreen />} />
                  <Route path="product/create" element={<AdminEditProductScreen />} />
                  <Route path="orders" element={<AdminOrderListScreen />} />
                  <Route path="users" element={<AdminUserListScreen />} />
                  <Route path="analytics" element={<AdminPlaceholderScreen title="Advanced Analytics" />} />
                  <Route path="offers" element={<AdminPlaceholderScreen title="Offers & Discounts" />} />
                  <Route path="settings" element={<AdminPlaceholderScreen title="Store Settings" />} />
                </Routes>
              </AdminLayout>
            </AdminRoute>
          } />
        </Routes>
      </main>
      {showHeader && <Footer />}
    </div>
  );
};


function App() {
  return (
    <AuthProvider> {/* Global User Authentication State */}
      <CartProvider> {/* Shopping Cart & Recurring Order Logic */}
        <Router>
          <ScrollToTop /> {/* Automatic scroll reset on navigation */}
          <Layout />
        </Router>
      </CartProvider>
    </AuthProvider >
  );
}

export default App;
