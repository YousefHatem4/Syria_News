import React from 'react'
import style from './ContactUs.module.css'

export default function ContactUs() {
    return <>
        <section className='[background:linear-gradient(to_bottom_right,#004025_0%,#FFFFFFCC_50%,#004025_100%)] min-h-[140vh] flex items-center justify-center '>
            {/* the big box */}
            <section className='flex w-[700px] h-[820px] max-w-[700px] p-[49px] flex-col items-center gap-[40px] shrink-0 mt-30
    rounded-[20px] border border-[rgba(227,190,112,0.20)]
    bg-gradient-to-br from-[rgba(45,70,57,0.90)] to-[rgba(27,29,30,0.95)]
    shadow-[0_25px_50px_-12px_rgba(0,132,75,0.25),_0_0_0_1px_rgba(233,200,130,0.10)]
    backdrop-blur-[5px] '>
                {/* title */}
                <div className='relative'>
                    <h1 className=' text-[#E9C882] text-center 
    [text-shadow:0_2px_10px_rgba(233,200,130,0.30)]
    font-poppins text-[48px] font-bold leading-none'>تواصل معنا</h1>
                    <div className='w-[100px] h-[3px]  absolute  rounded-[3px] 
    bg-gradient-to-r from-[#00844B] to-[#E9C882] top-18 left-[30%]'></div>
                </div>
                <p className='text-white/80 
    text-center 
    font-poppins 
    text-[20px] 
    font-semibold 
    leading-normal'>رسالتك هي بوابة إلى عالمنا، لا تتردد في مشاركتنا أفكارك واقتراحاتك</p>
            </section>
        </section>
    </>
}
