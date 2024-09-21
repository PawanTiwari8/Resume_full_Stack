import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';


const Appstore = configureStore(
    {
        reducer : {
            User : userReducer,   
        },
    }
)
export default Appstore;