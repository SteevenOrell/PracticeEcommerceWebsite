import React, { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext({searchData:"", setSearch:()=>{}});

function SearchDataComponent({children}){
    
    const [searchData,setProductDataSearch] = useState("");
    const setSearch = (words)=>{

        setProductDataSearch(words);
    }
    return(
        <SearchContext.Provider value={{searchData,setSearch}}>
            {children}
        </SearchContext.Provider>
    )
}



export {SearchDataComponent,SearchContext}