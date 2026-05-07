import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { getProductImage } from '../utils/getProductImage';
import mainVid1 from '../assets/HeroSectionVid.mp4';
import mainVid2 from '../assets/fashion-teamwork-and-hands-of-women-with-pattern-2025-12-17-14-35-47-utc.mov';
import mainVid1Mobile from '../assets/fashion-teamwork-and-hands-of-women-with-pattern-2025-12-17-14-35-47-utc.mov';
import mainVid2Mobile from '../assets/bridal-fashion-designers-choosing-decorative-eleme-2026-01-22-16-12-16-utc.mp4';
import img1 from '../assets/hes-the-man-of-the-match-shot-of-a-rugby-player-s-2026-03-25-02-15-18-utc.jpg';
import img2 from '../assets/runners-jumping-over-hurdle-on-track-2026-01-09-11-45-48-utc.jpg';
import img3 from '../assets/standing-firm-on-the-ground-2026-01-09-11-00-59-utc.jpg';
import img4 from '../assets/young-men-running-on-race-track-2026-03-08-23-49-32-utc.jpg';

function MainPage() {
    const [products, setProducts] = useState([]);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        Axios.get('https://6648f7ef4032b1331becf0f2.mockapi.io/products')
            .then(res => {
                if (res.data.length > 0) setProducts(res.data.slice(0, 10));
            });
    }, []);

    return (
        <>
            <div id="HeroDiv1">
                <video autoPlay loop muted playsInline>
                    <source src={mainVid1Mobile} media="(max-width: 768px)" type="video/mp4" />
                    <source src={mainVid1} type="video/mp4" />
                </video>
                <div className="Hero-content">
                    <h3>Find new ways to create</h3>
                    <p>Discover the Nike X Louis vuitton collab</p>
                    <Link to="/details/17">
                        <button>Shop Now</button>
                    </Link>
                </div>
            </div>

            <div id="HomeImageGrid">
                <h3 id="HomeImageGridTitle">Our Passion</h3>
                <Link to="/products" className="HomeImageGridItem">
                    <img src={img1} alt="Jordan 1 Retro High Off-White Blue" />
                </Link>
                <Link to="/products" className="HomeImageGridItem">
                    <img src={img2} alt="Air Force Louis Vuitton" />
                </Link>
                <Link to="/products" className="HomeImageGridItem">
                    <img src={img3} alt="Jordan 4 Retro Off-White Sail" />
                </Link>
                <Link to="/products" className="HomeImageGridItem">
                    <img src={img4} alt="Off-White x Blazer Mid" />
                </Link>
            </div>

            <div id="HeroDiv2">
                <video autoPlay loop muted playsInline>
                    <source src={mainVid2Mobile} media="(max-width: 768px)" type="video/mp4" />
                    <source src={mainVid2} type="video/mp4" />
                </video>
                <div className="Hero-content">
                    <h3>Step into the future</h3>
                    <p>Explore the latest drops and limited editions</p>
                    <Link to="/products">
                        <button>Explore</button>
                    </Link>
                </div>
            </div>

            {products.length > 0 && (
                <div id="HomeCarouselSection">
                    <div id="HomeCarouselHeader">
                        <h2 id="HomeCarouselTitle">Featured Products</h2>
                        <button
                            id="CarouselPlayPause"
                            onClick={() => setIsPaused(p => !p)}
                            aria-label={isPaused ? "Play" : "Pause"}
                        >
                            {isPaused ? (
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                    <div id="HomeCarouselViewport">
                        <div
                            id="HomeCarouselTrack"
                            className={isPaused ? "paused" : ""}
                            style={{ '--carousel-count': products.length }}
                        >
                            {[...products, ...products].map((item, i) => {
                                const img = getProductImage(item['image-folder-name']);
                                return (
                                    <Link to={`/details/${item.id}`} key={i} className="CarouselCard">
                                        <div className="CarouselCardImg">
                                            {img && <img src={img} alt={item['article-name']} />}
                                        </div>
                                        <p className="CarouselCardName">{item['article-name']}</p>
                                        <p className="CarouselCardPrice">${item.price}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MainPage;
