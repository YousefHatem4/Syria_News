import React, { useState } from 'react'
import style from './NewPass.module.css'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// Added imports for toast
import toast, { Toaster } from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa';

export default function NewPass() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        toast.custom(
            (t) => (
                <div
                    className={`flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 ${t.visible ? 'animate-enter' : 'animate-leave'
                        }`}
                    dir="rtl"
                >
                    <FaCheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium text-gray-800">
                        تم حفظ كلمه مرورك الجديده
                    </span>
                </div>
            ),
            { duration: 2000 }
        );


        // Navigate after short delay
        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return <>
        {/* Toast container */}
        <Toaster />

        <div className='[background:linear-gradient(to_bottom_right,_#004025_0%,_#FFFFFFCC_80%,_transparent_100%)] min-h-[110vh] flex items-center justify-center p-4'>
            <section className='w-full max-w-[633px] h-auto md:h-[646px] -mt-20 md:mt-20 '>
                <div className='w-full h-[200px] md:h-[318px] bg-[linear-gradient(to_bottom,_#2D4639,_#6FAC8C)] rounded-t-2xl flex justify-center items-center flex-col p-4'>
                    <h1 className='text-[24px] md:text-[28px] text-[#FFFFFF] my-Tajawal-text leading-[100%] mb-4 md:mb-6 font-semibold text-center'>
                        تعيين كلمة مرور جديدة
                    </h1>
                    <p className='text-[#F2F2F2] font-medium text-[16px] md:text-xl text-center'>
                        اختر كلمة مرور قوية لحماية حسابك
                    </p>
                </div>
                <div className='w-full h-auto md:h-[318px] bg-[#FFFFFF] rounded-b-2xl flex justify-center flex-col items-center text-center  p-4 '>
                    <form onSubmit={handleSubmit} className='w-full flex items-center flex-col'>
                        {/* Password Field */}
                        <div className="relative w-[90%] sm:w-[350px] md:w-[425px] mb-5 md:mb-7">
                            <label htmlFor="password" className="block mb-3 md:mb-4 text-[16px] md:text-[20px] leading-[100%] font-medium text-[#000000] text-end my-Poppins-tex">
                                كلمة المرور الجديد
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
                        <button
                            type="submit"
                            className='w-full  max-w-[321px] cursor-pointer h-[40px] md:h-[27px] bg-[#00844B] text-white text-[12px] rounded-sm hover:bg-[#006C3C] transition duration-300 mb-4'
                        >
                            حفظ كلمه المرور
                        </button>
                    </form>
                </div>
            </section>
        </div>
    </>
}
