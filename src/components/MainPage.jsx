import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { getProductImage } from "../utils/getProductImage";
import { ProductCard, ProductCardSkeleton } from "./ui/ProductCard";
import { Reveal, SplitHeadline } from "./ui/Reveal";
import mainVid1 from "../assets/athlete-black-man-and-tying-shoes-in-city-for-get-2025-12-18-01-49-15-utc2_compressed.mp4";
import mainVid1Mobile from "../assets/athlete-black-man-and-tying-shoes-on-road-for-get-2025-12-18-02-04-06-utc_compressed.mov";
import heroImg2 from "../assets/hero-2-desktop.png";
import heroImg2Mobile from "../assets/8bb2c7a3500bad49a6c6ba61bf8f4efa.jpg";
import img1 from "../assets/cd68aa257b0310cc65237e3e3b5b1a27.jpg";
import img2 from "../assets/fe8686efe5c95ad56fbb4c17dfa14546.jpg";
import img3 from "../assets/118b4e899715c5cdcaed9decd6cd4738.jpg";
import img4 from "../assets/ac734b84b63eda6bf01aee80ba3786d1.jpg";

const MARQUEE = ["New season drops", "Free shipping on every order", "Limited pairs", "Court · Pitch · Street", "Demo store — no real orders"];

const CATEGORIES = [
    { label: "Lifestyle", to: "/products?purpose=Lifestyle", folder: "Jordan4RetroOffWhiteSail", blurb: "Everyday icons" },
    { label: "Football", to: "/products?purpose=Football", folder: "MercurialSuperfly7EliteSEFGLaserOrange", blurb: "Built for speed" },
    { label: "Apparel", to: "/products?purpose=Apparel", src: "https://images.unsplash.com/photo-1746971054333-8b9610b397a5?w=900&q=80&auto=format&fit=crop", blurb: "Layers for the street" },
    { label: "All products", to: "/products", folder: "YeezyBoost700V2Cream", blurb: "The full edit" },
];

function useIsMobile(query = "(max-width: 768px)") {
    const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
    useEffect(() => {
        const mq = window.matchMedia(query);
        const on = () => setM(mq.matches);
        mq.addEventListener("change", on);
        return () => mq.removeEventListener("change", on);
    }, [query]);
    return m;
}

function HeroVideo() {
    const ref = useRef(null);
    const isMobile = useIsMobile();
    const [playing, setPlaying] = useState(true);

    useEffect(() => {
        const v = ref.current;
        if (!v) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            v.pause();
            setPlaying(false);
        }
    }, [isMobile]);

    function toggle() {
        const v = ref.current;
        if (!v) return;
        if (v.paused) { v.play().catch(() => {}); setPlaying(true); } else { v.pause(); setPlaying(false); }
    }

    return (
        <section className="hero" aria-labelledby="hero-title">
            <div className="hero-media">
                <video
                    key={isMobile ? "m" : "d"}
                    ref={ref}
                    autoPlay muted loop playsInline preload="metadata"
                    aria-hidden="true"
                    src={isMobile ? mainVid1Mobile : mainVid1}
                />
            </div>
            <div className="hero-content">
                <p className="eyebrow !text-white/80">New collab — Season 26</p>
                <SplitHeadline as="h1" lines={["Find new", "ways to create"]} className="display-xl mt-4 max-w-[12ch]" />
                <Reveal delay={0.5} y={16} className="mt-6 flex flex-wrap items-center gap-3">
                    <p className="mr-4 text-lg text-white/90">Discover the new collab.</p>
                    <Link to="/products" className="btn btn-primary">Shop now</Link>
                    <Link to="/products?purpose=Lifestyle" className="btn btn-ghost">Explore lifestyle</Link>
                </Reveal>
            </div>
            <div className="hero-controls">
                <button type="button" className="icon-btn icon-btn-light" onClick={toggle} aria-label={playing ? "Pause background video" : "Play background video"}>
                    {playing ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>
            </div>
        </section>
    );
}

function Marquee() {
    const items = [...MARQUEE, ...MARQUEE];
    return (
        <div className="marquee" aria-label="Store highlights">
            <ul className="sr-only">{MARQUEE.map(m => <li key={m}>{m}</li>)}</ul>
            <div className="marquee-track" aria-hidden="true">
                {items.map((m, i) => <span key={i}>{m} <span className="px-2">✺</span></span>)}
            </div>
        </div>
    );
}

