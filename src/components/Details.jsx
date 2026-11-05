import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/20/solid";
import { CartContext } from "./CartContextComponent";
import { getProduct } from "../api/products";
import { getImagesFor } from "../utils/getProductImage";
import { formatPrice } from "../utils/format";
import { useProducts } from "../hooks/useProducts";
import { QuantitySelector } from "./ui/QuantitySelector";
import { ProductCard } from "./ui/ProductCard";
import { Reveal } from "./ui/Reveal";

const DEMO_RATING = 4;

function MobileCarousel({ images, name }) {
    const [slide, setSlide] = useState(0);
    const touchX = useRef(0);
    if (!images.length) return null;
    return (
        <div className="relative lg:hidden" aria-roledescription="carousel" aria-label={`${name} images`}>
            <div
                className="overflow-hidden bg-[var(--tile)]"
                style={{ aspectRatio: "4 / 5" }}
                onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
                onTouchEnd={e => {
                    const diff = touchX.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 40) setSlide(i => diff > 0 ? Math.min(i + 1, images.length - 1) : Math.max(i - 1, 0));
                }}
            >
                <div className="flex h-full transition-transform duration-500 ease-editorial motion-reduce:transition-none"
                    style={{ width: `${images.length * 100}%`, transform: `translateX(-${slide * (100 / images.length)}%)` }}>
                    {images.map((img, i) => (
                        <div key={i} className="h-full flex-shrink-0" style={{ width: `${100 / images.length}%` }} aria-hidden={i !== slide}>
                            <img src={img} alt={`${name} — view ${i + 1} of ${images.length}`} className="h-full w-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
            {slide > 0 && (
                <button type="button" onClick={() => setSlide(i => i - 1)} className="icon-btn icon-btn-light absolute left-3 top-1/2 -translate-y-1/2" aria-label="Previous image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
            )}
            {slide < images.length - 1 && (
                <button type="button" onClick={() => setSlide(i => i + 1)} className="icon-btn icon-btn-light absolute right-3 top-1/2 -translate-y-1/2" aria-label="Next image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            )}
            <div className="mt-3 flex items-center justify-center gap-1">
                {images.map((_, i) => (
                    <button key={i} type="button" onClick={() => setSlide(i)} aria-label={`Show image ${i + 1}`} aria-current={i === slide}
                        className="flex h-6 w-6 items-center justify-center">
                        <span className={`block h-1.5 rounded-full transition-all ${i === slide ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
                    </button>
                ))}
            </div>
        </div>
    );
}

function DetailsSkeleton() {
    return (
        <div className="container-x grid gap-10 py-10 lg:grid-cols-12" aria-busy="true" aria-label="Loading product">
            <div className="skeleton lg:col-span-7" style={{ aspectRatio: "16 / 13" }} />
            <div className="space-y-4 lg:col-span-4 lg:col-start-9">
                <div className="skeleton h-4 w-24" /><div className="skeleton h-14 w-4/5" /><div className="skeleton h-6 w-24" /><div className="skeleton mt-10 h-12 w-full" />
            </div>
        </div>
    );
}

function Details() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading");
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const { addToCart } = useContext(CartContext);
    const { products } = useProducts();

    useEffect(() => {
        setQty(1); setAdded(false);
        if (!/^\d{1,9}$/.test(id || "")) { setStatus("notfound"); return; }
        let alive = true;
        setStatus("loading");
        getProduct(id)
            .then(res => { if (!alive) return; if (res.data) { setProduct(res.data); setStatus("ready"); } else setStatus("notfound"); })
            .catch(() => { if (alive) setStatus("error"); });
        return () => { alive = false; };
    }, [id]);

    if (status === "loading") return <main id="main"><DetailsSkeleton /></main>;
    if (status !== "ready") {
        return (
            <main id="main" className="container-x py-32 text-center">
                <h1 className="display-lg">{status === "notfound" ? "Product not found" : "Something went wrong"}</h1>
                <p className="muted mt-4">{status === "notfound" ? "This product doesn't exist or is no longer available." : "We couldn't load this product. Please try again."}</p>
                <Link to="/products" className="btn btn-primary mt-8">Browse all products</Link>
            </main>
        );
    }

    const name = product["article-name"];
    const images = getImagesFor(product);
    const isApparel = product.purpose === "Apparel";
    const related = products.filter(p => p.id !== product.id && p.purpose === product.purpose).slice(0, 8);

    function handleAdd(e) {
        e.preventDefault();
        addToCart(product, qty);
        setAdded(true);
    }

    return (
        <main id="main">
            <nav aria-label="Breadcrumb" className="container-x pt-6 text-sm muted">
                <ol className="flex flex-wrap gap-2">
                    <li><Link to="/" className="hover:text-white">Home</Link> /</li>
                    <li><Link to="/products" className="hover:text-white">Shop</Link> /</li>
                    {product.purpose && <li><Link to={`/products?purpose=${encodeURIComponent(product.purpose)}`} className="hover:text-white">{product.purpose}</Link> /</li>}
                    <li aria-current="page" className="text-white">{name}</li>
                </ol>
            </nav>

            <div className="mt-6 lg:container-x lg:grid lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                    <MobileCarousel images={images} name={name} />
                    <div className="pdp-gallery hidden lg:grid">
                        {images.map((img, i) => (
                            <div className="pdp-img" key={i}>
                                <img src={img} alt={`${name} — view ${i + 1}`} loading={i < 2 ? "eager" : "lazy"} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container-x mt-8 lg:col-span-5 lg:mt-0 lg:px-0">
                    <div className="pdp-panel">
                        <p className="eyebrow">{[product.purpose, product.gender && `${product.gender}'s`].filter(Boolean).join(" · ")}</p>
                        <h1 className="display-lg mt-3">{name}</h1>
                        <p className="mt-4 text-2xl font-semibold">{formatPrice(product.price)}</p>

                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex" aria-hidden="true">
                                {[0, 1, 2, 3, 4].map(r => <StarIcon key={r} className={`h-4 w-4 ${DEMO_RATING > r ? "text-white" : "text-white/25"}`} />)}
                            </div>
                            <span className="text-sm muted">{DEMO_RATING}.0 out of 5 · demo rating</span>
                        </div>

                        <form className="mt-10 space-y-8" onSubmit={handleAdd}>
                            <div>
                                <p className="text-sm font-semibold">Color</p>
                                <p className="mt-1 muted">{product.color}</p>
                            </div>

                            <fieldset>
                                <legend className="text-sm font-semibold">{isApparel ? "Size" : "Size (US)"}</legend>
                                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
                                    <button type="button" role="radio" aria-checked="true" className="size-pill">{product.size}</button>
                                </div>
                                <p className="mt-2 text-xs muted">Only one size is in stock for this {isApparel ? "item" : "pair"}.</p>
                            </fieldset>

                            <div className="flex flex-wrap items-center gap-4">
                                <QuantitySelector value={qty} onChange={setQty} />
                                <button type="submit" className="btn btn-primary flex-1 !min-h-[56px] text-base">Add to bag</button>
                            </div>
                            <p className="text-sm muted" role="status" aria-live="polite">{added ? `${name} added to your bag.` : ""}</p>
                        </form>

                        {Array.isArray(product["image-credits"]) && product["image-credits"].length > 0 && (
                            <p className="mt-4 text-xs muted">
                                Photos:{" "}
                                {product["image-credits"].map((c, i) => (
                                    <span key={c}>{i > 0 && ", "}<a className="link-underline" href={`https://unsplash.com/@${encodeURIComponent(c)}?utm_source=clodio_vendem_demo&utm_medium=referral`} target="_blank" rel="noopener noreferrer">@{c}</a></span>
                                ))}{" "}
                                on <a className="link-underline" href="https://unsplash.com/?utm_source=clodio_vendem_demo&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash</a>
                            </p>
                        )}

                        <div className="mt-6">
                            <details className="accordion" open>
                                <summary>Description <span className="chev" aria-hidden="true">⌄</span></summary>
                                <div className="accordion-body">{product.description}</div>
                            </details>
                            <details className="accordion">
                                <summary>Free delivery &amp; returns <span className="chev" aria-hidden="true">⌄</span></summary>
                                <div className="accordion-body">Demo store: orders aren't fulfilled. In a live store, this panel would show delivery estimates and a 30-day return policy.</div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section className="section container-x" aria-labelledby="related-title">
                    <Reveal><h2 id="related-title" className="display-md">You might also like</h2></Reveal>
                    <ul className="rail mt-10">
                        {related.map(p => <li key={p.id}><ProductCard product={p} /></li>)}
                    </ul>
                </section>
            )}
        </main>
    );
}

export default Details;
