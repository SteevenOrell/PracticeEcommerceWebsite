import { Link } from "react-router-dom";

function ErrorPage() {
    return (
        <main id="main" className="grid min-h-screen place-items-center px-6 py-24 text-center">
            <div>
                <p className="eyebrow">Error 404</p>
                <h1 className="display-xl mt-4">Off track</h1>
                <p className="muted mx-auto mt-6 max-w-md">We couldn't find the page you're looking for. It may have moved, or the link may be wrong.</p>
                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    <Link to="/" className="btn btn-primary">Go home</Link>
                    <Link to="/products" className="btn btn-ghost">Shop all shoes</Link>
                </div>
            </div>
        </main>
    );
}

export default ErrorPage;
