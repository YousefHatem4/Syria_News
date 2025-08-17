import React, { useState } from 'react';
import style from './Register.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleTermsChange = (e) => {
        setAgreeTerms(e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreeTerms) {
            alert("يجب الموافقة على الشروط والأحكام أولاً.");
            return;
        }
        // Handle form submission logic here
        alert("تم إنشاء الحساب بنجاح");
    };

    async function register(data) {

    }

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        }, onSubmit: register
    })

    return (
        <>
            <div className='[background:linear-gradient(to_bottom_right,_#004025_0%,_#FFFFFFCC_80%,_transparent_100%)] min-h-[150vh] flex justify-center items-center py-15 md:py-0'>
                <section className='w-11/12 sm:w-10/12 md:w-9/12 min-h-[600px] md:min-h-[851px] flex flex-col lg:flex-row justify-center mt-10 md:mt-0'>
                    {/* Left Side - Form */}
                    <div className='min-h-[500px] md:min-h-[850px] bg-[#FFFFFF] py-10 md:py-0 w-full lg:w-6/12 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none'>
                        <div className='flex mt-[30px] md:mt-[46px] flex-col items-center'>
                            <h1 className='my-Tajawal-text font-bold leading-[100%] text-[24px] md:text-[28px]'>إنشاء حساب جديد</h1>
                            <p className='text-[12px] md:text-[14px] text-[#8A8A8A] leading-[100%] mt-3 md:mt-4 my-Tajawal-text'>املأ البيانات التالية للتسجيل</p>

                            <form className='mt-8 md:mt-15' onSubmit={handleSubmit}>
                                {/* Full Name Field */}
                                <div className="relative w-[90%] sm:w-[350px] md:w-[425px] mb-5 md:mb-7">
                                    <label htmlFor="fullname" className="block mb-3 md:mb-4 text-[16px] md:text-[20px] leading-[100%] font-medium text-[#000000] text-end my-Poppins-tex">
                                        الإسم كامل
                                    </label>
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="absolute right-3 top-[52px] md:top-14 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                    <input
                                        type="text"
                                        id="fullname"
                                        className="bg-gray-50 border focus:outline-none focus:border-[#00844B] border-gray-300 text-[#000000] text-sm my-Tajawal-text rounded-lg block w-full h-[40px] pr-10 pl-2.5 shadow-[inset_0px_2px_3.6px_#00000020]"
                                        placeholder="إدخل اسمك الكامل"
                                        required
                                        dir="rtl"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="relative w-[90%] sm:w-[350px] md:w-[425px] mb-5 md:mb-7">
                                    <label htmlFor="email" className="block mb-3 md:mb-4 text-[16px] md:text-[20px] leading-[100%] font-medium text-[#000000] text-end my-Poppins-tex">
                                        البريد الإلكتروني
                                    </label>
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="absolute right-3 top-[52px] md:top-14 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                    <input
                                        type="email"
                                        id="email"
                                        className="bg-gray-50 border focus:outline-none focus:border-[#00844B] border-gray-300 text-[#000000] text-sm my-Tajawal-text rounded-lg block w-full h-[40px] pr-10 pl-2.5 shadow-[inset_0px_2px_3.6px_#00000020]"
                                        placeholder="إدخل بريدك الإلكتروني"
                                        required
                                        dir="rtl"
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="relative w-[90%] sm:w-[350px] md:w-[425px] mb-5 md:mb-7">
                                    <label htmlFor="password" className="block mb-3 md:mb-4 text-[16px] md:text-[20px] leading-[100%] font-medium text-[#000000] text-end my-Poppins-tex">
                                        كلمة المرور
                                    </label>
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="absolute right-3 top-[52px] md:top-14 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="bg-gray-50 border focus:outline-none focus:border-[#00844B] border-gray-300 text-[#000000] text-sm my-Tajawal-text rounded-lg block w-full h-[40px] pr-10 pl-10 shadow-[inset_0px_2px_3.6px_#00000020]"
                                        placeholder="ادخل كلمة المرور"
                                        required
                                        dir="rtl"
                                    />
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEye : faEyeSlash}
                                        onClick={togglePasswordVisibility}
                                        className="absolute left-3 top-[52px] md:top-14 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                    />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="relative w-[90%] sm:w-[350px] md:w-[425px] mb-5 md:mb-7">
                                    <label htmlFor="confirmPassword" className="block mb-3 md:mb-4 text-[16px] md:text-[20px] leading-[100%] font-medium text-[#000000] text-end my-Poppins-tex">
                                        تأكيد كلمة المرور
                                    </label>
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="absolute right-3 top-[52px] md:top-14 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        className="bg-gray-50 border focus:outline-none focus:border-[#00844B] border-gray-300 text-[#000000] text-sm my-Tajawal-text rounded-lg block w-full h-[40px] pr-10 pl-10 shadow-[inset_0px_2px_3.6px_#00000020]"
                                        placeholder="اعد إدخل كلمة المرور"
                                        required
                                        dir="rtl"
                                    />
                                    <FontAwesomeIcon
                                        icon={showConfirmPassword ? faEye : faEyeSlash}
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute left-3 top-[52px] md:top-14 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                    />
                                </div>

                                {/* Terms & Conditions */}
                                <div className="w-[90%] sm:w-[350px] md:w-[425px] mb-5 md:mb-6 flex items-center justify-end">
                                    <label className="ml-3 text-[10px] md:text-[12px] text-[#00844B] leading-[100%] font-bold my-Poppins-text cursor-pointer flex items-center">
                                        الشروط و الاحكام  <span className='text-[#8A8A8A] font-normal ms-1'>أوافق علي</span>
                                        <input
                                            type="checkbox"
                                            checked={agreeTerms}
                                            onChange={handleTermsChange}
                                            className="ml-2 w-[18px] h-[18px] md:w-[24px] md:h-[24px] accent-[#00844B]"
                                        />
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="cursor-pointer w-[90%] sm:w-[350px] md:w-[425px] h-[40px] bg-[#00844B] text-white text-[12px] my-Poppins-text rounded-sm hover:bg-[#006C3C] transition duration-300 mb-4 md:mb-0"
                                >
                                    إنشاء الحساب <FontAwesomeIcon icon={faUserPlus} className="text-white text-[12px] ms-2" />
                                </button>
                            </form>
                            <div className='text-[12px] md:text-[14px] my-Tajawal-text leading-[100%] mt-4 md:mt-5'>لديك حساب بالفعل؟ <Link to={'/login'} className='text-[#00844B]'>تسجيل الدخول</Link></div>
                        </div>
                    </div>

                    {/* Right Side Design */}
                    <div className='w-full lg:w-5/12 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[850px] bg-[linear-gradient(to_bottom,_#2D4639,_#6FAC8C)] rounded-b-2xl lg:rounded-e-2xl lg:rounded-bl-none flex flex-col justify-center items-center text-white px-8 text-center mt-0 lg:mt-0'>
                        <h2 className='text-[20px] md:text-[28px] font-bold my-Tajawal-text leading-[100%] mb-6 md:mb-10'>مرحبا بك في موقع</h2>
                        <p className='text-[32px] md:text-[48px] my-ruwudu-text leading-[100%] font-semibold'>
                            أخبار سوريا
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}