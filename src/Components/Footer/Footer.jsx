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
            { duration: 2000 }
        );
    };

    return (
        <footer className='bg-[#1B1D1E] px-7 py-15'>
            <section
                className='flex lg:flex-row flex-col lg:relative items-center lg:items-baseline justify-center lg:gap-40 gap-15 text-center lg:text-right'
            >
                {/* Newsletter */}
                <div className='bg-[#E9EFF0] rounded-2xl p-6 flex flex-col justify-center shadow-sm'>
                    <h1 className='text-right text-black leading-tight font-semibold text-2xl my-Poppins-text'>
                        اشترك الآن بالنشرة الإخبارية
                    </h1>
                    <p className='text-black text-sm my-Tajawal-text text-right mt-2 opacity-80'>
                        نشرة إخبارية ترسل مباشرة لبريدك الإلكتروني يوميا
                    </p>
                    <form
                        className='flex flex-col items-end mt-4 gap-3'
                        onSubmit={handleSubscribe}
                    >
                        <input
                            type="email"
                            id="email"
                            className="bg-white border border-gray-200 focus:border-gray-400 text-gray-900 text-sm rounded-md w-[321px] p-2.5 text-right shadow-sm outline-none transition"
                            placeholder="أدخل بريدك الإلكتروني"
                            required
                        />
                        <button
                            type='submit'
                            className='w-[321px] h-[40px] flex items-center justify-center bg-[#00844B] hover:bg-[#006c3d] text-white font-medium text-sm my-Poppins-text rounded-md transition-colors duration-200'
                        >
                            اشتراك
                        </button>
                    </form>
                </div>

                {/* Divider */}
                <div className='bg-white/20 h-[215px] w-px absolute lg:block hidden end-250'></div>

                {/* Social Media */}
                <div className='flex flex-col items-center lg:items-end ms-0 lg:ms-21'>
                    <h1 className='text-white text-2xl font-bold my-Tajawal-text'>
                        تابعنا
                    </h1>
                    <div className="flex gap-4 mt-4">
                        <FontAwesomeIcon icon={faFacebookF} className="text-white text-xl cursor-pointer hover:text-[#3b5998] transition-colors duration-200" />
                        <FontAwesomeIcon icon={faXTwitter} className="text-white text-xl cursor-pointer hover:text-[#1da1f2] transition-colors duration-200" />
                        <FontAwesomeIcon icon={faInstagram} className="text-white text-xl cursor-pointer hover:text-[#e1306c] transition-colors duration-200" />
                    </div>
                </div>

                {/* Links */}
                <div className='text-center lg:text-right'>
                    <ul>
                        <li className='text-white text-2xl font-bold my-Tajawal-text mb-3'>
                            روابط مهمه
                        </li>
                        <li className='text-white text-sm my-Tajawal-text mb-2 hover:opacity-80 transition cursor-pointer'>
                            سياسة الخصوصية
                        </li>
                        <li className='text-white text-sm my-Tajawal-text mb-2 hover:opacity-80 transition cursor-pointer'>
                            شروط الاستخدام
                        </li>
                        <li className='text-white text-sm my-Tajawal-text hover:opacity-80 transition cursor-pointer'>
                            اتصل بنا
                        </li>
                    </ul>
                </div>

                {/* About */}
                <div className='flex flex-col items-center lg:items-end'>
                    <h1 className='text-white text-2xl font-bold my-Tajawal-text mb-3'>
                        أخبار سوريا
                    </h1>
                    <p className='text-white text-sm my-Tajawal-text text-center lg:text-right opacity-80 leading-relaxed'>
                        منصة إخبارية موثوقة تقدم أحدث الأخبار
                    </p>
                    <p className='text-white text-sm my-Tajawal-text text-center lg:text-right opacity-80 leading-relaxed'>
                        والتحليلات
                    </p>
                </div>
            </section>
        </footer>
    )
}
