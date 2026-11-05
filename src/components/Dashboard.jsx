import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Pagination } from "@nextui-org/react";
import { SearchContext } from "./SearchDataComponent";
import { getProducts } from "../api/products";
import { getProductImage } from "../utils/getProductImage";

const PAGE_SIZE = 9;

function Dashboard() {
    const { searchData, setSearch } = useContext(SearchContext);
    const [products, setProducts] = useState([]);
    const [isSearchDataFound, setSearchDataFound] = useState(true);
    const [sortBy, setSortBy] = useState('default');
    const [filterColor, setFilterColor] = useState('all');
    const [filterSize, setFilterSize] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        getProducts().then(res => {
            if (res.data.length > 0) setProducts(res.data);
        });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        if (searchData.length === 0) {
            setSearchDataFound(true);
        } else {
            const found = products.some(item =>
                item["article-name"].toLowerCase().includes(searchData.toLowerCase())
            );
            setSearchDataFound(found);
        }
    }, [searchData, products]);

    const filteredSortedProducts = useMemo(() => {
        let list = products.filter(item => {
            if (searchData.length > 0)
                return item["article-name"].toLowerCase().includes(searchData.toLowerCase());
            return true;
        });
        if (filterColor !== 'all') list = list.filter(p => p.color === filterColor);
        if (filterSize !== 'all') list = list.filter(p => String(p.size) === filterSize);
        if (sortBy === 'price-high') list = [...list].sort((a, b) => b.price - a.price);
        if (sortBy === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
        return list;
    }, [products, searchData, filterColor, filterSize, sortBy]);

    const displayedProducts = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredSortedProducts.slice(start, start + PAGE_SIZE);
    }, [filteredSortedProducts, currentPage]);

    const colors = useMemo(() =>
        [...new Set(products.map(p => p.color).filter(Boolean))],
        [products]
    );
    const sizes = useMemo(() =>
        [...new Set(products.map(p => p.size).filter(Boolean))].sort(),
        [products]
    );

    function handlePageChange(pageNumber) {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleSearchReset() {
        setSearch("");
        setSearchDataFound(true);
    }

    function handleFilterChange(type, value) {
        setCurrentPage(1);
        if (type === 'color') setFilterColor(prev => prev === value ? 'all' : value);
        else if (type === 'size') setFilterSize(prev => prev === value ? 'all' : value);
        else if (type === 'sort') setSortBy(prev => prev === value ? 'default' : value);
        else if (type === 'all') { setFilterColor('all'); setFilterSize('all'); setSortBy('default'); }
    }

    const isAllActive = filterColor === 'all' && filterSize === 'all' && sortBy === 'default';
    const totalPages = Math.ceil(filteredSortedProducts.length / PAGE_SIZE);

    return (
        <>
            <div id="TitleProducts">
                <h1>All Products</h1>
            </div>

            <div id="ProductFilters">
                <button
                    className={`FilterBtn${isAllActive ? ' FilterBtnActive' : ''}`}
                    onClick={() => handleFilterChange('all')}
                >All</button>

                <div id="FilterDropdownWrapper" ref={dropdownRef}>
                    <button
                        className={`FilterBtn${filterColor !== 'all' || filterSize !== 'all' ? ' FilterBtnActive' : ''}`}
                        onClick={() => setDropdownOpen(o => !o)}
                    >
                        Filter {filterColor !== 'all' || filterSize !== 'all' ? '•' : '▾'}
                    </button>

                    {dropdownOpen && (
                        <div id="FilterDropdownMenu">
                            {colors.length > 0 && (
                                <div className="FilterDropdownGroup">
                                    <span className="FilterDropdownLabel">Color</span>
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            className={`FilterDropdownItem${filterColor === color ? ' FilterDropdownItemActive' : ''}`}
                                            onClick={() => handleFilterChange('color', color)}
                                        >{color}</button>
                                    ))}
                                </div>
                            )}
                            {sizes.length > 0 && (
                                <div className="FilterDropdownGroup">
                                    <span className="FilterDropdownLabel">Size</span>
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`FilterDropdownItem${filterSize === String(size) ? ' FilterDropdownItemActive' : ''}`}
                                            onClick={() => handleFilterChange('size', String(size))}
                                        >{size}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    className={`FilterBtn${sortBy === 'price-high' ? ' FilterBtnActive' : ''}`}
                    onClick={() => handleFilterChange('sort', 'price-high')}
                >Price: High to Low</button>

                <button
                    className={`FilterBtn${sortBy === 'price-low' ? ' FilterBtnActive' : ''}`}
                    onClick={() => handleFilterChange('sort', 'price-low')}
                >Price: Low to High</button>
            </div>

            {!isSearchDataFound && (
                <main className="grid min-h-full place-items-center bg-black px-6 py-24 sm:py-32 lg:px-8">
                    <div className="text-center">
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white-900 sm:text-5xl">Keywords not found</h1>
                        <p className="mt-6 text-base leading-7 text-gray-400">Sorry, we couldn't find the product you're looking for.</p>
                        <div className="mt-10 flex items-center justify-center gap-x-6" onClick={handleSearchReset}>
                            <Link to="/"
                                className="rounded-md bg-gray-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                            >Search another keyword</Link>
                            <button className="text-sm font-semibold text-white-900" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                Contact support <span aria-hidden="true">&rarr;</span>
                            </button>
                        </div>
                    </div>
                </main>
            )}

            <div id="productDiv" className="gap-5 grid grid-cols-2 sm:grid-cols-3">
                {isSearchDataFound && displayedProducts.map((item) => (
                    <Card
                        className="py-4"
                        key={item.id}
                        shadow="none"
                        style={{ background: 'transparent', border: 'none' }}
                        isPressable
                        onPress={() => {}}
                    >
                        <Link to={`/details/${item.id}`}>
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <div className="ProductCardImg">
                                    <img
                                        alt={item["article-name"]}
                                        src={getProductImage(item["image-folder-name"])}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <h4 className="font-bold text-large">{item["article-name"]}</h4>
                                <p className="text-tiny uppercase font-bold">{"$" + item["price"]}</p>
                                <small className="text-default-500">Color {item["color"]}</small>
                            </CardBody>
                        </Link>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div id="paginationWrapper">
                    <Pagination
                        id="pagination"
                        onChange={handlePageChange}
                        showControls
                        total={totalPages}
                        page={currentPage}
                        initialPage={1}
                    />
                </div>
            )}
        </>
    );
}

export default Dashboard;
