import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Details from "./components/Details";
import Login from './components/Login';
import ErrorPage from "./components/ErrorPage";
import ManageUsers from './components/ManageUsers';
import EditYourProfile from './components/EditYourProfile';
import EditUsers from './components/EditUsers';
import { UserContextComponent } from './components/UserContextComponent';
import Navigation from './components/NavigationBar';
import { SearchDataComponent } from './components/SearchDataComponent';
import { CartContextComponent } from './components/CartContextComponent';
import CartSidebar from './components/CartSidebar';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import MainPage from './components/MainPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();

  const showNav = ["/", "/edit-your-profile", "/manage-users", "/products"].includes(location.pathname)
    || location.pathname.includes("/edit-users/")
    || location.pathname.includes("/details/")
    || location.pathname === "/cart"
    || location.pathname === "/checkout";

  return (
    <UserContextComponent>
      <CartContextComponent>
        <SearchDataComponent>
          <div className="App">
            <ScrollToTop />
            {showNav && <Navigation />}
            <CartSidebar />
            <Routes>
              <Route path=''        element={<MainPage />} />
              <Route path='products' element={<Dashboard />} />
              <Route path='details/:id' element={<Details />} />
              <Route path='cart'    element={<CartPage />} />
              <Route path='checkout' element={<CheckoutPage />} />
              <Route path='login'   element={<Login />} />
              <Route path='edit-your-profile' element={<EditYourProfile />} />
              <Route path='manage-users' element={<ManageUsers />} />
              <Route path='edit-users/:id' element={<EditUsers />} />
              <Route path='*'       element={<ErrorPage />} />
            </Routes>
            <Footer />
          </div>
        </SearchDataComponent>
      </CartContextComponent>
    </UserContextComponent>
  );
}

export default App;
