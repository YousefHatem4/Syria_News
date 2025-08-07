import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './ForgetPass.module.css';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ForgetPass() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/verfiycode');
    };

    return (
        <>
            <div className='[background:linear-gradient(to_bottom_right,_#004025_0%,_#FFFFFFCC_80%,_transparent_100%)] min-h-[110vh] flex items-center justify-center p-4'>
                <section className='w-full max-w-[633px] h-auto md:h-[646px] -mt-20 md:mt-20 '>
                    <div className='w-full h-[200px] md:h-[318px] bg-[linear-gradient(to_bottom,_#2D4639,_#6FAC8C)] rounded-t-2xl flex justify-center items-center flex-col p-4'>
                        <h1 className='text-[24px] md:text-[28px] text-[#FFFFFF] my-Tajawal-text leading-[100%] mb-4 md:mb-6 font-semibold text-center'>
                            نسيت كلمة المرور؟
                        </h1>
                        <p className='text-[#F2F2F2] font-medium text-[16px] md:text-xl text-center'>
                            أدخل بريدك الإلكتروني لاستعادة حسابك
                        </p>
                    </div>
                    <div className='w-full h-auto md:h-[318px] bg-[#FFFFFF] rounded-b-2xl flex justify-center flex-col items-center text-center pb-10 md:pb-20 p-4'>
                        <form onSubmit={handleSubmit} className='w-full'>
                            <div className='relative w-full max-w-[425px] mb-6 md:ms-21'>
                                <label htmlFor="email" className='block mb-2 text-[16px] md:text-[20px] font-medium text-[#000000] text-end my-Poppins-text'>
                                    أدخل بريدك الإلكتروني
                                </label>
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className='absolute right-3 top-[55px] md:top-[60px] transform -translate-y-1/2 text-[#8A8A8A] pointer-events-none'
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
                            <button
                                type="submit"
                                className='w-full  max-w-[321px] cursor-pointer h-[40px] md:h-[27px] bg-[#00844B] text-white text-[12px] rounded-sm hover:bg-[#006C3C] transition duration-300 mb-4'
                            >
                                إرسال
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}