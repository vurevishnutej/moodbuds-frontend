import { BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastProvider } from './providers/ToastProvider';
import { AuthProvider } from './providers/AuthProvider';
import { CartProvider } from './providers/CartProvider';
import { WishlistProvider } from './providers/WishlistProvider';
import { QuizProvider } from './providers/QuizProvider';
import { AppRoutes } from './routes';
import { QuizModal } from '../features/quiz/components/QuizModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <QuizProvider>
                <ScrollToTop />
                <AppRoutes />
                <QuizModal />
              </QuizProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
