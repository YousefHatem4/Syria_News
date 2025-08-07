import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("تم إنشاء الحساب بنجاح");
    };

    return (
        <div className='[background:linear-gradient(to_bottom_right,_#004025_0%,_#FFFFFFCC_80%,_transparent_100%)] min-h-[150vh] flex justify-center items-center py-10 md:py-0'>
            <section className='w-11/12 sm:w-10/12 md:w-9/12 flex flex-col lg:flex-row justify-center mt-5 md:-mt-15'>

                {/* Left Side */}
                <div className='w-full lg:w-5/12 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[800px] bg-[linear-gradient(to_bottom,_#2D4639,_#6FAC8C)] rounded-t-2xl lg:rounded-bl-2xl lg:rounded-tr-none flex flex-col justify-center items-center text-white px-6 sm:px-8 py-10 text-center'>
                    <h2 className='text-[20px] sm:text-[24px] md:text-[28px] font-bold my-Tajawal-text mb-4 sm:mb-6 leading-[100%]'>
                        مرحبا بك في موقع
                    </h2>
                    <p className='text-[28px] sm:text-[36px] md:text-[48px] my-ruwudu-text font-semibold leading-[100%]'>
                        أخبار سوريا
                    </p>
                </div>

                {/* Right Side - Form */}
                <div className='w-full lg:w-6/12 min-h-[500px] md:min-h-[800px] bg-white py-8 px-4 sm:px-8 rounded-b-2xl lg:rounded-bl-none lg:rounded-tr-2xl'>
                    <div className='flex flex-col items-center mt-4 md:mt-[170px]'>
                        <h1 className='text-[22px] sm:text-[24px] md:text-[28px] font-bold my-Tajawal-text leading-[100%]'>
                            تسجيل الدخول
                        </h1>
                        <p className='text-[11px] sm:text-[13px] md:text-[14px] text-[#8A8A8A] my-Tajawal-text mt-2 sm:mt-3'>
                            املأ البيانات التالية للدخول
                        </p>

                        <form className='mt-6 sm:mt-8 md:mt-10 w-full flex flex-col items-center' onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div className='relative w-full sm:w-[350px] md:w-[425px] mb-4 sm:mb-6'>
                                <label htmlFor="email" className='block mb-2 sm:mb-3 text-[15px] sm:text-[16px] md:text-[20px] text-[#000000] text-end my-Poppins-text'>
                                    البريد الإلكتروني
                                </label>
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className='absolute right-3 top-[42px] sm:top-[50px] md:top-14 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                                />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="إدخل بريدك الإلكتروني"
                                    required
                                    dir="rtl"
                                    className='bg-gray-50 border border-gray-300 focus:outline-none focus:border-[#00844B] text-[#000000] text-sm rounded-lg block w-full h-[40px] pr-10 pl-2.5 shadow-[inset_0px_2px_3.6px_#00000020]'
                                />
                            </div>

                            {/* Password Field */}
                            <div className='relative w-full sm:w-[350px] md:w-[425px] mb-2'>
                                <label htmlFor="password" className='block mb-2 sm:mb-3 text-[15px] sm:text-[16px] md:text-[20px] text-[#000000] text-end my-Poppins-text'>
                                    كلمة المرور
                                </label>
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className='absolute right-3 top-[42px] sm:top-[50px] md:top-14 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="ادخل كلمة المرور"
                                    required
                                    dir="rtl"
                                    className='bg-gray-50 border border-gray-300 focus:outline-none focus:border-[#00844B] text-[#000000] text-sm rounded-lg block w-full h-[40px] pr-10 pl-10 shadow-[inset_0px_2px_3.6px_#00000020]'
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEye : faEyeSlash}
                                    onClick={togglePasswordVisibility}
                                    className='absolute left-3 top-[42px] sm:top-[50px] md:top-14 transform -translate-y-1/2 text-gray-400 cursor-pointer'
                                />
                            </div>

                            {/* Forgot Password */}
                            <p className='text-right text-[#8A8A8A] text-[10px] sm:text-[12px] w-full sm:w-[350px] md:w-[425px] mb-4'>
                                <Link to={'/forgetpass'}>هل نسيت كلمة السر ؟</Link>
                            </p>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className='w-full sm:w-[350px] md:w-[425px] h-[40px] bg-[#00844B] text-white text-[12px] rounded-sm hover:bg-[#006C3C] transition duration-300 mb-4'
                            >
                                تسجيل الدخول <FontAwesomeIcon icon={faUserPlus} className="text-white text-[12px] ms-2" />
                            </button>
                        </form>

                        {/* Bottom Text */}
                        <div className='text-[12px] sm:text-[13px] md:text-[14px] my-Tajawal-text mt-3 sm:mt-4 leading-[100%]'>
                            ليس لديك حساب بالفعل؟ <Link to="/register" className="text-[#00844B]">عمل حساب</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
