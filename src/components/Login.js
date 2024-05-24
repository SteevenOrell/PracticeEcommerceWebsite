import React, { useContext, useEffect, useState } from "react";
import {AcmeLogo} from "./AcmeLogo.js";
import Axios from "axios";
import { Outlet, Link, useNavigate} from "react-router-dom";
import Dashboard from "./Dashboard.js";
import { UserDataContext } from "../UserContext.js"; 

let UserData = null
function SetUserData(newValue){
    UserData = newValue;
}
function Login(){

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("");
    const [user,setUser] = useState(null);
    
  
    const [isSubmitClicked,setSubmit] = useState(false);
    const [isNotifDisplayed,setNotif] = useState(false);
    const navigate = useNavigate();
    
  
  
    useEffect(()=>{
        if(isSubmitClicked){
            Axios.get("https://6648f7ef4032b1331becf0f2.mockapi.io/users")
            .then((res)=>{
                if(res.data != null && res.data.length> 0){
                    //console.log("Current email and password input "+ email +" "+ password);
                    let count = 0;
                    for(let i=0; i < res.data.length;i++){
                        //console.log(res.data[i].email +" "+ res.data[i].password)
                        if(email == res.data[i].email && password == res.data[i].password){
                            
                            console.log("User found" )
                            
                            setUser(res.data[i])
                            UserData = res.data[i]
                            navigate('/');
                            //Send to Dashboard
                        }
                        else{
                            count++;
                            
                        }
                    }
                    if(count == res.data.length){
                        setNotif(true);
                        console.log("User not found")
                    }
                }
                else{
                    setNotif(true);
                    console.log("User list is empty");
  
                }
            })
        }

        setSubmit(false)
    },[isSubmitClicked])



    const handleEmailChange = (e)=>{
        //console.log(e.target.value);
        setEmail(e.target.value)
    }
    const handlePasswordChange = (e)=>{
        //console.log(e.target.value);
        setPassword(e.target.value)
    }
    const handleSubmitClicked = (e)=>{
        setSubmit(true);
        e.preventDefault();
        
        
    }
    return (<>
    {isNotifDisplayed ?  (<div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
        <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
            
            <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-black shadow-lg ring-1 ring-red ring-opacity-5">
            <div class="p-4">
                <div class="flex items-start">
                <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                    <p class="text-sm font-medium text-white-900">User not found</p>
                    <p class="mt-1 text-sm text-white-500">Please enter correct credentials</p>
                </div>
                <div class="ml-4 flex flex-shrink-0">
                    <button type="button" class="inline-flex rounded-md bg-red text-white-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={()=>setNotif(false)}>
                    <span class="sr-only" >Close</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>): "" 
    }
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* {<AcmeLogo />} */}
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white-900">
        Sign in to your account
      </h2>
    </div>
  
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" >
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-white-900">
            Email address
          </label>
          <div className="mt-2">
          
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              onChange={e=>handleEmailChange(e)}
              required
              className="block w-full rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-white-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-white-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
  
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-whit-900">
              Password
            </label>
            <div className="text-sm">
              <a href="#" className="font-semibold text-blue-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-2">
          
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              onChange={e=>handlePasswordChange(e)}
              required
              className="block w-full rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-white-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
  
        <div>
          <Link to="/">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={(e)=>handleSubmitClicked(e)}
            >
            Sign in
          </button>
          </Link>  
        </div>
      </form>
  
  
    </div>
    <Outlet/>
    
  </div>
  </>
  )
  }

export {Login, UserData,SetUserData};