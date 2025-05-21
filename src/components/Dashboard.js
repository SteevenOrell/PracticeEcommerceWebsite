import {React, useState,useEffect,useContext} from "react";
import { Outlet, Link} from "react-router-dom";
import {Card, CardHeader, CardBody, CardFooter, Image, Pagination, PaginationItem, PaginationCursor} from "@nextui-org/react";
import Navigation from './NavigationBar';
import Axios from "axios";
import { SearchContext } from "./SearchDataComponent";

//import { UserData } from "./Login";

function Dashboard(){
    
    const {searchData,setSearch} = useContext(SearchContext);
    const [products,setProducts] = useState([]);
    const [productsPagination,setProductsPagination] = useState([]);
    const [isSearchDataFound,setSearchDataFound] = useState(true)
    //console.log("User data Dashboard"+ UserData)
    useEffect(()=>{
        Axios.get("https://6648f7ef4032b1331becf0f2.mockapi.io/products")
        .then((res)=>{
            if(res.data.length > 0){
                //console.log("Getting all products from API")
                setProductsPagination(res.data.slice(0,9));
                setProducts(res.data);
                
            }
            else{
                console.log("API empty")
            }
        })

    }
    ,[])

    useEffect(()=>{
        if(searchData.length == 0){
            setProductsPagination(products.slice(0,9));
        }
        else{
            let isBoolRst = searchedKeysFound();
            setSearchDataFound(isBoolRst);

        }
    },
    [searchData])

    const searchedKeysFound = ()=>{

        const newSearchArray = [];
        // console.log("Search key "+ searchData)
        for(let item of products){
            
            if(item["article-name"].toLowerCase().includes(searchData.toLowerCase())){
                newSearchArray.push(item);
            }
        }
        if(newSearchArray.length>0){
            setProductsPagination(newSearchArray)
            return true;
        }
        return false;
    }
    const handlePageChange = (pageNumber)=>{
        //console.log(pageNumber)
        //let totalPage = Math.ceil(products.length/9);
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scroll animated
        });
 
        let currentPagination = [];
        let startingPoint = 0;
        let endingPoint = 9;
        for(let i=1;i<=pageNumber;i++){
            currentPagination = products.slice(startingPoint,endingPoint);
            startingPoint+=9;
            endingPoint+=9;
            if(endingPoint >= products.length){
                endingPoint = products.length;
            }
        }
        setProductsPagination(currentPagination)
    }
    const handleSearchReset = ()=>{
        setSearch("");
        setProductsPagination(products.slice(0,9));
        setSearchDataFound(true)
    }
    return(  <>
             {/* <Navigation /> */}
             <div>
                <h1 id="TitleProducts">Products</h1>
             </div>
             { !isSearchDataFound ?
                <main className="grid min-h-full place-items-center bg-black px-6 py-24 sm:py-32 lg:px-8">
                    <div className="text-center">
                    
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-white-900 sm:text-5xl">Keywords not found</h1>
                    <p className="mt-6 text-base leading-7 text-blue-600">Sorry, we couldn’t find the product you’re looking for.</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6" onClick={()=>handleSearchReset()}>
                        <Link to="/"
                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Search another keyword
                        </Link>
                        <a href="#" className="text-sm font-semibold text-white-900">
                        Contact support <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                    </div>
                                
                </main> : <></>
             }
             <div id="productDiv" className="gap-5 grid grid-cols-2 sm:grid-cols-3">
                
                { isSearchDataFound ? 
                    productsPagination.map((item)=>{
                        let path = require(`../assets/products-images/${item["image-folder-name"]}/image1.png`);
                        //console.log(path)
                        return (
                        
                                <Card className="py-4" key={item.id} shadow="sm"  isPressable onPress={() => console.log("item pressed")}>
                                    <Link to={`/details/${item.id}`} >   
                                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                            <Image
                                            alt="Card background"
                                            className="object-cover rounded-xl"
                                            src={path}
                                            //height={330}
                                            width={430}
                                            />
                                        
                                        </CardHeader>
                                        <CardBody className="overflow-visible py-2">
                                            <h4 className="font-bold text-large">{item["article-name"]}</h4>
                                            <p className="text-tiny uppercase font-bold">{"$"+item["price"]} </p>
                                            <small className="text-default-500">Color {item["color"]} </small>
                                            
                                        </CardBody>
                                    </Link>
                                </Card>
                    
                        ) 
                                 
                    }) :  <></> 

                    }
               
             </div>
             <a href="#TitleProducts" ><Pagination id="pagination"   onChange={(pageNumber)=>handlePageChange(pageNumber)} showControls total={Math.ceil(products.length/9)} initialPage={1} /> </a>
          <Outlet/>
          </>)

}

export default Dashboard;