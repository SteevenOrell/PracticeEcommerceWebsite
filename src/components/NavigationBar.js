import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Navbar, NavbarBrand, NavbarContent, Input, NavbarItem,
    Link as NextUILink, Dropdown, DropdownTrigger, DropdownMenu,
    DropdownItem, Avatar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem
} from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon.js";
import { AcmeLogo } from "./AcmeLogo.js";
import { UserContext } from "./UserContextComponent.js";
import { SearchContext } from "./SearchDataComponent.js";
import { CartContext } from "./CartContextComponent.js";
import { getProducts } from "../api/products.js";
import { getProductImage } from "../utils/getProductImage.js";

function Navigation() {
    const { user, logout } = useContext(UserContext);
    const { setSearch } = useContext(SearchContext);
    const { cartCount, openSidebar } = useContext(CartContext);
    const [links] = useState(["Men", "Women", "Kids", "Accessories"]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [productsFound, setProductsFound] = useState([]);
    const [isSearchDataFound, setSearchDataFound] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [width, setWidth] = useState(window.innerWidth);

    const navigate = useNavigate();

    useEffect(() => {
        getProducts().then(res => {
            if (res.data.length > 0) setProducts(res.data);
        });
    }, []);

    useEffect(() => {
        function handleResize() { setWidth(window.innerWidth); }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isSearchOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isSearchOpen]);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    function handleOverlaySearch(e) {
        const val = e.target.value;
        setSearchQuery(val);
        setSearch(val);

        if (val.trim() === "") {
            setProductsFound([]);
            setSearchDataFound(true);
            return;
        }

        const results = products.filter(item =>
            item["article-name"].toLowerCase().includes(val.toLowerCase())
        );

        if (results.length > 0) {
            setProductsFound(results.slice(0, 4));
            setSearchDataFound(true);
        } else {
            setProductsFound([]);
            setSearchDataFound(false);
        }
    }

    function handleCancel() {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearch("");
        setProductsFound([]);
        setSearchDataFound(true);
    }

    return (
        <>
            {isSearchOpen && <div id="SearchBackdrop" onClick={handleCancel} />}

            {isSearchOpen && (
                <div id="SearchOverlay">
                    <div id="SearchOverlayHeader">
                        <Link to="/" onClick={handleCancel} id="SearchOverlayLogo">
                            <AcmeLogo />
                        </Link>
                        <Input
                            autoFocus
                            value={searchQuery}
                            onChange={handleOverlaySearch}
                            classNames={{
                                base: "flex-1 h-12",
                                mainWrapper: "h-full",
                                input: "text-base",
                                inputWrapper: "h-full font-normal text-white bg-white/10 border border-white/20",
                            }}
                            placeholder="Search products..."
                            size="md"
                            startContent={<SearchIcon size={20} />}
                            type="search"
                        />
                        <button id="SearchCancelBtn" onClick={handleCancel}>Cancel</button>
                    </div>

                    <div id="SearchResults">
                        {searchQuery.trim() !== "" && !isSearchDataFound && (
                            <p id="SearchNotFound">Product not found</p>
                        )}
                        {productsFound.length > 0 && (
                            <div id="SearchResultsGrid">
                                {productsFound.map(product => (
                                    <Link
                                        to={`/details/${product.id}`}
                                        key={product.id}
                                        onClick={handleCancel}
                                        className="SearchProductCard"
                                    >
                                        <div className="SearchProductImgWrapper">
                                            <img
                                                src={getProductImage(product["image-folder-name"])}
                                                alt={product["article-name"]}
                                            />
                                        </div>
                                        <p className="SearchProductName">{product["article-name"]}</p>
                                        <p className="SearchProductPrice">${product.price}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className="main-nav" classNames={{ wrapper: "px-8 max-w-full h-full" }}>
                <NavbarContent className="sm:hidden" justify="start">
                    <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                </NavbarContent>
                <NavbarContent className="hidden sm:flex gap-3" justify="start">
                    {links.map((link) => (
                        <NavbarItem key={`key${link}`}>
                            <NextUILink color="foreground" href="/products">{link}</NextUILink>
                        </NavbarItem>
                    ))}
                </NavbarContent>
                {width < 639
                    ? <NavbarContent className="sm:hidden pr-3" justify="center">
                        <NavbarBrand>
                            <Link to="/"><AcmeLogo /></Link>
                        </NavbarBrand>
                    </NavbarContent>
                    : <NavbarContent justify="center">
                        <NavbarBrand>
                            <Link to="/"><AcmeLogo /></Link>
                        </NavbarBrand>
                    </NavbarContent>
                }

                <NavbarContent as="div" className="items-center" justify="end">
                    {user === null && width > 639 && (
                        <Link to="/login" className="text-sm font-medium text-default-600 hover:text-default-900 whitespace-nowrap">Sign in</Link>
                    )}

                    {width < 639 && user === null
                        ? <button id="NavSearchIconBtn" onClick={() => setIsSearchOpen(true)}>
                            <SearchIcon size={22} />
                          </button>
                        : width >= 639
                            ? <Input
                                onClick={() => setIsSearchOpen(true)}
                                onFocus={() => setIsSearchOpen(true)}
                                readOnly
                                classNames={{
                                    base: "max-w-full sm:max-w-[10rem] h-10 cursor-pointer",
                                    mainWrapper: "h-full",
                                    input: "text-small cursor-pointer",
                                    inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 cursor-pointer",
                                }}
                                placeholder="Search..."
                                size="sm"
                                startContent={<SearchIcon size={18} />}
                                type="search"
                              />
                            : null
                    }

                    <button id="CartIconWrapper" onClick={openSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        {cartCount > 0 && <span id="CartBadge">{cartCount}</span>}
                    </button>

                    {user !== null && (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="default"
                                    name={user["name"]}
                                    size="sm"
                                    src={user["avatar"]}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">Signed in as</p>
                                    <p className="font-semibold">{user["email"]}</p>
                                </DropdownItem>
                                <DropdownItem key="settings" onPress={() => navigate("/edit-your-profile")}>
                                    My Account
                                </DropdownItem>
                                {user["user-role"] === "admin" && (
                                    <DropdownItem key="system" onPress={() => navigate("/manage-users")}>
                                        Manage Users (Admin only)
                                    </DropdownItem>
                                )}
                                <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )}

                    <NavbarMenu className="z-30 px-6 pt-6 fixed flex max-w-full top-[var(--navbar-height)] inset-x-0 bottom-0 w-screen flex-col gap-2 overflow-y-auto backdrop-blur-xl backdrop-saturate-150 bg-background/70">
                        {user === null
                            ? <NavbarMenuItem key="mobile-SignIn">
                                <Link to="/login">
                                    <NextUILink className="w-full" color="foreground" href="/login" size="lg">
                                        Sign In
                                    </NextUILink>
                                </Link>
                              </NavbarMenuItem>
                            : <NavbarMenuItem key="mobile-Search">
                                <button
                                    id="MobileMenuSearchBtn"
                                    onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }}
                                >
                                    Search <SearchIcon size={20} />
                                </button>
                              </NavbarMenuItem>
                        }
                        {links.map((item, index) => (
                            <NavbarMenuItem key={`${item}-${index}`}>
                                <NextUILink className="w-full" color="foreground" href="/products" size="lg">
                                    {item}
                                </NextUILink>
                            </NavbarMenuItem>
                        ))}
                    </NavbarMenu>
                </NavbarContent>
            </Navbar>
        </>
    );
}

export default Navigation;
