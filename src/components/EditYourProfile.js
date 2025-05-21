import {React,useState,useEffect, useContext} from "react";
import Axios from "axios";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
//import {UserData,SetUserData} from "./Login";
import { Outlet, Link,useNavigate} from "react-router-dom";
import Navigation from "./NavigationBar";
import { UserContext } from "./UserContextComponent";
function EditYourProfile(){
    
    const {user,setUser,logout}= useContext(UserContext);
    const [userUpdated,setUpdatedUser] = useState(user);
    const profileDetails = [["User-Role",""],["Name",""],["Email","@"],["Password","*"]];
    const [isNotifDisplayed,setNotif] = useState(false);
    const [displayedMessage,setDisplayedMessage] = useState("Successful");
    const navigate = useNavigate();

    useEffect(()=>{
        if(user == null){
            navigate("/");
        }
    },[])

    function handleProfileUpdate(e){
        e.preventDefault();
        
        let isDataValid = true;
        for(let i=1;i<profileDetails.length;i++){
            let attributeName = (profileDetails[i])[0].toLowerCase();
            
            if(userUpdated !=null  && userUpdated[attributeName].replace(" ","").trim().length > 0  ){

            }

            else{
                isDataValid = false;
                if(user != null){
                    setDisplayedMessage("Unsuccessful - No user sign in ")
                }
                else{
                    setDisplayedMessage("Unsuccessful - "+(profileDetails[i])[0] +" is empty")
                }
                

                break;
            }
        }
        
        Axios.get("https://6648f7ef4032b1331becf0f2.mockapi.io/users")
        .then(res=>{
            //Normally you should check the entire data
            
                if(res.data["name"] == userUpdated["name"] && res.data["email"] == userUpdated["email"] && res.data["password"] == userUpdated["password"]){
                    isDataValid = false;
                    
                    
                }
                if(res !=null ){
                    for(let i=0;i<res.data.length;i++){
                        if((res.data[i])["name"] == userUpdated["name"] && (res.data[i])["email"] == userUpdated["email"] 
                        && (res.data[i])["password"] == userUpdated["password"]){
                            isDataValid = false;
                            setDisplayedMessage("Unsuccessful - User already existing with the same credentials");
                            break;
                        }
                    }
    
                }
                if(isDataValid){
                    Axios.put("https://6648f7ef4032b1331becf0f2.mockapi.io/users/"+user.id,userUpdated)
                    .then((res)=>{
                        //console.log(res.status);
                        if(res!=null && res.status == 200){
                            setUser(userUpdated);
                            setDisplayedMessage("Successful ")
                        }
                        
                    })
                }

        })



        setNotif(true);
    }
    function handleDataChange(e){
        let newUserData = userUpdated;
        //console.log("Input changed " + e.target.id);
        if(newUserData != null){
            newUserData[`${e.target.id}`] = e.target.value;
            setUpdatedUser(newUserData);
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
                    <p className="text-sm font-medium text-white-900">Profile update</p>
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
        {/* <Navigation/>     */}
        <form id="ProfileForm">
            <div className="space-y-12">
            <div className="border-b border-white-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-white-900">Profile</h2>
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
                                    defaultValue={userUpdated !=null ? userUpdated[detail[0].toLowerCase()]: ""}
                                    readOnly={detail[0] == "User-Role" ? true: false}
                                    required/>
                                </div>
                            </div>
                    </div>
                    )
                    })

                }

                <div className="col-span-full">
                    <label htmlFor="photo" className="block text-sm font-medium leading-6 text-white-900">
                    Photo
                    </label>
                    <div className="mt-2 flex items-center gap-x-3">
                    <UserCircleIcon className="h-12 w-12 text-white-300" aria-hidden="true" />
                    <button
                        type="button"
                        className="rounded-md bg-blue px-2.5 py-1.5 text-sm font-semibold text-blue-900 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50"
                    >
                        Change
                    </button>
                    </div>
                </div>
    
                <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-white-900">
                    Cover photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white-900/25 px-6 py-10">
                    <div className="text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-white-300" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-white-600">
                        <label
                            htmlFor="file-upload"
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">  or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
    
            <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-white-900">
                <Link to="/">Cancel</Link>
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
        </form>
      </>)
}

export default EditYourProfile;