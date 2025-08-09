import React from 'react'
import style from './Footer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faXTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import toast from 'react-hot-toast'
import { CheckCircleIcon } from '@heroicons/react/24/outline' // heroicons for green check

export default function Footer() {

    const handleSubscribe = (e) => {
        e.preventDefault();

        toast.custom(
            (t) => (
                <div
                    className={`flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 ${t.visible ? 'animate-enter' : 'animate-leave'
                        }`}
                    dir="rtl"
                >
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium text-gray-800">
                        تم الاشتراك تابع بريدك يوميا
                    </span>
                </div>
            ),
            { duration: 2000 } // auto-close after 2 seconds
        );
    };

    return (
        <footer className='bg-[#1B1D1E] min-h-[38vh] px-7 py-22'>
            <section
                className='flex lg:flex-row flex-col lg:relative items-center lg:items-baseline justify-center lg:gap-40 gap-8 text-center lg:text-right'
            >
                {/* Newsletter */}
                <div className='bg-[#E9EFF0] h-[160px] p-3 flex flex-col justify-center'>
                    <h1 className='text-right text-[#000000] leading-[100%] font-semibold text-[27px] my-Poppins-text'>
                        اشترك الآن بالنشرة الإخبارية
                    </h1>
                    <p className='text-[#000000] text-sm my-Tajawal-text text-right mt-3'>
                        نشرة إخبارية ترسل مباشرة لبريدك الإلكتروني يوميا
                    </p>
                    <form
                        className='flex flex-col items-end lg:items-start'
                        onSubmit={handleSubscribe}
                    >
                        <input
                            type="email"
                            id="email"
                            className="mb-2 bg-[#FFFFFF] mt-2 focus:border-[#8A8A8A] text-gray-900 text-[12px] rounded-sm w-[321px] h-[27px] p-2.5 cursor-pointer text-right"
                            placeholder=" أدخل بريدك الإليكتروني"
                            required
                        />
                        <button
                            type='submit'
                            className='w-[321px] h-[27px] py-4 flex items-center justify-center bg-[#00844B] text-[#FFFFFF] leading-[100%] text-[15px] my-Poppins-text rounded-sm mt-0'
                        >
                            إاشتراك
                        </button>
                    </form>
                </div>

                {/* Divider */}
                <div className='bg-[#FFFFFF] h-[160px] w-[0.5px] absolute lg:block hidden end-250'></div>

                {/* Social Media */}
                <div className='flex flex-col items-center lg:items-end ms-0 lg:ms-21'>
                    <h1 className='text-[#FFFFFF] text-[28px] font-bold my-Tajawal-text'>
                        تابعنا
                    </h1>
                    <div className="flex gap-4 mt-4">
                        <FontAwesomeIcon icon={faFacebookF} className="text-white text-2xl cursor-pointer hover:text-[#3b5998]" />
                        <FontAwesomeIcon icon={faXTwitter} className="text-white text-2xl cursor-pointer hover:text-[#1da1f2]" />
                        <FontAwesomeIcon icon={faInstagram} className="text-white text-2xl cursor-pointer hover:text-[#e1306c]" />
                    </div>
                </div>

                {/* Links */}
                <div className='text-center lg:text-right'>
                    <ul>
                        <li className='text-[#FFFFFF] text-[28px] font-bold my-Tajawal-text mb-3'>
                            روابط مهمه
                        </li>
                        <li className='text-[#FFFFFF] text-[14px] my-Tajawal-text mb-3'>
                            سياسة الخصوصية
                        </li>
                        <li className='text-[#FFFFFF] text-[14px] my-Tajawal-text mb-3'>
                            شروط الاستخدام
                        </li>
                        <li className='text-[#FFFFFF] text-[14px] my-Tajawal-text'>
                            اتصل بنا
                        </li>
                    </ul>
                </div>

                {/* About */}
                <div className='flex flex-col items-center lg:items-end'>
                    <h1 className='text-[#FFFFFF] text-[28px] font-bold my-Tajawal-text mb-3'>
                        أخبار سوريا
                    </h1>
                    <p className='text-[#FFFFFF] text-[14px] my-Tajawal-text text-center lg:text-right'>
                        منصة إخبارية موثوقة تقدم أحدث الأخبار
                    </p>
                    <p className='text-[#FFFFFF] text-[14px] my-Tajawal-text text-center lg:text-right'>
                        والتحليلات
                    </p>
                </div>
            </section>
        </footer>
    )
}
