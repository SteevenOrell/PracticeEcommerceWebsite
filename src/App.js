import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Details from "./components/Details";
import Login from './components/Login';
import ErrorPage from "./components/ErrorPage";
import ManageUsers from './components/ManageUsers';
import EditYourProfile from './components/EditYourProfile';
import EditUsers from './components/EditUsers';
import { UserContextComponent } from './components/UserContextComponent';
import { SearchDataComponent } from './components/SearchDataComponent';
import { CartContextComponent } from './components/CartContextComponent';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import MainPage from './components/MainPage';
import AppLayout from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
    return (
        <UserContextComponent>
            <CartContextComponent>
                <SearchDataComponent>
                    <div className="App">
                        <Routes>
                            <Route element={<AppLayout />}>
                                <Route index element={<MainPage />} />
                                <Route path='products' element={<Dashboard />} />
                                <Route path='details/:id' element={<Details />} />
                                <Route path='cart' element={<CartPage />} />
                                <Route path='checkout' element={<CheckoutPage />} />
                                <Route element={<ProtectedRoute />}>
                                    <Route path='edit-your-profile' element={<EditYourProfile />} />
                                </Route>
                                <Route element={<ProtectedRoute requireAdmin />}>
                                    <Route path='manage-users' element={<ManageUsers />} />
                                    <Route path='edit-users/:id' element={<EditUsers />} />
                                </Route>
                            </Route>
                            <Route path='login' element={<Login />} />
                            <Route path='*' element={<ErrorPage />} />
                        </Routes>
                    </div>
                </SearchDataComponent>
            </CartContextComponent>
        </UserContextComponent>
    );
}

export default App;
