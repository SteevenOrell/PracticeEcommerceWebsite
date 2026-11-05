import { Link } from "react-router-dom";

const SHOP = [
    { label: "All products", to: "/products" },
    { label: "Apparel", to: "/products?purpose=Apparel" },
    { label: "Lifestyle", to: "/products?purpose=Lifestyle" },
    { label: "Football", to: "/products?purpose=Football" },
];
const HELP = [
    { label: "Your bag", to: "/cart" },
    { label: "Checkout", to: "/checkout" },
    { label: "Sign in", to: "/login" },
];
const EXTERNAL = [
    { label: "About the developer", href: "https://steeven-wemin-portfolio.vercel.app/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/orell-wemin-8519a5179" },
];

function Footer() {
    return (
        <footer className="site-footer">
            <div className="container-x grid gap-12 py-16 md:grid-cols-12">
                <div className="md:col-span-5">
                    <p className="display text-4xl">Clodio Vendem</p>
                    <p className="muted mt-4 max-w-sm text-sm leading-relaxed">
                        A portfolio demo storefront built with React, Vite and Tailwind CSS. Not a real store:
                        no orders are fulfilled and no payments are taken.
                    </p>
                </div>
                <nav className="md:col-span-2" aria-labelledby="f-shop">
                    <h2 id="f-shop" className="eyebrow">Shop</h2>
                    <ul className="mt-4 space-y-3 text-sm">{SHOP.map(l => <li key={l.label}><Link to={l.to} className="hover:underline">{l.label}</Link></li>)}</ul>
                </nav>
                <nav className="md:col-span-2" aria-labelledby="f-help">
                    <h2 id="f-help" className="eyebrow">Help</h2>
                    <ul className="mt-4 space-y-3 text-sm">{HELP.map(l => <li key={l.label}><Link to={l.to} className="hover:underline">{l.label}</Link></li>)}</ul>
                </nav>
                <nav className="md:col-span-3" aria-labelledby="f-more">
                    <h2 id="f-more" className="eyebrow">More</h2>
                    <ul className="mt-4 space-y-3 text-sm">
                        {EXTERNAL.map(l => (
                            <li key={l.label}>
                                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {l.label} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="container-x overflow-hidden">
                <p className="footer-wordmark" aria-hidden="true">Clodio Vendem</p>
            </div>
            <div className="container-x flex flex-wrap justify-between gap-4 border-t hairline py-6 text-xs muted">
                <span>© {new Date().getFullYear()} Steeven Wemin. All rights reserved.</span>
                <span>Product names and images are used for demonstration purposes only.</span>
            </div>
        </footer>
    );
}

export default Footer;
