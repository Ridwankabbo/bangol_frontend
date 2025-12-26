import React from "react";
import { Link } from "react-router-dom";


const Header = () => {

    return(
        <section className="flex justify-around items-center bg-blue-600 text-white py-3">
            <div>
                <Link to={'/'} ><h2 className="text-4xl font-bold ">Bangol.</h2></Link>
            </div>
            <div className="flex gap-10">
                <Link to="/">Home</Link>
                <Link to="/singin">Sing in</Link>
                <Link to="/singup">Sing up</Link>
            </div>
        </section>
    )

}

export default Header;