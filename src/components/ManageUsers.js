import {React, useEffect, useState,useCallback, useContext} from "react";
import Axios from "axios";
import { Outlet, Link} from "react-router-dom";
import Navigation from "./NavigationBar";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Tooltip,Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";
import {EyeIcon} from "./EyeIcon";
//import { UserData } from "./Login";
import ErrorPage from "./ErrorPage";
import { UserContext } from "./UserContextComponent";


function ManageUsers(){

    const {user,setUser,logout}= useContext(UserContext);
    const columnHeader = [
        {name: "NAME", uid: "name"},
        {name: "User Role", uid: "user-role"},
        {name: "ACTIONS", uid: "actions"},
      ];
    const addUserInput = ["Name","Email","Password","User-Role"];
    const [userToAdd,setUserToAdd] = useState({
        "createdAt": new Date(),
        "name": "",
        "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/142.jpg",
        "password": "",
        "email": "",
        "user-role": "",
        // "id": 100
      });  
    const [isNotifDisplayed,setNotif] = useState(false);
    const [usersList,setUsers] = useState([]);
    
    const [displayedMessage,setDisplayedMessage] = useState("Successfully Deleted");
    
    
    useEffect(()=>{
        refreshData();
    },[])

    function handleProfileUpdate(e){
        e.preventDefault();
        
        let isDataValid = true;
        for(let i=0;i<addUserInput.length;i++){
            let attributeName = addUserInput[i].toLowerCase();
            
            if(userToAdd !=null  && userToAdd[attributeName].replace(" ","").trim().length > 0  ){

            }

            else{
                    isDataValid = false;
                    setDisplayedMessage("Cannot be added - "+addUserInput[i] +" is empty")
                
                    break;
            }
        }
        
        Axios.get("https://6648f7ef4032b1331becf0f2.mockapi.io/users")
        .then(res=>{
            
            if(res !=null ){
                for(let i=0;i<res.data.length;i++){
                    if((res.data[i])["name"] == userToAdd["name"] && (res.data[i])["email"] == userToAdd["email"] ){
                        isDataValid = false;
                        setDisplayedMessage("Cannot be added - User already existing");
                        break;
                    }
                }

            }
            if(isDataValid){
                Axios.post("https://6648f7ef4032b1331becf0f2.mockapi.io/users",userToAdd)
                .then((res)=>{
                    console.log(res.status);
                    if(res!=null && [200,201].includes(res.status) ){
                        setDisplayedMessage("Added Successfully ")
                        document.getElementById("AddUserForm").reset();
                    }
                    
                })
                .then(()=>{
                    refreshData();
                })
            }
        })


        
        setNotif(true);
    }
    function handleDataChange(e){
        let newUserData = userToAdd;
        //console.log("Input changed " + e.target.id);
        if(newUserData != null){
            newUserData[`${e.target.id}`] = e.target.value;
            setUserToAdd(newUserData);
        }

    }
    function handleDelete(e){
        console.log(e.target.id)
        let id= e.target.id;
        if(id != "" && id.length >0){
                Axios.delete("https://6648f7ef4032b1331becf0f2.mockapi.io/users/"+id)
                .then(res=>{
                    //console.log(res)
                    if(res != null && res.status == 200){
                        setDisplayedMessage("Successfully Deleted");
                        setNotif(true);
                        refreshData();
                    }
                    else{
                        setDisplayedMessage("Operation Failed - unable to delete");
                        setNotif(true)
                    }
                })
        }
    }
    
    function refreshData(){
        Axios.get("https://6648f7ef4032b1331becf0f2.mockapi.io/users")
        .then(res=>{
            if(res.data != null){
                setUsers(res.data)
            }
        })
    }
    return(<>
        {/* <Navigation/> */}

        {user != null && user["user-role"] == "admin" ? (<div className="flex w-full flex-col">
            <Tabs id="ManagerUserTab" aria-label="Options">
                <Tab key="ViewUsers" title="View Users">

                    <div id="DivTableUsers">
                        <h1 id="TitleUserList">List of Users</h1>
                            <Table id="TableUsers" aria-label="Example table with custom cells">
                        
                                <TableHeader columns={columnHeader} >
                                    {
                                        (colHeader)=>{
                                            //count++;
                                            return(
                                            <TableColumn key={colHeader.uid}  align={colHeader.uid == "actions" ?"center":"start"} >
                                                {colHeader.name}
                                            </TableColumn>)
                                        }
                                    }
                                </TableHeader>
                                <TableBody items={usersList} >
                                    { (item) => { 
                                        
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <User
                                                        avatarProps={{radius: "lg", src: item.avatar}}
                                                        description={item.email}
                                                        name={item.name}
                                                    >
                                                        {item.email}
                                                    </User>
                                                </TableCell>
                                                <TableCell>
                                                <div className="flex flex-col">
                                                    <p className="text-bold text-sm capitalize">{item["user-role"]}</p>
                                                    {/* <p className="text-bold text-sm capitalize text-default-400">{user.team}</p> */}
                                                </div>
                                                </TableCell>
                                                <TableCell>
                                                <div className="relative flex items-center gap-2">
                                                    <Link to={"/edit-users/"+item.id}>
                                                        <Tooltip content="Edit user">
                                                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                                <EditIcon />
                                                            </span>
                                                        </Tooltip>
                                                    </Link>
                                                    <div className="UsersDeleteBtn" >
                                                        <Tooltip  color="danger"  content="Delete user">
                                                            <span className="text-lg text-danger cursor-pointer active:opacity-50"  >
                                                                <DeleteIcon id={item.id} onClick={e=>handleDelete(e)} />
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                </TableCell>
                                            </TableRow>
                                            )
                                        }
                                    }
                                </TableBody>
                    
                                
                            
                            </Table>
                    </div>
                </Tab>
                <Tab key="AddUser" title="Add User">

                    <form id="AddUserForm">
                        <div className="space-y-12">
                        <div className="border-b border-white-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-white-900">Profile</h2>
                            <p className="mt-1 text-sm leading-6 text-white-600">
                                Add a user
                            </p>
                
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {
                                addUserInput.map((detail)=>{

                                    return(
                                <div className="sm:col-span-4">
                                        <label htmlFor={detail.toLowerCase()} className="block text-sm font-medium leading-6 text-white-900">
                                            {detail}
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-white-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                                                
                                                <input
                                                type={["email","password"].includes(detail.toLowerCase()) ? detail.toLowerCase() : "text" }
                                                name={detail.toLowerCase()}
                                                id={detail.toLowerCase()}
                                                onChange={e=>handleDataChange(e)}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white-900 placeholder:text-white-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                
                                                
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
                            <Link to="/">Cancel</Link>
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={e=>handleProfileUpdate(e)}
                        >
                            Add User
                        </button>
                        </div>
                        <Outlet/>
                    </form>
        
                </Tab>

            </Tabs>
        </div>  
    ) :<ErrorPage/>
        }
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
                            <p className="text-sm font-medium text-white-900">User </p>
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
            <Outlet/>
        </>
    )
}

export default ManageUsers;