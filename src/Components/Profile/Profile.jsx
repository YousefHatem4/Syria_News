import React from 'react'
import style from './Profile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,  } from '@fortawesome/free-regular-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';


export default function Profile() {
    return <>
        <section className='bg-[linear-gradient(167deg,#2D4639_0%,#1B1D1E_88.4%)] min-h-[150vh] pt-45 flex justify-center'>

            <section className='flex flex-col items-center '>
                {/* Add Picture Profile */}
                <section className='relative'>
                    <div className=' flex w-[150px] h-[150px] flex-col justify-center items-center shrink-0 rounded-[75px] flex-[1_0_0]  border-[3px] border-[#E9C882] shadow-[0_5px_15px_0_rgba(0,0,0,0.30)]'>
                        <FontAwesomeIcon icon={faUser} className="text-[#E9C882] text-3xl" />
                    </div>
                    <div className='flex w-[40px] h-[40px] justify-center items-center absolute top-26 left-3 rounded-[20px] bg-[#00844B]'>
                        <FontAwesomeIcon icon={faCamera} className="text-white text-right font-[Font_Awesome_5_Free] text-[16px] not-italic font-black leading-[16px] cursor-pointer" />
                    </div>
                </section>

                {/* info of user */}
                <h1 className='text-[#E9C882] text-right font-[Tajawal] text-[28px] not-italic font-bold leading-normal mt-6'>أحمد محمد</h1>
                <p className='text-[#8A8A8A] text-right font-[Cairo] text-[16px] not-italic font-normal leading-[27.2px] mt-3'>ahmed@example.com</p>
                <h1 className='text-[#E9C882] text-center font-[Poppins] text-[20px] not-italic font-semibold leading-normal mt-7'>47</h1>
                <p className='text-[#8A8A8A] text-center font-[Tajawal] text-[14px] not-italic font-normal leading-normal -mt-2'>منشور</p>
                <div className='w-[750%] h-[1px] bg-[rgba(233,200,130,0.45)] my-12'></div>
            </section>
        </section>
    </>
}