function EditorialGrid() {
    return (
        <section className="section container-x" aria-labelledby="edit-title">
            <div className="grid gap-10 lg:grid-cols-12">
                <Reveal className="lg:col-span-4">
                    <p className="eyebrow">The Edit — 2026</p>
                    <h2 id="edit-title" className="display-lg mt-4">Your passion is your path</h2>
                </Reveal>
                <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6 lg:pt-12">
                    <p className="lede">
                        A curated edit of court classics, football boots and statement lifestyle pairs —
                        chosen for how they move, and how they look when you get there.
                    </p>
                    <Link to="/products" className="link-underline mt-6 inline-block font-semibold">Shop the edit</Link>
                </Reveal>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-12 md:gap-8">
                <Reveal className="md:col-span-7">
                    <Link to="/products" className="media-tile aspect-[4/5] md:aspect-[5/6]">
                        <img src={img1} alt="Athlete in white sprinting, motion-blurred against a dark background" loading="lazy" />
                    </Link>
                    <div className="media-caption"><span className="font-semibold">01 — Motion</span><span className="muted">Run the city</span></div>
                </Reveal>
                <div className="grid gap-6 md:col-span-5 md:gap-8 md:pt-40">
                    <Reveal delay={0.1}>
                        <Link to="/products" className="media-tile aspect-[4/3]">
                            <img src={img2} alt="Bright blue sneaker with light streaks suggesting speed" loading="lazy" />
                        </Link>
                        <div className="media-caption"><span className="font-semibold">02 — Speed</span><span className="muted">Lightweight cushioning</span></div>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <Link to="/products" className="media-tile aspect-[4/3]">
                            <img src={img4} alt="Orange basketball shoe floating among basketballs" loading="lazy" />
                        </Link>
                        <div className="media-caption"><span className="font-semibold">03 — Court</span><span className="muted">Made for the hardwood</span></div>
                    </Reveal>
                </div>
                <Reveal className="md:col-span-12">
                    <Link to="/products" className="media-tile aspect-[16/10] md:aspect-[21/9]">
                        <img src={img3} alt="Red-toned close-up of an athlete's face in profile" loading="lazy" />
                    </Link>
                    <div className="media-caption"><span className="font-semibold">04 — After dark</span><span className="muted">Night sessions</span></div>
                </Reveal>
            </div>
        </section>
    );
}

function FeaturedRail() {
    const { products, status, retry } = useProducts();
    const railRef = useRef(null);
    const featured = products.slice(0, 10);

    function scroll(dir) {
        const el = railRef.current;
        if (!el) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
    }

    return (
        <section className="section !pt-0" aria-labelledby="trending-title">
            <div className="container-x flex items-end justify-between gap-6">
                <Reveal>
                    <p className="eyebrow">Featured</p>
                    <h2 id="trending-title" className="display-md mt-3">Trending now</h2>
                </Reveal>
                <div className="flex items-center gap-2">
                    <Link to="/products" className="link-underline mr-3 hidden text-sm font-semibold sm:inline">View all</Link>
                    <button type="button" className="icon-btn border border-white/20" onClick={() => scroll(-1)} aria-label="Scroll featured products left">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button type="button" className="icon-btn border border-white/20" onClick={() => scroll(1)} aria-label="Scroll featured products right">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>
            </div>
            <div className="container-x mt-10">
                {status === "error" ? (
                    <div className="notice">
                        <span>We couldn't load products right now.</span>
                        <button type="button" className="link-underline font-semibold" onClick={retry}>Try again</button>
                    </div>
                ) : (
                    <ul ref={railRef} className="rail" aria-label="Featured products">
                        {status === "loading"
                            ? Array.from({ length: 5 }, (_, i) => <li key={i}><ProductCardSkeleton /></li>)
                            : featured.map((p, i) => <li key={p.id}><ProductCard product={p} badge={i < 2 ? "Just in" : undefined} /></li>)}
                    </ul>
                )}
            </div>
        </section>
    );
}

function SecondHero() {
    return (
        <section className="hero" aria-labelledby="future-title">
            <div className="hero-media">
                <picture>
                    <source srcSet={heroImg2Mobile} media="(max-width: 768px)" />
                    <img src={heroImg2} alt="" loading="lazy" />
                </picture>
            </div>
            <Reveal className="hero-content">
                <p className="eyebrow !text-white/80">Latest drops</p>
                <h2 id="future-title" className="display-xl mt-4 max-w-[10ch]">Step into the future</h2>
                <p className="mt-5 max-w-md text-lg text-white/90">Explore the latest drops and limited editions.</p>
                <Link to="/products" className="btn btn-primary mt-8">Explore</Link>
            </Reveal>
        </section>
    );
}

function Categories() {
    return (
        <section className="section container-x" aria-labelledby="cat-title">
            <Reveal>
                <p className="eyebrow">Shop by</p>
                <h2 id="cat-title" className="display-md mt-3">Category</h2>
            </Reveal>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {CATEGORIES.map((c, i) => (
                    <Reveal as="li" key={c.label} delay={i * 0.08}>
                        <Link to={c.to} className="group block">
                            <div className={`media-tile aspect-[4/5] ${c.src ? "" : "!bg-[var(--tile)]"}`}>
                                <img src={c.src || getProductImage(c.folder, 1)} alt="" loading="lazy" className={c.src ? "object-cover" : ""} />
                            </div>
                            <div className="media-caption">
                                <span className="display text-3xl">{c.label}</span>
                                <span className="muted">{c.blurb} →</span>
                            </div>
                        </Link>
                    </Reveal>
                ))}
            </ul>
        </section>
    );
}

function MainPage() {
    return (
        <main id="main">
            <HeroVideo />
            <Marquee />
            <EditorialGrid />
            <FeaturedRail />
            <SecondHero />
            <Categories />
        </main>
    );
}

export default MainPage;
