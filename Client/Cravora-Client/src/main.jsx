/**
 * Application Bootstrapping Entry Point
 * Renders the primary React root node and wraps the App component inside global routers and providers.
 */
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './index.css' // Import master styles containing CSS variables and tokens
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'

// Find document mount target and render virtual DOM tree
createRoot(document.getElementById('root')).render(
  // BrowserRouter enables standard SPA route navigation using window.history API
  <BrowserRouter>
    {/* AuthProvider supplies session info (Login/Register/Logout) globally */}
    <AuthProvider>
      {/* CartProvider keeps track of items in user's active shopping cart */}
      <CartProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)


