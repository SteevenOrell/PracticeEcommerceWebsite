import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import mainVid1 from '../assets/HeroSectionVid.mp4';
import mainVid2 from '../assets/fashion-teamwork-and-hands-of-women-with-pattern-2025-12-17-14-35-47-utc.mov';
import mainVid1Mobile from '../assets/Sequence 02.mp4';
import mainVid2Mobile from '../assets/bridal-fashion-designers-choosing-decorative-eleme-2026-01-22-16-12-16-utc.mp4';
import img1 from '../assets/hes-the-man-of-the-match-shot-of-a-rugby-player-s-2026-03-25-02-15-18-utc.jpg';
import img2 from '../assets/runners-jumping-over-hurdle-on-track-2026-01-09-11-45-48-utc.jpg';
import img3 from '../assets/standing-firm-on-the-ground-2026-01-09-11-00-59-utc.jpg';
import img4 from '../assets/young-men-running-on-race-track-2026-03-08-23-49-32-utc.jpg';

const VISIBLE = 3;

function MainPage() {
    const [products, setProducts] = useState([]);
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        Axios.get('https://6648f7ef4032b1331becf0f2.mockapi.io/products')
            .then(res => {
                if (res.data.length > 0) setProducts(res.data.slice(0, 10));
            });
    }, []);

    function prev() {
        setCarouselIndex(i => Math.max(0, i - 1));
    }

    function next() {
        setCarouselIndex(i => Math.min(products.length - VISIBLE, i + 1));
    }

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
                    <h2 id="HomeCarouselTitle">Featured Products</h2>
                    <div id="HomeCarouselWrapper">
                        <button
                            className="CarouselArrow CarouselArrowLeft"
                            onClick={prev}
                            disabled={carouselIndex === 0}
                            aria-label="Previous"
                        >&#8592;</button>

                        <div id="HomeCarouselViewport">
                            <div
                                id="HomeCarouselTrack"
                                style={{ transform: `translateX(calc(-${carouselIndex} * (var(--carousel-card-w) + var(--carousel-gap))))` }}
                            >
                                {products.map(item => {
                                    let img;
                                    try { img = require(`../assets/products-images/${item['image-folder-name']}/image1.png`); } catch { img = null; }
                                    return (
                                        <Link to={`/details/${item.id}`} key={item.id} className="CarouselCard">
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

                        <button
                            className="CarouselArrow CarouselArrowRight"
                            onClick={next}
                            disabled={carouselIndex >= products.length - VISIBLE}
                            aria-label="Next"
                        >&#8594;</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default MainPage;
