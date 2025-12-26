import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Singin = ()=>{
    const singin_url = 'http://localhost:8000/api/singup';

    const [data, setData] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data);
        
        const request = await fetch(singin_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
            },
            body: JSON.stringify(data)
        });

        try {
            const result = await request.json();
            console.log(result);
            localStorage.settItem('accessToken', result.token?.accessToken?.plainTextToken);
            console.log(localStorage.getItem('accessToken'));
            

        } catch (error) {

        }
    }

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    return (
        <>
            <div className="text-center py-20" >
                <div className="text-5xl">Sing up</div>
                <div>
                    <form className="py-5 px-5 flex flex-col gap-7" onSubmit={handleSubmit}>
                        
                        <div>
                            <input type="email" placeholder="Enter email" name="email" id="email" onChange={handleChange} className="py-2 px-8 border rounded-2xl" />
                        </div>
                        <div>
                            <input type="password" placeholder="Enter password" name="password" id="email" onChange={handleChange} className="py-2 px-8 border rounded-2xl" />
                        </div>
                        <div>
                            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-2xl font-semibold text-xl">Sing up</button>
                        </div>
                    </form>
                    <div>
                        Already have an account <Link to={'/singup'} className="text-blue-500 px-2">sing up</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Singin;