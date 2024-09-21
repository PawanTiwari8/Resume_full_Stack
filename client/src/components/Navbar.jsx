import { NavLink } from "react-router-dom";
import logo from '../assets/logo.png'
import { useDispatch } from "react-redux";
import { logout } from "../utils/userSlice";
import axios from 'axios'



const Navbar = ({isAuthenticated}) => {
const dispatch = useDispatch()
const URL = import.meta.env.VITE_REACT_APP_URL;


const handleLogout = async()=> {

        try {
          const response = await axios({
            method: "get",
            url: URL + "/api/auth/logout",
            withCredentials: true
          });
          if (response.data.success) {
            dispatch(logout())
            navigate("/signin");
          }          
        } catch (error) {
            console.error(error);            
        }
    }

 return (
   
<div>
<nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} className="h-12" alt="Flowbite Logo" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Resume Builder</span>
        </a>
        <div class="flex items-center space-x-6 rtl:space-x-reverse">
            <a href="#" class="text-sm  text-gray-500 dark:text-white hover:underline">Build your future with us</a>
            {!isAuthenticated?null:(<button className="text-sm  text-blue-600 dark:text-blue-500 hover:underline" onClick={handleLogout}>Logout</button>)}
        </div>
    </div>
</nav>

{!isAuthenticated?null:<nav class="bg-gray-50 dark:bg-gray-700">
    <div class="max-w-screen-xl px-4 py-3 mx-auto">
        <div class="flex items-center">
            <ul class="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                <li>
                    <NavLink to='/' className="text-gray-900 dark:text-white hover:underline" aria-current="page">Builder</NavLink>
                </li>
                <li>
                    <NavLink to='/resumes' className="text-gray-900 dark:text-white hover:underline">Resumes</NavLink>
                </li>
                {/* <li>
                    <a href="#" class="text-gray-900 dark:text-white hover:underline">Team</a>
                </li>
                <li>
                    <a href="#" class="text-gray-900 dark:text-white hover:underline">Features</a>
                </li> */}
            </ul>
        </div>
    </div>
</nav>
}
</div>
 );
};

export default Navbar