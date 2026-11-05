import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Fade/slide-in when the element scrolls into view. Honours prefers-reduced-motion
 * (content is shown immediately, without movement).
 */
export function Reveal({ as = "div", delay = 0, y = 28, className, children, ...rest }) {
    const reduce = useReducedMotion();
    const Tag = motion[as] || motion.div;
    if (reduce) {
        const Plain = as;
        return <Plain className={className} {...rest}>{children}</Plain>;
    }
    return (
        <Tag
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay }}
            {...rest}
        >
            {children}
        </Tag>
    );
}

/** Headline whose lines rise in sequence on mount. */
export function SplitHeadline({ lines, className, as = "h1" }) {
    const reduce = useReducedMotion();
    const Tag = as;
    return (
        <Tag className={className}>
            {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                    {reduce ? (
                        <span className="block">{line}</span>
                    ) : (
                        <motion.span
                            className="block"
                            initial={{ y: "105%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.12 }}
                        >
                            {line}
                        </motion.span>
                    )}
                </span>
            ))}
        </Tag>
    );
}
