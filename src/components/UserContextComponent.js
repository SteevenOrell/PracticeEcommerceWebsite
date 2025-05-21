import React, { createContext, useContext, useEffect, useState } from "react";
import {AcmeLogo} from "./AcmeLogo.js";
import Axios from "axios";
import { Outlet, Link, useNavigate} from "react-router-dom";
import Dashboard from "./Dashboard.js";


//Using cookies or context api will be better than handling user data this way
const UserContext = createContext({userData:null, setUser: ()=>{}, logout: () => {}});

function UserContextComponent({children}){

    const [user,setDataUser] = useState(null);

    useEffect(() => {
        //console.log("Checking for initial user data.");
        const storedUser = localStorage.getItem('userData'); //unsecure way to store data don't put important data
        if (storedUser) {
        setDataUser(JSON.parse(storedUser));
        //console.log("UserProvider: Found stored user:", JSON.stringify(storedUser));
        }
  }, []);

    const setUser = (userData)=>{
        if(userData){
            //console.log("User login "+ JSON.stringify(userData))
            localStorage.setItem("userData",JSON.stringify(userData))
            setDataUser(userData);
        }
        else{
            localStorage.removeItem('userData');
      
        }


    }

    const logout = () =>{
      console.log("User logout");
      setUser(null);
      
    }
    
    return (

        <UserContext.Provider value={{user,setUser,logout}}>
            {children}
        </UserContext.Provider>

    )
}

export {UserContextComponent, UserContext};