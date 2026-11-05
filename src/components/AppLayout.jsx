import { Outlet } from "react-router-dom";
import Navigation from "./NavigationBar";
import CartSidebar from "./CartSidebar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

function AppLayout() {
    return (
        <>
            <ScrollToTop />
            <Navigation />
            <CartSidebar />
            <Outlet />
            <Footer />
        </>
    );
}

export default AppLayout;
