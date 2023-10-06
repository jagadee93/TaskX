
import { useState } from "react";
import Logo from "../../assets/Logo.png";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import { Link, useNavigate } from "react-router-dom";
const Header = () => {
    const [navOpen, setNavOpen] = useState(false);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();
    function clickHandler() {
        setNavOpen(!navOpen)
    }



    const signOut = async () => {
        await logout();
        navigate("/login");
    };
    return (
        <header>
            <div className="container row center">
                <button className="nav-toggle" onClick={clickHandler} aria-label="open navigation">
                    <span className="hamburger"></span>
                </button>
                <a className="logo" href="#">
                    <img src={Logo} alt="task x Logo" />
                </a>
                <nav className={`${navOpen ? "nav--visible" : "nav"}`}>
                    <ul className="nav__list nav__list--primary">
                        <li className="nav__item"><Link to="/home" className="nav__link">New task</Link></li>
                        {/* <li className="nav__item"><Link to="/new" className="nav__link">New List</Link></li>
                        <li className="nav__item"><Link to="lists" className="nav__link">All Lists</Link></li> */}
                    </ul>
                    <ul className="nav__list nav__list--secondary">


                        {
                            auth?.user ? <li className="nav__item"><Link onClick={signOut} className="nav__link">Sign out</Link></li> :
                                <li className="nav__item"><Link to="/login" className="nav__link">Sign In</Link></li>
                        }

                        <li className="nav__item"><Link to="/register" className="nav__link nav__link--button">Sign up</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header