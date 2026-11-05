import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pagination } from "@nextui-org/react";
import { SearchContext } from "./SearchDataComponent";
import { useProducts } from "../hooks/useProducts";
import { ProductCard, ProductCardSkeleton } from "./ui/ProductCard";
import { Reveal } from "./ui/Reveal";

const PAGE_SIZE = 12;
const SORTS = [
    { value: "default", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
];

function Dashboard() {
    const { searchData, setSearch } = useContext(SearchContext);
    const { products, status, retry } = useProducts();
    const [params, setParams] = useSearchParams();
    const purpose = params.get("purpose") || "all";
    const [sortBy, setSortBy] = useState("default");
    const [filterColor, setFilterColor] = useState("all");
    const [filterSize, setFilterSize] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        }
        function handleKey(e) { if (e.key === "Escape") setDropdownOpen(false); }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    useEffect(() => { setCurrentPage(1); }, [searchData, purpose, filterColor, filterSize, sortBy]);

    const purposes = useMemo(() => [...new Set(products.map(p => p.purpose).filter(Boolean))], [products]);
    const colors = useMemo(() => [...new Set(products.map(p => p.color).filter(Boolean))], [products]);
    const sizes = useMemo(() => [...new Set(products.map(p => p.size).filter(Boolean))].sort((a, b) => a - b), [products]);

    const filtered = useMemo(() => {
        const q = searchData.trim().toLowerCase();
        let list = products.filter(item => !q || item["article-name"]?.toLowerCase().includes(q));
        if (purpose !== "all") list = list.filter(p => p.purpose === purpose);
        if (filterColor !== "all") list = list.filter(p => p.color === filterColor);
        if (filterSize !== "all") list = list.filter(p => String(p.size) === filterSize);
        if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price);
        if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
        return list;
    }, [products, searchData, purpose, filterColor, filterSize, sortBy]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const displayed = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const activeFilters = (filterColor !== "all") + (filterSize !== "all");
    const title = purpose === "all" ? "All shoes" : purpose;

    function setPurpose(value) {
        const next = new URLSearchParams(params);
        if (value === "all") next.delete("purpose"); else next.set("purpose", value);
        setParams(next, { replace: true });
    }

    function resetAll() {
        setFilterColor("all"); setFilterSize("all"); setSortBy("default"); setPurpose("all"); setSearch("");
    }

    function handlePageChange(page) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <main id="main">
            <header className="container-x pb-8 pt-14 md:pt-20">
                <p className="eyebrow">Shop</p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                    <h1 className="display-lg">{title}{searchData && <span className="muted"> — “{searchData}”</span>}</h1>
                    <p className="muted pb-2 text-sm" aria-live="polite">
                        {status === "ready" ? `${filtered.length} ${filtered.length === 1 ? "result" : "results"}` : ""}
                    </p>
                </div>
            </header>

            <div className="toolbar">
                <div className="container-x flex flex-wrap items-center gap-2 py-3">
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
                        {["all", ...purposes].map(p => (
                            <button key={p} type="button" className="chip" aria-pressed={purpose === p} onClick={() => setPurpose(p)}>
                                {p === "all" ? "All" : p}
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <div id="FilterDropdownWrapper" ref={dropdownRef} className="relative">
                            <button
                                type="button"
                                className={`chip${activeFilters ? " is-active" : ""}`}
                                aria-expanded={dropdownOpen}
                                aria-controls="FilterDropdownMenu"
                                onClick={() => setDropdownOpen(o => !o)}
                            >
                                Filter{activeFilters ? ` (${activeFilters})` : ""}
                                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M3 5h14v2H3zM6 9h8v2H6zM8 13h4v2H8z" /></svg>
                            </button>
                            {dropdownOpen && (
                                <div id="FilterDropdownMenu">
                                    {colors.length > 0 && (
                                        <fieldset className="FilterDropdownGroup">
                                            <legend className="FilterDropdownLabel eyebrow">Color</legend>
                                            <div className="FilterDropdownOptions">
                                                {colors.map(color => (
                                                    <button key={color} type="button" className="chip !min-h-[34px] !text-xs" aria-pressed={filterColor === color}
                                                        onClick={() => setFilterColor(c => c === color ? "all" : color)}>{color}</button>
                                                ))}
                                            </div>
                                        </fieldset>
                                    )}
                                    {sizes.length > 0 && (
                                        <fieldset className="FilterDropdownGroup">
                                            <legend className="FilterDropdownLabel eyebrow">Size (US)</legend>
                                            <div className="FilterDropdownOptions">
                                                {sizes.map(size => (
                                                    <button key={size} type="button" className="chip !min-h-[34px] !text-xs" aria-pressed={filterSize === String(size)}
                                                        onClick={() => setFilterSize(s => s === String(size) ? "all" : String(size))}>{size}</button>
                                                ))}
                                            </div>
                                        </fieldset>
                                    )}
                                </div>
                            )}
                        </div>

                        <label className="sr-only" htmlFor="sort-select">Sort by</label>
                        <select id="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="chip cursor-pointer appearance-none bg-transparent pr-4">
                            {SORTS.map(s => <option key={s.value} value={s.value} className="bg-black">{`Sort: ${s.label}`}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <section className="container-x py-10" aria-label="Products">
                {status === "error" && (
                    <div className="py-24 text-center">
                        <h2 className="display-md">Couldn't load products</h2>
                        <p className="muted mt-4">The product service didn't respond. Check your connection and try again.</p>
                        <button type="button" className="btn btn-primary mt-8" onClick={retry}>Try again</button>
                    </div>
                )}

                {status === "loading" && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                )}

                {status === "ready" && filtered.length === 0 && (
                    <div className="py-24 text-center">
                        <h2 className="display-md">Nothing found</h2>
                        <p className="muted mt-4">We couldn't find products matching your search or filters.</p>
                        <div className="mt-8 flex justify-center gap-3">
                            <button type="button" className="btn btn-primary" onClick={resetAll}>Clear all filters</button>
                            <Link to="/" className="btn btn-ghost">Back home</Link>
                        </div>
                    </div>
                )}

                {status === "ready" && filtered.length > 0 && (
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
                        {displayed.map((item, i) => (
                            <Reveal as="li" key={item.id} delay={(i % 4) * 0.06} y={20}>
                                <ProductCard product={item} priority={i < 4} />
                            </Reveal>
                        ))}
                    </ul>
                )}

                {totalPages > 1 && (
                    <nav id="paginationWrapper" aria-label="Pagination">
                        <Pagination onChange={handlePageChange} showControls total={totalPages} page={currentPage} variant="light"
                            classNames={{ cursor: "bg-white text-black font-semibold" }} />
                    </nav>
                )}
            </section>
        </main>
    );
}

export default Dashboard;
