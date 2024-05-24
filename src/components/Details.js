import {React, useState,useEffect}  from "react";
import Navigation from './NavigationBar';
import { Outlet, Link, useParams,useNavigate} from "react-router-dom";
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';

import Axios from "axios";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

function Details(){
    const [product,setProduct] = useState({})
    const [images,setImages] = useState([])
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
    <Navigation/>
    <div >
      <div className="pt-6">


        {/* Image gallery */}
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
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
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
                <a href={reviews.href} className="ml-3 text-sm font-medium text-blue-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <form className="mt-10">
            <div>
                <h3 className="text-sm font-medium text-blue-900">Color</h3>
                  <p> {product.color}</p>

              </div>   




              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-blue-900">Size</h3>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-indigo-500">
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

              <button
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={e=>{e.preventDefault()}}
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