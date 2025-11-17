import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { userContext } from '../Context/userContext';
import { BASE_URL } from '../../App'

/**
 * Login Component
 * Handles user authentication with email and password
 * Features form validation, password visibility toggle, and user context management
 * Redirects users to home page upon successful login
 */
export default function Login() {
    // State management for component behavior
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const [isSubmitting, setIsSubmitting] = useState(false); // Form submission state
    const [loginError, setLoginError] = useState(null); // Error message state
    const [loginSuccess, setLoginSuccess] = useState(false); // Success state

    // Context and navigation hooks
    let { setUserToken, setUserId } = useContext(userContext); // User context for global state management
    let navigate = useNavigate(); // Navigation hook for page routing

    /**
     * Toggles password visibility in the password input field
     */
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    /**
     * Form validation schema using Yup
     * Defines validation rules for email and password fields
     */
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('البريد الإلكتروني غير صحيح') // Email format validation
            .required('البريد الإلكتروني مطلوب'), // Required field validation
        password: Yup.string()
            .required('كلمة المرور مطلوبة') // Required field validation
    });

    /**
     * Handles login form submission
     * Sends credentials to backend API and manages authentication flow
     * @param {Object} values - Form values containing email and password
     * @param {Object} formikHelpers - Formik helper functions
     */
    async function login(values, { setSubmitting }) {
        setIsSubmitting(true); // Set loading state
        setLoginError(null); // Clear previous errors

        try {
            // API call to authenticate user
            let { data } = await axios.post(
                `${BASE_URL}auth/login`, // Authentication endpoint
                values // Email and password payload
            );

            setLoginSuccess(true); // Set success state

            // Store all user data in context and localStorage

            // Set authentication token in context
            setUserToken(data.token);

            // Check if setUserId exists before calling it for safety
            if (setUserId && typeof setUserId === 'function') {
                setUserId(data.userId);
            } else {
                console.warn('setUserId is not available in context');
            }

            // Persist user data in localStorage for session management
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userEmail', data.email);

            // Store user roles from login response for authorization
            if (data.roles && data.roles.length > 0) {
                const userRole = data.roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';
                localStorage.setItem('userRole', userRole);
            }

            // Navigate to home page immediately upon successful login
            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            // Display appropriate error message to user
            setLoginError(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        } finally {
            // Reset loading states regardless of success or failure
            setIsSubmitting(false);
            setSubmitting(false);
        }
    }

    /**
     * Formik configuration for form state management
     * Handles form values, validation, and submission
     */
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema, // Yup validation schema
        onSubmit: login // Submission handler
    });

    return (
        // Main container with gradient background
        <div className='[background:linear-gradient(to_bottom_right,_#004025_0%,_#FFFFFFCC_80%,_transparent_100%)] min-h-[150vh] flex justify-center items-center py-10 md:py-0'>

            {/* Login card container with responsive layout */}
            <section className='w-11/12 sm:w-10/12 md:w-9/12 flex flex-col lg:flex-row justify-center mt-5 md:-mt-15'>

                {/* Left Side - Brand Introduction */}
                <div className='w-full lg:w-5/12 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[800px] bg-[linear-gradient(to_bottom,_#2D4639,_#6FAC8C)] rounded-t-2xl lg:rounded-bl-2xl lg:rounded-tr-none flex flex-col justify-center items-center text-white px-6 sm:px-8 py-10 text-center'>
                    <h2 className='text-[20px] sm:text-[24px] md:text-[28px] font-bold my-Tajawal-text mb-4 sm:mb-6 leading-[100%]'>
                        مرحبا بك في موقع
                    </h2>
                    <p className='text-[28px] sm:text-[36px] md:text-[48px] my-ruwudu-text font-semibold leading-[100%]'>
                        أخبار سوريا
                    </p>
                </div>

                {/* Right Side - Login Form */}
                <div className='w-full lg:w-6/12 min-h-[500px] md:min-h-[800px] bg-white py-8 px-4 sm:px-8 rounded-b-2xl lg:rounded-bl-none lg:rounded-tr-2xl'>
                    <div className='flex flex-col items-center mt-4 md:mt-[170px]'>

                        {/* Form Header */}
                        <h1 className='text-[22px] sm:text-[24px] md:text-[28px] font-bold my-Tajawal-text leading-[100%]'>
                            تسجيل الدخول
                        </h1>
                        <p className='text-[11px] sm:text-[13px] md:text-[14px] text-[#8A8A8A] my-Tajawal-text mt-2 sm:mt-3'>
                            املأ البيانات التالية للدخول
                        </p>

                        {/* Success Message Display */}
                        {loginSuccess && (
                            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                                تم تسجيل الدخول بنجاح!
                            </div>
                        )}

                        {/* Error Message Display */}
                        {loginError && (
                            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                                {loginError}
                            </div>
                        )}

                        {/* Login Form */}
                        <form
                            className='mt-6 sm:mt-8 md:mt-10 w-full flex flex-col items-center'
                            onSubmit={formik.handleSubmit}
                        >

                            {/* Email Input Field */}
                            <div className='relative w-full sm:w-[350px] md:w-[425px] mb-4 sm:mb-6'>
                                <label htmlFor="login-email" className='block mb-2 sm:mb-3 text-[15px] sm:text-[16px] md:text-[20px] text-[#000000] text-end my-Poppins-text'>
                                    البريد الإلكتروني
                                </label>
                                {/* Email icon */}
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className='absolute right-3 top-[52px] sm:top-[55px] md:top-16 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                                />
                                <input
                                    type="email"
                                    id="login-email"
                                    name="email"
                                    autoComplete="username" // Browser autocomplete hint
                                    placeholder="إدخل بريدك الإلكتروني"
                                    dir="rtl" // Right-to-Left text direction
                                    className='bg-gray-50 border border-gray-300 focus:outline-none focus:border-[#00844B] text-[#000000] text-sm rounded-lg block w-full h-[40px] pr-10 pl-2.5 shadow-[inset_0px_2px_3.6px_#00000020]'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                {/* Email validation error message */}
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-xs text-right mt-1">{formik.errors.email}</div>
                                ) : null}
                            </div>

                            {/* Password Input Field */}
                            <div className='relative w-full sm:w-[350px] md:w-[425px] mb-2'>
                                <label htmlFor="password" className='block mb-2 sm:mb-3 text-[15px] sm:text-[16px] md:text-[20px] text-[#000000] text-end my-Poppins-text'>
                                    كلمة المرور
                                </label>
                                {/* Lock icon */}
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className='absolute right-3 top-[52px] sm:top-[50px] md:top-16 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'} // Dynamic input type for password visibility
                                    id="password"
                                    name="password"
                                    autoComplete="current-password" // Browser autocomplete hint
                                    placeholder="ادخل كلمة المرور"
                                    dir="rtl" // Right-to-Left text direction
                                    className='bg-gray-50 border border-gray-300 focus:outline-none focus:border-[#00844B] text-[#000000] text-sm rounded-lg block w-full h-[40px] pr-10 pl-10 shadow-[inset_0px_2px_3.6px_#00000020]'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                                {/* Password visibility toggle icon */}
                                <FontAwesomeIcon
                                    icon={showPassword ? faEye : faEyeSlash}
                                    onClick={togglePasswordVisibility}
                                    className='absolute left-3 top-[52px] sm:top-[50px] md:top-16 transform -translate-y-1/2 text-gray-400 cursor-pointer'
                                />
                                {/* Password validation error message */}
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-xs text-right mt-1">{formik.errors.password}</div>
                                ) : null}
                            </div>

                            {/* Forgot Password Link */}
                            <p className='text-right text-[#8A8A8A] text-[10px] sm:text-[12px] w-full sm:w-[350px] md:w-[425px] mb-4'>
                                <Link to={'/forgetpass'}>هل نسيت كلمة السر ؟</Link>
                            </p>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting} // Disable during submission
                                className='w-full sm:w-[350px] md:w-[425px] h-[40px] bg-[#00844B] text-white text-[12px] rounded-sm hover:bg-[#006C3C] transition duration-300 mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                                {/* User icon for visual enhancement */}
                                {!isSubmitting && <FontAwesomeIcon icon={faUserPlus} className="text-white text-[12px] ms-2" />}
                            </button>
                        </form>

                        {/* Registration Link */}
                        <div className='text-[12px] sm:text-[13px] md:text-[14px] my-Tajawal-text mt-3 sm:mt-4 leading-[100%]'>
                            ليس لديك حساب بالفعل؟ <Link to="/register" className="text-[#00844B]">عمل حساب</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}