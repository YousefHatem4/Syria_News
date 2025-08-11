import React, { useState } from 'react'
import style from './Profile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as faUserRegular, faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faUser as faUserSolid, faLock } from '@fortawesome/free-solid-svg-icons';
import UserInfo from './UserInfo';
import ChangePass from './ChangePass';
import UserPosts from './UserPosts';


export default function Profile() {
    const [info, setInfo] = useState(true);
    const [changePass, setChangePass] = useState(false);
    const [posts, setPosts] = useState(false);

    return <>
        <section className='bg-[linear-gradient(167deg,#2D4639_0%,#1B1D1E_88.4%)] min-h-[150vh] pt-45 pb-20 '>

            <section className='flex flex-col items-center '>
                {/* Add Picture Profile */}
                <section className='relative'>
                    <div className=' flex w-[150px] h-[150px] flex-col justify-center items-center shrink-0 rounded-[75px] flex-[1_0_0]  border-[3px] border-[#E9C882] shadow-[0_5px_15px_0_rgba(0,0,0,0.30)]'>
                        <FontAwesomeIcon icon={faUserRegular} className="text-[#E9C882] text-3xl" />
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
                <div className='w-[75.5%] h-[1px] bg-[rgba(233,200,130,0.45)] my-12'></div>
            </section>
            {/* main part */}
            <section className=' flex  place-items-start  justify-center gap-10 mt-4'>
                <div>
                    {info && <UserInfo />}
                    {changePass && <ChangePass />}
                    {posts && <UserPosts />}
                </div>

                {/* sidebar */}
                <div className='flex w-[300px] p-[25px] pb-[37.79px] flex-col items-end gap-[24.01px] rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
                    {/* title of sidebar */}
                    <div className='relative'>
                        <h1 className='text-[#E9C882] text-right font-[Cairo] text-[20.8px] not-italic font-bold leading-[35.36px]'>إعدادات الحساب</h1>
                        <div className='w-[50px] h-[2px] absolute left-24 top-10 bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
                    </div>



                    {/* sidebar items */}
                    <div className='mt-3 flex flex-col gap-7 items-end'>

                        {/* item 1 */}
                        {info ? (
                            // active
                            <div className='flex pl-[74.28px] pr-[12.79px] pt-[11.79px] pb-[12.8px] items-center gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[var(--light-sand-beige-e-9-c-882,#E9C882)] text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex items-center gap-1 -me-1'>
                                    <h1>المعلومات الشخصية</h1>
                                    <FontAwesomeIcon icon={faUserSolid} />
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    setInfo(true);
                                    setChangePass(false);
                                    setPosts(false);
                                }}
                                className='text-white cursor-pointer text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex items-center gap-2 me-1'
                            >
                                <h1>المعلومات الشخصية</h1>
                                <FontAwesomeIcon icon={faUserSolid} />
                            </div>
                        )}

                        {/* item 2 */}
                        {changePass ? (
                            // active
                            <div className='flex pl-[120px] pr-[12.79px] pt-[11.79px] pb-[12.8px] items-center gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[var(--light-sand-beige-e-9-c-882,#E9C882)] text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex items-center gap-1 -me-2'>
                                    <h1>تغيير كلمة السر</h1>
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(true);
                                    setPosts(false);
                                }}
                                className='text-white cursor-pointer text-right me-1 font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex items-center gap-2'
                            >
                                <h1>تغيير كلمة السر</h1>
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                        )}

                        {/* item 3 */}
                        {posts ? (
                            // active
                            <div className='flex pl-[150px] pr-[12.79px] pt-[11.79px] pb-[12.8px] items-center gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[var(--light-sand-beige-e-9-c-882,#E9C882)] text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex items-center gap-2 -me-2'>
                                    <h1>منشوراتي</h1>
                                    <FontAwesomeIcon icon={faAddressCard} />
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(false);
                                    setPosts(true);
                                }}
                                className='text-white cursor-pointer text-right me-1 font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex items-center gap-2'
                            >
                                <h1>منشوراتي</h1>
                                <FontAwesomeIcon icon={faAddressCard} />
                            </div>
                        )}



                    </div>
                </div>
            </section>
        </section>
    </>
}
