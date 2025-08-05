import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket, faRightToBracket, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { userContext } from '../Context/userContext';

export default function Navbar() {
    const location = useLocation();
    const currentPath = location.pathname;
    let { userToken, setUserToken } = useContext(userContext);
    let navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false); // For Mobile Menu Toggle

    function logOut() {
        localStorage.removeItem('userToken');
        setUserToken(null);
        navigate('/');
    }

    return (
        <>
            <nav className="bg-[#FFFFFFCC] fixed z-20 top-6 left-1/2 -translate-x-1/2 shadow-md rounded-xl w-[95%] max-w-[1386px] h-auto md:h-[75px] px-4 sm:px-6 md:px-[11px] py-4 md:py-[7px]">
                <div className="flex flex-wrap items-center justify-between w-full md:py-2">
                    {/* Logo */}
                    <Link to={'/'} className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="my-ruwudu-text font-semibold text-[24px] sm:text-[28px] leading-[100%] text-[#000000]">
                            أخبار سوريا
                        </span>
                    </Link>

                    {/* User Buttons */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 md:order-2">
                        {userToken ? (
                            <>
                                <Link to={'/profile'}>
                                    <button
                                        type="button"
                                        className="text-[#000000C4] cursor-pointer bg-[#E9C882] py-2 px-3 font-bold rounded-lg text-sm sm:text-lg text-center my-Tajawal-text transition-all duration-300 hover:bg-[#d6b36f]"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="me-1" />
                                        مرحبا بك أحمد
                                    </button>
                                </Link>

                                <button
                                    onClick={logOut}
                                    type="button"
                                    className="text-[#000000C4] ms-2 cursor-pointer bg-[#F87171] py-2 px-3 font-bold rounded-lg text-sm sm:text-lg text-center my-Tajawal-text transition-all duration-300 hover:bg-red-500"
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} className="me-1" />
                                    تسجيل الخروج
                                </button>
                            </>
                        ) : (
                            <Link to={'/register'}>
                                <button
                                    type="button"
                                    className="text-[#000000C4] cursor-pointer bg-[#E9C882] py-2 px-3 font-bold rounded-lg text-sm sm:text-lg text-center my-Tajawal-text transition-all duration-300 hover:bg-[#d6b36f]"
                                >
                                    <FontAwesomeIcon icon={faRightToBracket} className="me-1" />
                                    تسجيل الدخول
                                </button>
                            </Link>
                        )}

                        {/* Hamburger Icon */}
                        <button
                            className="md:hidden text-2xl text-[#000000] ms-2 cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:w-auto md:order-1">
                        <ul className="flex flex-col md:flex-row md:space-x-8 rtl:space-x-reverse mt-4 md:mt-0 p-4 md:p-0 font-medium rounded-lg">
                            <li>
                                <Link
                                    to={'/contactus'}
                                    className={`block py-2 px-3 text-[18px] lg:text-[25px] leading-[100%] font-semibold md:p-0 my-Poppins-text transition-all duration-300 
                                        ${currentPath === '/contactus'
                                            ? 'text-[#2D4639] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                            : 'text-[#000000] hover:text-[#2D4639] hover:[text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                        }`}
                                >
                                    تواصل معنا
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={'/aboutus'}
                                    className={`block py-2 px-3 text-[18px] lg:text-[25px] leading-[100%] font-semibold md:p-0 my-Poppins-text transition-all duration-300 
                                        ${currentPath === '/aboutus'
                                            ? 'text-[#2D4639] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                            : 'text-[#000000] hover:text-[#2D4639] hover:[text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                        }`}
                                >
                                    من نحن
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={'/'}
                                    className={`block py-2 px-3 text-[18px] lg:text-[25px] leading-[100%] font-semibold md:p-0 my-Poppins-text transition-all duration-300 
                                        ${currentPath === '/'
                                            ? 'text-[#2D4639] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                            : 'text-[#000000] hover:text-[#2D4639] hover:[text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                        }`}
                                >
                                    الأخبار
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-4 flex flex-col items-center space-y-4 pb-4">
                        <Link
                            to={'/contactus'}
                            onClick={() => setMenuOpen(false)}
                            className={`block py-2 px-3 text-[18px] font-semibold my-Poppins-text transition-all duration-300 
                                ${currentPath === '/contactus'
                                    ? 'text-[#2D4639] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                    : 'text-[#000000] hover:text-[#2D4639] hover:[text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                }`}
                        >
                            تواصل معنا
                        </Link>
                        <Link
                            to={'/aboutus'}
                            onClick={() => setMenuOpen(false)}
                            className={`block py-2 px-3 text-[18px] font-semibold my-Poppins-text transition-all duration-300 
                                ${currentPath === '/aboutus'
                                    ? 'text-[#2D4639] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                    : 'text-[#000000] hover:text-[#2D4639] hover:[text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                }`}
                        >
                            من نحن
                        </Link>
                        <Link
                            to={'/'}
                            onClick={() => setMenuOpen(false)}
                            className={`block py-2 px-3 text-[18px] font-semibold my-Poppins-text transition-all duration-300 
                                ${currentPath === '/'
                                    ? 'text-[#2D4639] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                    : 'text-[#000000] hover:text-[#2D4639] hover:[text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                }`}
                        >
                            الأخبار
                        </Link>
                    </div>
                )}
            </nav>
        </>
    );
}
