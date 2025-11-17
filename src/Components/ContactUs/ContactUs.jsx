import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'

/**
 * ContactUs Component
 * A responsive contact form section with gradient backgrounds and modern styling
 * Features: Contact form, company information, and interactive submit button
 */
export default function ContactUs() {
    return (
        // Main container section with gradient background
        <section className='[background:linear-gradient(to_bottom_right,#004025_0%,#FFFFFFCC_50%,#004025_100%)] min-h-[140vh] flex items-center justify-center px-4'>

            {/* Contact form container - Main card with glass morphism effect */}
            <section className='flex w-[700px] max-w-full h-auto md:h-[820px] p-[49px] md:p-[49px] flex-col items-center gap-[40px] shrink-0 mt-10
                rounded-[20px] border border-[rgba(227,190,112,0.20)]
                bg-gradient-to-br from-[rgba(45,70,57,0.90)] to-[rgba(27,29,30,0.95)]
                shadow-[0_25px_50px_-12px_rgba(0,132,75,0.25),_0_0_0_1px_rgba(233,200,130,0.10)]
                backdrop-blur-[5px]'>

                {/* Section title with underline decoration */}
                <div className='relative'>
                    <h1 className='text-[#E9C882] text-center 
                        [text-shadow:0_2px_10px_rgba(233,200,130,0.30)]
                        font-poppins text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-none'>
                        تواصل معنا
                    </h1>
                    {/* Gradient underline below title */}
                    <div className='w-[80px] sm:w-[100px] h-[3px] absolute rounded-[3px] 
                        bg-gradient-to-r from-[#00844B] to-[#E9C882] top-12 sm:top-18 left-1/2 -translate-x-1/2'></div>
                </div>

                {/* Section description text */}
                <p className='text-white/80 text-center font-poppins text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-normal px-2'>
                    رسالتك هي بوابة إلى عالمنا، لا تتردد في مشاركتنا أفكارك واقتراحاتك
                </p>

                {/* Contact Form Section */}
                <form className='mt-2 w-full flex flex-col gap-7'>

                    {/* Full Name Input Field */}
                    <div className='relative'>
                        {/* Floating label for name input */}
                        <div className='flex w-fit px-[10px] flex-col items-end rounded-[10px] bg-gradient-to-b from-[#2D4639] to-[#1B1D1E] absolute right-3 top-[-12px] z-10'>
                            <label htmlFor="Name" className="text-[#E9C882] text-right font-[Tajawal] text-[14px]">الاسم الكامل</label>
                        </div>
                        <input required type="text" id="Name"
                            className="flex w-full md:w-[602px] px-[20px] py-[16px] text-white text-right font-poppins text-[12px] rounded-[12px] border border-[rgba(233,200,130,0.30)] bg-white/10 backdrop-blur-[2.5px]"
                            placeholder="مثل: أحمد محمد" />
                    </div>

                    {/* Email Input Field */}
                    <div className='relative'>
                        {/* Floating label for email input */}
                        <div className='flex w-fit px-[10px] flex-col items-end rounded-[10px] bg-gradient-to-b from-[#2D4639] to-[#1B1D1E] absolute right-3 top-[-12px] z-10'>
                            <label htmlFor="Email" className="text-[#E9C882] text-right font-[Tajawal] text-[14px]">البريد الإلكتروني</label>
                        </div>
                        <input required type="email" id="Email"
                            className="flex w-full md:w-[602px] px-[20px] py-[16px] text-white text-right font-poppins text-[12px] rounded-[12px] border border-[rgba(233,200,130,0.30)] bg-white/10 backdrop-blur-[2.5px]"
                            placeholder="email@example.com" />
                    </div>

                    {/* Message Textarea Field */}
                    <div className='relative'>
                        {/* Floating label for message textarea */}
                        <div className='flex w-fit px-[10px] py-1 flex-col items-end absolute right-3 top-[-10px] rounded-[10px] bg-gradient-to-b from-[#2D4639] to-[#1B1D1E] z-10'>
                            <label htmlFor="message" className="text-[#E9C882] text-right font-tajawal text-[14px]">رسالتك</label>
                        </div>
                        <textarea required id="message" rows="4"
                            className="flex w-full md:w-[602px] h-[150px] px-[20px] py-[20px] rounded-[12px] border border-[rgba(233,200,130,0.30)] bg-white/10 backdrop-blur-[2.5px] text-white text-right font-poppins text-[12px] resize-none"
                            placeholder="ما الذي يدور في ذهنك؟">
                        </textarea>
                    </div>

                    {/* Submit Button with hover effects and animations */}
                    <button type="submit"
                        className="relative w-full mt-5 px-[19.2px] py-[19.19px] overflow-hidden rounded-[14px]
                        bg-[radial-gradient(ellipse_at_top_right,_#00844B_0%,_transparent_70%)]
                        hover:bg-[radial-gradient(ellipse_at_bottom_left,_#2D4639_0%,_transparent_70%)]
                        transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]
                        shadow-[inset_0_1px_0px_rgba(255,255,255,0.2),_0_10px_30px_-5px_rgba(0,132,75,0.3)]
                        hover:shadow-[inset_0_1px_0px_rgba(255,255,255,0.3),_0_15px_40px_-5px_rgba(0,228,155,0.4)]
                        border border-[#00844B]/40 cursor-pointer backdrop-blur-[6px] group
                        before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.1)_100%)] before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-500">

                        {/* Button content with send icon */}
                        <div className="relative z-10 flex justify-center items-center gap-2">
                            <span className="text-white font-tajawal text-[14px] sm:text-[16px] font-bold">
                                أرسل الرسالة
                            </span>
                            <FontAwesomeIcon
                                icon={faPaperPlane}
                                className="transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#00E49B] text-white"
                            />
                        </div>
                        {/* Animated bottom border on hover */}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00E49B] group-hover:w-full transition-all duration-500 ease-out"></span>
                    </button>
                </form>

                {/* Contact Information Section */}
                <div className='flex flex-col sm:flex-row items-center gap-5 mt-3 text-sm sm:text-base'>

                    {/* Location information */}
                    <div className='flex items-center gap-1'>
                        <FontAwesomeIcon icon={faLocationDot} className="text-[#B9AF82]" />
                        <h1 className='text-[#B9AF82] font-[Cairo] underline'>دمشق، سوريا</h1>
                    </div>

                    {/* Email information */}
                    <div className='flex items-center gap-1'>
                        <FontAwesomeIcon icon={faEnvelope} className="text-[#B9AF82]" />
                        <h1 className='text-[#B9AF82] font-[Cairo] underline'>info@example.com</h1>
                    </div>

                    {/* Phone information */}
                    <div className='flex items-center gap-1'>
                        <FontAwesomeIcon icon={faPhone} className="text-[#B9AF82]" />
                        <h1 className='text-[#B9AF82] font-[Cairo] underline'>23423423</h1>
                    </div>
                </div>

            </section>
        </section>
    )
}