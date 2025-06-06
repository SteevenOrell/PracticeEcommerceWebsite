import {React, useContext, useEffect, useState} from "react";
import Axios from "axios";
import { Outlet, Link, useParams,useNavigate} from "react-router-dom";
import Navigation from "./NavigationBar";
//import { UserData } from "./Login";
import ErrorPage from "./ErrorPage";
import { UserContext } from "./UserContextComponent";

function EditUsers(){
    
    const {user,setUser,logout}= useContext(UserContext);
    const {id} = useParams()
    const [otherUser,setDataOtherUser] = useState(null);
    
    const profileDetails = [["User-Role",""],["Name",""],["Email","@"],["Password","*"]];
    const [isNotifDisplayed,setNotif] = useState(false);
    const [displayedMessage,setDisplayedMessage] = useState("Successful");
    const [yourAccount,setYourAccount] = useState(user)
    const navigate = useNavigate();

    useEffect(()=>{
        if(id.length>0){
            Axios.get("https://6648f7ef4032b1331becf0f2.mockapi.io/users/"+id)
            .then(res=>{
                
                if(res !=null ){
                    setDataOtherUser(res.data);
                   
                }
            }).catch((err)=>{
                console.log(err);
                navigate("/")
            })
        }

    },[])

    function handleProfileUpdate(e){
        e.preventDefault();
        
        let isDataValid = true;
        for(let i=1;i<profileDetails.length;i++){
            let attributeName = (profileDetails[i])[0].toLowerCase();
            
            if(otherUser !=null  && otherUser[attributeName].replace(" ","").trim().length > 0  ){

            }

            else{
                    isDataValid = false;
                    setDisplayedMessage("Unsuccessful - "+(profileDetails[i])[0] +" is empty")
                }
                

                break;
            }
        
            console.log(otherUser)
            Axios.get("https://6648f7ef4032b1331becf0f2.mockapi.io/users")
            .then(res=>{
                //Normally you should check the entire data
                
                    if(res.data["name"] == otherUser["name"] && res.data["email"] == otherUser["email"] && res.data["password"] == otherUser["password"] ){
                        isDataValid = false;
                        setDisplayedMessage("Unsuccessful - User already existing");
                        
                    }
                    if(res !=null ){
                        for(let i=0;i<res.data.length;i++){
                            if((res.data[i])["name"] == otherUser["name"] && (res.data[i])["email"] == otherUser["email"] 
                            && (res.data[i])["password"] == otherUser["password"]){ 
                                isDataValid = false;
                                setDisplayedMessage("Unsuccessful - User already existing with the same credentials");
                                break;
                            }
                        }
        
                    }
                    if(isDataValid){
                        Axios.put("https://6648f7ef4032b1331becf0f2.mockapi.io/users/"+otherUser.id,otherUser)
                        .then((res)=>{
                            //console.log(res.status);
                            if(res!=null && res.status == 200){
                                setDisplayedMessage("Successful ")
                            }
                            
                        })
                    }
                
    
            })


        setNotif(true);
    }
    function handleDataChange(e){
        let newUserData = otherUser;
        //console.log("Input changed " + e.target.id);
        if(newUserData != null){
            newUserData[`${e.target.id}`] = e.target.value;
            setDataOtherUser(newUserData);
        }

    }

    return(
    <>
        {isNotifDisplayed ?  (<div id="NotificationEditProfile" aria-live="assertive"  className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white-500 bg-dark divide-x rtl:divide-x-reverse divide-white-200 rounded-lg shadow bottom-5 left-5 dark:text-dark-400 dark:divide-gray-700 space-x dark:bg-dark-800">
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-black shadow-lg ring-1 ring-blue ring-opacity-5">
            <div className="p-4">
                <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-white-900">Update user</p>
                    <p className="mt-1 text-sm text-blue-500">{ displayedMessage }</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                    <button type="button" className="inline-flex rounded-md bg-red text-white-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={()=>setNotif(false)}>
                    <span className="sr-only" >Close</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
        {/* <Navigation/> */}
        { yourAccount != null && yourAccount["user-role"] == "admin" ?    
        <form id="EditSingleUserForm">
            <div className="space-y-12">
            <div className="border-b border-white-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-white-900">Edit User</h2>
                <p className="mt-1 text-sm leading-6 text-white-600">
                This information will be displayed publicly so be careful what you share.
                </p>
    
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {
                    profileDetails.map((detail)=>{

                        return(
                    <div className="sm:col-span-4">
                            <label htmlFor={detail[0].toLowerCase()} className="block text-sm font-medium leading-6 text-white-900">
                                {detail[0]}
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-white-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                                    <span className="flex select-none items-center pl-3 text-white-500 sm:text-sm">{detail[1]}</span>
                                    <input
                                    type={["email","password"].includes(detail[0].toLowerCase()) ? detail[0].toLowerCase() : "text" }
                                    name={detail[0].toLowerCase()}
                                    id={detail[0].toLowerCase()}
                                    onChange={e=>handleDataChange(e)}
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white-900 placeholder:text-white-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    defaultValue={otherUser !=null ? otherUser[detail[0].toLowerCase()]: ""}
                                    readOnly={detail[0] == "User-Role" ? true: false}
                                    required/>
                                </div>
                            </div>
                    </div>
                    )
                    })

                }


                </div>
            </div>
            </div>
    
            <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-white-900">
                <Link to="/manage-users">Cancel</Link>
            </button>
            <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={e=>handleProfileUpdate(e)}
            >
                Save
            </button>
            </div>
            <Outlet/>
        </form> :
        <ErrorPage/>
}
      </>)
}

export default EditUsers;