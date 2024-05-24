import {React, useState,useEffect,useContext} from "react";
import { Outlet, Link} from "react-router-dom";
import {Card, CardHeader, CardBody, CardFooter, Image, Pagination, PaginationItem, PaginationCursor} from "@nextui-org/react";
import Navigation from './NavigationBar';
import Axios from "axios";
import { UserDataContext } from "../UserContext";
//import { UserData } from "./Login";
function Dashboard(){
    
    const [products,setProducts] = useState([]);
    const [productsPagination,setProductsPagination] = useState([]);
    
    //console.log("User data Dashboard"+ UserData)
    useEffect(()=>{
        Axios.get("https://6648f7ef4032b1331becf0f2.mockapi.io/products")
        .then((res)=>{
            if(res.data.length > 0){
                console.log("Getting all products from API")
                setProductsPagination(res.data.slice(0,9));
                setProducts(res.data);
                
            }
            else{
                console.log("API empty")
            }
        })

    }
    ,[])


    const handlePageChange = (pageNumber)=>{
        console.log(pageNumber)
        //let totalPage = Math.ceil(products.length/9);
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

    return(  <>
             <Navigation />
             <div>
                <h1 id="TitleProducts">Products</h1>
             </div>
             <div id="productDiv" className="gap-5 grid grid-cols-2 sm:grid-cols-3">
                
                {productsPagination.map((item)=>{
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
                })}
               
             </div>
             <a href="#" ><Pagination id="pagination"   onChange={(pageNumber)=>handlePageChange(pageNumber)} showControls total={Math.ceil(products.length/9)} initialPage={1} /> </a>
          <Outlet/>
          </>)

}

export default Dashboard;