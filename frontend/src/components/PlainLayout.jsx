import { Outlet, Link } from "react-router-dom";

export function PlainLayout() {
    return(
    <>
        <nav>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </nav>    
        <Outlet />
    </>
    )
}