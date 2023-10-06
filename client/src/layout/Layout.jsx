import { Outlet } from "react-router-dom"
import Header from "../components/Header/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PropTypes from 'prop-types';

const Layout = ({ children }) => {

    return (
        <>
            <Header />
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" />
            <aside className='left'></aside>
            <main className="main-content">
                {children}
            </main>
            <aside className='right'></aside>
            <Outlet />
            <div className="footer"></div>
        </>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired
};


export default Layout
