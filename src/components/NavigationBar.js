import React, {useState, useEffect,useReducer, useContext} from "react";
import Axios from "axios";
import { Outlet, Link, useNavigate} from "react-router-dom"
import {  Navbar,   NavbarBrand,   NavbarContent,Button, Input,  NavbarItem, Link as NextUILink,Dropdown, DropdownTrigger, 
    DropdownMenu,DropdownItem,Avatar, NavbarMenuToggle,  NavbarMenu,  NavbarMenuItem} from "@nextui-org/react";
import {SearchIcon} from "./SearchIcon.js";
import {AcmeLogo} from "./AcmeLogo.js";
import { UserContext } from "./UserContextComponent.js";
import { SearchContext } from "./SearchDataComponent.js";
//import { UserData,SetUserData } from "./Login";



function Navigation(){
    
    const {user,setUser,logout}= useContext(UserContext);
    const {searchData,setSearch} = useContext(SearchContext);
    const [links,setLinks] = useState(["Men","Women","Kids","Accessories"]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    //const [user,setUser] = useState(UserData)
    const [width,setWidth] = useState(window.innerWidth);
    
    const navigate = useNavigate();

    //console.log("Navigation User data "+ user)
    //console.log("User data Dashboard "+ UserData)
    
    // useEffect(()=>{
    //     Axios.get("https://fakestoreapi.com/products/categories")
    //     //.then(res=>JSON.parse(res.data))
    //     .then(res=>{
    //       if(res.data.length !== links.length)
    //         console.log(`Nav bar changed => ${res.data}`)
    //         //setLinks(res.data);
            
    //     })
    // },[]);
    useEffect(()=>{

      //setUser(UserData)
      
      function handleResize() {
        setWidth(window.innerWidth)
      }
      
      window.addEventListener("resize", handleResize)
      
      handleResize();

      
      return () => { 
        window.removeEventListener("resize", handleResize)
      }
      //window.innerWidth we can put it the array too
    },[])
    
    function handleLogout(){
      //setNotif(true);
      //setUser(null)
      logout();
      navigate("/login")
      //console.log("Navigation User data "+ user)
      
    }


    function handleDropdownClick(e){
      //console.log(e.target.innerText);
      if(e.target.innerText == "Manage Users (Admin only)"){
        navigate("/manage-users")
      }
      else if(e.target.innerText == "My Account"){
        navigate("/edit-your-profile")
      }
    }

    function handleSeachTyping(e){
      //console.log(e.target.value);
      setSearch(e.target.value)
    }
    return (
      <>
        {user == null && width > 639? <Navbar ><Link to="/login" id="FirstNavBar" className="text-white-900 hover:text-blue-500">Sign in </Link></Navbar>:""}
       <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
       <NavbarContent className="sm:hidden" justify="start">
            <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarContent>

        {width < 639 ? 
        <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
            <Link to="/" >
              <AcmeLogo />
            </Link>
        </NavbarBrand>
      </NavbarContent> :       
      <NavbarContent justify="start">
          <NavbarBrand className="mr-4" justify="center">
              <Link to="/" >
                <AcmeLogo />
              </Link>
          </NavbarBrand>
      </NavbarContent> }

      <NavbarContent className="hidden sm:flex gap-3" justify="center">


        
          { links.map((link)=>{
               return (
               <NavbarItem key={`key${link}`}>
               <NextUILink color="foreground" href="#">
                 {link}
               </NextUILink>
             </NavbarItem>) 
              }) 
          }

       
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          onChange={(e)=>handleSeachTyping(e)}
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        
        />
        { user != null ? <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={user["name"]}
              size="sm"
              src={user["avatar"]}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user["email"]}</p>
            </DropdownItem>
          
              <DropdownItem key="settings" 
              onPointerEnter={ e=>{ if(width<639){return handleDropdownClick(e)}}}
              onClick={ e=>{ if(width>639){return handleDropdownClick(e)}}}
              >
                  <Link to="/edit-your-profile">My Account</Link>
              </DropdownItem>  

              {user["user-role"] == "admin" ?
              <DropdownItem key="system" 
              onPointerEnter={ e=>{ if(width<639){return handleDropdownClick(e)}}}
              onClick={ e=>{ if(width>639){return handleDropdownClick(e)}}} 
              >
                  <Link to="/manage-users" >Manage Users {` (Admin only)`}</Link>
              </DropdownItem>:""}
              
              <DropdownItem key="logout"  color="danger" 
              onPointerEnter={()=>{if(width<639){return handleLogout()}}}
              onClick={()=>{if(width>639){return handleLogout()}}}>
                    <Link to="/" >
                        Log Out
                    </Link>
              </DropdownItem>
    
          
          
            
          </DropdownMenu>
        </Dropdown> : "" }

        <NavbarMenu>
          {
            user == null && width < 639 ? 
              <NavbarMenuItem key={`mobile-SignIn`} 
              onPointerEnter={()=>{if(width<639){return handleLogout()}}}
              onClick={()=>{if(width>639){return handleLogout()}}}>
                <Link to="/login">
                  <NextUILink
                    className="w-full"
                    color="secondary"
                    href="#"
                    size="lg"
                  >
                    Sign In
                  </NextUILink>
                </Link>
              </NavbarMenuItem>
            :
            <></>

          }
            {links.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <NextUILink
                  className="w-full"
                  color="foreground"
                  href="#"
                  size="lg"
                >
                  {item}
                </NextUILink>
              </NavbarMenuItem>
            ))}
      </NavbarMenu>
      </NavbarContent>
      <Outlet/>
    </Navbar>
    
    
    </>      
    )

}


export default Navigation;