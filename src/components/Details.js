import {React, useState,useEffect, useContext}  from "react";
import Navigation from './NavigationBar';
import { Outlet, Link, useParams,useNavigate} from "react-router-dom";
import { CartContext } from "./CartContextComponent";
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';

import Axios from "axios";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

function Details(){
    const [product,setProduct] = useState({})
    const [images,setImages] = useState([])
    const [qty, setQty] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    
    
    const reviews = { href: '#', average: 4, totalCount: 117 }
    const {id} = useParams();
    let count =0;
    useEffect(()=>{
        console.log("id from url "+ id)
        if(id !=null && id>0){
            Axios.get("https://6648f7ef4032b1331becf0f2.mockapi.io/products/"+id)
            .then((res)=>{
                if(res.data != null){
                    //console.log(res.data)
                    setProduct(res.data);
                    let arrOfImages = []
                    for(let i=0;i<5;i++){
                        let pathImage = require(`../assets/products-images/${res.data["image-folder-name"]}/image${i+1}.png`)
                        //console.log(pathImage)
                        arrOfImages.push(pathImage);
                    }
                    setImages(arrOfImages)
                }
            }).catch((err)=>{
              console.log(err)
              navigate("/")
            })
        }
    },[])
    return (<>
    {/* <Navigation/> */}
    <div >
      <div className="pt-6">


        {/* Mobile carousel */}
        {images.length > 0 && (
          <div className="relative lg:hidden mx-auto mt-6 max-w-2xl px-4 sm:px-6">
            <div
              className="overflow-hidden rounded-2xl bg-gray-900"
              style={{ aspectRatio: '3/4', maxHeight: '68vh' }}
              onTouchStart={e => { e.currentTarget._touchX = e.touches[0].clientX; }}
              onTouchEnd={e => {
                const diff = e.currentTarget._touchX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                  setCurrentSlide(i =>
                    diff > 0
                      ? Math.min(i + 1, images.length - 1)
                      : Math.max(i - 1, 0)
                  );
                }
              }}
            >
              <div
                className="flex h-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {images.map((img, i) => (
                  <div key={i} className="min-w-full h-full flex-shrink-0">
                    <img
                      src={img}
                      alt={`${product["article-name"]} - view ${i + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Prev arrow */}
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(i => i - 1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center shadow-md hover:bg-black/65 transition-colors"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}

            {/* Next arrow */}
            {currentSlide < images.length - 1 && (
              <button
                onClick={() => setCurrentSlide(i => i + 1)}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center shadow-md hover:bg-black/65 transition-colors"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}

            {/* Dot indicators */}
            <div className="flex justify-center items-center gap-2 mt-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-5 bg-white' : 'w-2 bg-white/35 hover:bg-white/60'}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Desktop image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={images[0]}
              alt={product["article-name"]}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={images[1]}
                alt={product["article-name"]}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={images[2]}
                alt={product["article-name"]}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="hidden lg:block aspect-h-4 aspect-w-3 overflow-hidden rounded-lg">
            <img
              src={images[3]}
              alt={product["article-name"]}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-white-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-white-900 sm:text-3xl">{product["article-name"]}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-white-900">$ {product["price"]}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating ? 'text-white-900' : 'text-white-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-gray-600 hover:text-gray-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <form className="mt-10">
            <div>
                <h3 className="text-sm font-medium text-gray-300">Color</h3>
                  <p> {product.color}</p>

              </div>   




              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-300">Size</h3>
                  <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-500">
                    Size guide
                  </a>
                </div>

                <RadioGroup className="mt-4">
                  
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                    
                      <RadioGroup.Option
                        
                        value={product["size"]}
                        
                      >

                            <RadioGroup.Label as="span">{product["size"]}</RadioGroup.Label>
      
                      </RadioGroup.Option>
                    
                  </div>
                </RadioGroup>
              </div>

              <div className="DetailsQtySelector">
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty(q => q + 1)}>+</button>
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-gray-700 px-8 py-3 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={e => { e.preventDefault(); addToCart(product, qty); }}
              >
                Add to bag
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-white-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-white-900">{product.description}</p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
    </>)
}

export default Details;