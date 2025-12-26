import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const LandingLayout = () =>(
    <>
        <nav>
            <Header/>
        </nav>
        
        <div>
            <Outlet/>
        </div>
    </>
)

export default LandingLayout;