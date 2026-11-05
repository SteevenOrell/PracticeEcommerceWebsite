import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon";
import { AcmeLogo } from "./AcmeLogo";
import { UserContext } from "./UserContextComponent";
import { SearchContext } from "./SearchDataComponent";
import { CartContext } from "./CartContextComponent";
import { useProducts } from "../hooks/useProducts";
import { getImageFor } from "../utils/getProductImage";
import { formatPrice } from "../utils/format";

const LINKS = [
    { label: "New & Featured", to: "/products" },
    { label: "Lifestyle", to: "/products?purpose=Lifestyle" },
    { label: "Football", to: "/products?purpose=Football" },
    { label: "Apparel", to: "/products?purpose=Apparel" },
];

function safeImageUrl(url) {
    try { const u = new URL(url); return u.protocol === "https:" ? u.href : undefined; } catch { return undefined; }
}

function SearchOverlay({ onClose }) {
    const { setSearch } = useContext(SearchContext);
    const { products } = useProducts();
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        document.body.style.overflow = "hidden";
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
    }, [onClose]);

    const q = query.trim().toLowerCase();
    const results = q ? products.filter(p => p["article-name"]?.toLowerCase().includes(q)).slice(0, 4) : [];

    function submit(e) {
        e.preventDefault();
        setSearch(query.trim());
        onClose();
        navigate("/products");
    }

    return (
        <>
            <div id="SearchBackdrop" onClick={onClose} aria-hidden="true" />
            <div id="SearchOverlay" role="dialog" aria-modal="true" aria-label="Search products">
                <form id="SearchOverlayHeader" role="search" onSubmit={submit}>
                    <Link to="/" onClick={onClose} className="hidden sm:block" aria-label="Home"><AcmeLogo /></Link>
                    <label htmlFor="site-search" className="sr-only">Search products</label>
                    <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-white/10 px-4">
                        <SearchIcon size={20} />
                        <input
                            id="site-search" ref={inputRef} type="search" value={query} onChange={e => setQuery(e.target.value)}
                            placeholder="Search shoes and apparel" autoComplete="off" maxLength={80}
                            className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-white/50"
                        />
                    </div>
                    <button type="button" className="text-sm font-semibold" onClick={onClose}>Cancel</button>
                </form>

                <div id="SearchResults" aria-live="polite">
                    {q && results.length === 0 && <p className="muted">No products match “{query}”.</p>}
                    {!q && (
                        <div>
                            <p className="eyebrow">Popular searches</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {["Jordan", "Hoodie", "Mercurial", "Puffer", "Dunk"].map(t => (
                                    <button key={t} type="button" className="chip" onClick={() => setQuery(t)}>{t}</button>
                                ))}
                            </div>
                        </div>
                    )}
                    {results.length > 0 && (
                        <ul id="SearchResultsGrid">
                            {results.map(p => (
                                <li key={p.id}>
                                    <Link to={`/details/${encodeURIComponent(p.id)}`} onClick={onClose} className="product-card">
                                        <div className="product-card-media"><img className="primary" src={getImageFor(p, 1, 400)} alt="" /></div>
                                        <div className="product-card-body">
                                            <p className="product-card-name">{p["article-name"]}</p>
                                            <p className="product-card-price">{formatPrice(p.price)}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

function Navigation() {
    const { user, logout } = useContext(UserContext);
    const { cartCount, openSidebar } = useContext(CartContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => { setMenuOpen(false); }, [location.pathname, location.search]);
    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
        const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
        document.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        document.body.style.overflow = "hidden"; // keep the page behind the menu from scrolling
        return () => {
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const closeSearch = useRef(() => setSearchOpen(false)).current;
    const isActive = (to) => (location.pathname + location.search) === to;

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <>
            {searchOpen && <SearchOverlay onClose={closeSearch} />}

            <header className="main-nav sticky top-0 z-50">
                <nav className="container-x grid h-full grid-cols-[1fr_auto_1fr] items-center" aria-label="Main">
                    <div className="flex items-center gap-1">
                        <button type="button" className="icon-btn md:hidden" aria-expanded={menuOpen} aria-controls="mobile-menu"
                            aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(o => !o)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" aria-hidden="true">
                                {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                            </svg>
                        </button>
                        <ul className="hidden items-center gap-5 md:flex">
                            {LINKS.map(l => (
                                <li key={l.label}><Link to={l.to} className="nav-link" aria-current={isActive(l.to) ? "page" : undefined}>{l.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <Link to="/" aria-label="Clodio Vendem home" className="flex items-center justify-self-center py-2"><AcmeLogo height={32} /></Link>

                    <div className="flex items-center justify-end gap-1">
                        <button type="button" className="icon-btn sm:!w-auto sm:gap-2 sm:rounded-full sm:bg-white/10 sm:px-4" onClick={() => setSearchOpen(true)} aria-label="Search products">
                            <SearchIcon size={18} /><span className="hidden text-sm text-white/70 sm:inline">Search</span>
                        </button>

                        {user ? (
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Avatar as="button" size="sm" className="ml-1 transition-transform" name={user.name} src={safeImageUrl(user.avatar)} aria-label="Account menu" />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Account actions" variant="flat">
                                    <DropdownItem key="profile" className="h-14 gap-2" textValue="Signed in" isReadOnly>
                                        <p className="text-xs opacity-70">Signed in as</p>
                                        <p className="font-semibold">{user.email}</p>
                                    </DropdownItem>
                                    <DropdownItem key="settings" onPress={() => navigate("/edit-your-profile")}>My account</DropdownItem>
                                    {user["user-role"] === "admin" && (
                                        <DropdownItem key="admin" onPress={() => navigate("/manage-users")}>Manage users</DropdownItem>
                                    )}
                                    <DropdownItem key="logout" color="danger" onPress={handleLogout}>Log out</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <Link to="/login" className="nav-link hidden px-3 sm:inline-block">Sign in</Link>
                        )}

                        <button id="CartIconWrapper" type="button" className="icon-btn" onClick={openSidebar}
                            aria-label={`Open bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" width={22} height={22} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                            </svg>
                            {cartCount > 0 && <span id="CartBadge" aria-hidden="true">{cartCount}</span>}
                        </button>
                    </div>
                </nav>

            </header>

            {/* Rendered outside <header>: the header's backdrop-filter makes it the containing
                block for fixed children, which clipped the menu to the 64px bar on phones. */}
            {menuOpen && (
                <div id="mobile-menu" className="mobile-menu md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
                    <ul className="mobile-menu-links">
                        {LINKS.map(l => (
                            <li key={l.label}>
                                <Link to={l.to} onClick={() => setMenuOpen(false)} aria-current={isActive(l.to) ? "page" : undefined}>
                                    <span>{l.label}</span><span aria-hidden="true">→</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 grid gap-3">
                        {user ? (
                            <>
                                <p className="muted truncate text-sm">Signed in as {user.email}</p>
                                <Link to="/edit-your-profile" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>My account</Link>
                                {user["user-role"] === "admin" && <Link to="/manage-users" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Manage users</Link>}
                                <button type="button" className="btn btn-ghost" onClick={() => { setMenuOpen(false); handleLogout(); }}>Log out</button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Sign in</Link>
                        )}
                        <button type="button" className="btn btn-ghost" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>Search</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navigation;
