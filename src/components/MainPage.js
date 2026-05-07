import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { getProductImage } from '../utils/getProductImage';
import mainVid1 from '../assets/athlete-black-man-and-tying-shoes-in-city-for-get-2025-12-18-01-49-15-utc2_compressed.mp4';
import mainVid1Mobile from '../assets/athlete-black-man-and-tying-shoes-on-road-for-get-2025-12-18-02-04-06-utc_compressed.mov';
import heroImg2 from '../assets/ChatGPT Image May 7, 2026, 03_20_05 PM.png';
import heroImg2Mobile from '../assets/8bb2c7a3500bad49a6c6ba61bf8f4efa.jpg';
import img1 from '../assets/cd68aa257b0310cc65237e3e3b5b1a27.jpg';
import img2 from '../assets/fe8686efe5c95ad56fbb4c17dfa14546.jpg';
import img3 from '../assets/ac734b84b63eda6bf01aee80ba3786d1.jpg';
import img4 from '../assets/1e88d072425e43957dc6b15380a265a5.jpg';

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
                <h3 id="HomeImageGridTitle">Your Passion is your path</h3>
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
                <picture>
                    <source srcSet={heroImg2Mobile} media="(max-width: 768px)" />
                    <img src={heroImg2} alt="Step into the future" />
                </picture>
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
