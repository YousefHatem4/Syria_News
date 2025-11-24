import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket, faRightToBracket, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { userContext } from '../Context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../App';

/**
 * Navbar Component
 * Main navigation component with responsive design, user authentication state,
 * and dynamic user data fetching. Supports both desktop and mobile views.
 */
export default function Navbar() {
    // Router hooks for navigation and location tracking
    const location = useLocation();
    const currentPath = location.pathname; // Current route path for active link styling
    let { userToken, setUserToken } = useContext(userContext); // User authentication context
    let navigate = useNavigate(); // Programmatic navigation

    // Component state management
    const [menuOpen, setMenuOpen] = useState(false); // Mobile menu toggle state
    const [userName, setUserName] = useState('أحمد'); // User display name with default value

    /**
     * Retrieves user ID from localStorage
     * @returns {string|null} User ID or null if not found
     */
    const getUserId = () => {
        return localStorage.getItem('userId');
    };

    /**
     * Fetches user data from API when component mounts or userToken changes
     * Updates the user name in state for display in the navbar
     */
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = getUserId();
                // Only fetch if both user ID and token are available
                if (!userId || !userToken) return;

                // API call to get user details with authentication headers
                const response = await axios.get(`${BASE_URL}users`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    },
                    // Handle redirects gracefully
                    maxRedirects: 0,
                    validateStatus: function (status) {
                        return status >= 200 && status < 303; // Accept redirect status codes
                    }
                });

                // Update user name if available in response
                if (response.data.userName) {
                    setUserName(response.data.userName);
                }
            } catch (error) {
                console.error('Error fetching user data in Navbar:', error);
                // Fallback: try to extract data from error response (handles redirects)
                if (error.response && error.response.data) {
                    console.log('Redirect response data:', error.response.data);
                    if (error.response.data.userName) {
                        setUserName(error.response.data.userName);
                    }
                }
            }
        };

        // Only fetch user data if user is authenticated
        if (userToken) {
            fetchUserData();
        }
    }, [userToken]); // Re-run effect when userToken changes

    /**
     * Handles user logout functionality
     * Clears localStorage, resets context, and redirects to home page
     */
    function logOut() {
        // Clear all user-related data from localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');

        // Reset user context to null (unauthenticated state)
        setUserToken(null);

        // Navigate to home page after logout
        navigate('/');
    }

    return (
        <>
            {/* Main Navigation Bar */}
            <nav className="bg-[#FFFFFFCC] absolute z-20 top-6 left-1/2 -translate-x-1/2 shadow-md rounded-xl w-[95%] max-w-[1386px] h-auto md:h-[75px] px-4 sm:px-6 md:px-[11px] py-4 md:py-[7px]">
                <div className="flex flex-wrap items-center justify-between w-full md:py-2">

                    {/* Logo/Brand Section */}
                    <Link to={'/'} className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="my-ruwudu-text font-semibold text-[24px] mt-2 sm:text-[28px] leading-[100%] text-[#000000]">
                            New Syrian
                        </span>
                    </Link>

                    {/* User Authentication Buttons Section */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 md:order-2">

                        {/* Conditional rendering based on authentication state */}
                        {userToken ? (
                            <>
                                {/* User Profile Button - Shows when user is logged in */}
                                <Link to={'/profile'}>
                                    <button
                                        type="button"
                                        className="text-[#000000C4] cursor-pointer bg-[#E9C882] py-2 px-3 font-bold rounded-lg text-sm sm:text-lg text-center my-Tajawal-text transition-all duration-300 hover:bg-[#d6b36f]"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="me-1" />
                                        {userName} مرحبا بك
                                    </button>
                                </Link>

                                {/* Logout Button */}
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
                            /* Login Button - Shows when user is not logged in */
                            <Link to={'/login'}>
                                <button
                                    type="button"
                                    className="text-[#000000C4] cursor-pointer bg-[#E9C882] py-2 px-3 font-bold rounded-lg text-sm sm:text-lg text-center my-Tajawal-text transition-all duration-300 hover:bg-[#d6b36f]"
                                >
                                    <FontAwesomeIcon icon={faRightToBracket} className="me-1" />
                                    تسجيل الدخول
                                </button>
                            </Link>
                        )}

                        {/* Mobile Hamburger Menu Toggle */}
                        <button
                            className="md:hidden text-2xl text-[#000000] ms-2 cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle navigation menu"
                        >
                            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
                        </button>
                    </div>

                    {/* Desktop Navigation Menu - Hidden on mobile */}
                    <div className="hidden md:flex md:w-auto md:order-1 lg:mt-2">
                        <ul className="flex flex-col md:flex-row md:space-x-8 rtl:space-x-reverse mt-4 md:mt-0 p-4 md:p-0 font-medium rounded-lg">

                            {/* Contact Us Link */}
                            <li>
                                <Link
                                    to={'/contactus'}
                                    className={`block py-2 px-3 text-[18px] lg:text-[25px] leading-[100%] font-semibold md:p-0 my-Poppins-text transition-all duration-300 
                                        ${currentPath === '/contactus'
                                            ? 'text-[#2D4639] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]' // Active state styling
                                            : 'text-[#000000] hover:text-[#2D4639] hover:[text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]' // Hover state styling
                                        }`}
                                >
                                    تواصل معنا
                                </Link>
                            </li>

                            {/* About Us Link */}
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

                            {/* News/Home Link */}
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

                {/* Mobile Navigation Menu - Only visible when menuOpen is true */}
                {menuOpen && (
                    <div className="md:hidden mt-4 flex flex-col items-center space-y-4 pb-4">

                        {/* Mobile Contact Us Link */}
                        <Link
                            to={'/contactus'}
                            onClick={() => setMenuOpen(false)} // Close menu on link click
                            className={`block py-2 px-3 text-[18px] font-semibold my-Poppins-text transition-all duration-300 
                                ${currentPath === '/contactus'
                                    ? 'text-[#2D4639] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                    : 'text-[#000000] hover:text-[#2D4639] hover:[text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]'
                                }`}
                        >
                            تواصل معنا
                        </Link>

                        {/* Mobile About Us Link */}
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

                        {/* Mobile News/Home Link */}
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
