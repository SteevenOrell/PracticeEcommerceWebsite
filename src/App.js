import logo from './logo.svg';
//import './App.css';
import { BrowserRouter,Routes, Route,useNavigate, Link, Outlet, useLocation} from 'react-router-dom';
import Axios from "axios";
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Details from "./components/Details";
import Login from './components/Login';

import ErrorPage from "./components/ErrorPage";
import { createContext, useContext, useState,useEffect } from 'react'; 
import ManageUsers from './components/ManageUsers';
import EditYourProfile from './components/EditYourProfile';
import EditUsers from './components/EditUsers';
import { UserContextComponent } from './components/UserContextComponent';
import Navigation from './components/NavigationBar';
import { SearchDataComponent } from './components/SearchDataComponent';




function App() {

  const location = useLocation();
  //console.log("URL "+ JSON.stringify(location))
  return (
    <UserContextComponent>
      <SearchDataComponent> 
      {/* <BrowserRouter> */}
        <div className="App">
          {
            ["/","/edit-your-profile","/manage-users"].includes(location.pathname) 
            || location.pathname.includes("/edit-users/")
            || location.pathname.includes("/details/") 
            ?
             
              <Navigation/> : <></>
          }
          
            
            <Routes>
              
                <Route path=''  element={<Dashboard/>} />
               
                <Route path='details/:id'  element={<Details/>} />
                <Route path='login'  element={<Login />} />
                <Route path='edit-your-profile'  element={<EditYourProfile />} />
                <Route path='manage-users'  element={<ManageUsers />} />
                <Route path='edit-users/:id'  element={<EditUsers />} />
                <Route path='*'  element={<ErrorPage/>} />
                
            </Routes>
          
          <Footer/>
      
        </div>
      {/* </BrowserRouter> */}
      </SearchDataComponent>
    </UserContextComponent>
  );
}



export default App;

