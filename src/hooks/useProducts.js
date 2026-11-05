import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../api/products";

// One in-flight request / cached result shared by every component in the session.
let cache = null;
let inflight = null;

function load(force = false) {
    if (cache && !force) return Promise.resolve(cache);
    if (!inflight || force) {
        inflight = getProducts()
            .then(res => {
                cache = Array.isArray(res.data) ? res.data : [];
                return cache;
            })
            .finally(() => { inflight = null; });
    }
    return inflight;
}

/** @returns {{ products: any[], status: "loading"|"ready"|"error", retry: () => void }} */
export function useProducts() {
    const [state, setState] = useState(() => cache ? { products: cache, status: "ready" } : { products: [], status: "loading" });

    const run = useCallback((force) => {
        setState(s => ({ ...s, status: s.products.length ? "ready" : "loading" }));
        load(force)
            .then(products => setState({ products, status: "ready" }))
            .catch(() => setState({ products: [], status: "error" }));
    }, []);

    useEffect(() => { if (!cache) run(false); }, [run]);

    return { ...state, retry: () => run(true) };
}
