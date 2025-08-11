import React, { useState } from 'react'
import style from './Profile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as faUserRegular, faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faUser as faUserSolid, faLock, faChartLine, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import UserInfo from './UserInfo';
import ChangePass from './ChangePass';
import UserPosts from './UserPosts';
import Statistics from './Statistics';

export default function Profile() {
    const [info, setInfo] = useState(true);
    const [changePass, setChangePass] = useState(false);
    const [posts, setPosts] = useState(false);
    const [statistics, setStatistics] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return <>
        <section className='bg-[linear-gradient(167deg,#2D4639_0%,#1B1D1E_88.4%)] min-h-[150vh] pt-45 pb-20 '>

            <section className='flex flex-col items-center '>
                {/* Add Picture Profile */}
                <section className='relative'>
                    <div className='flex w-[120px] h-[120px] md:w-[150px] md:h-[150px] flex-col justify-center items-center shrink-0 rounded-[75px] flex-[1_0_0] border-[3px] border-[#E9C882] shadow-[0_5px_15px_0_rgba(0,0,0,0.30)]'>
                        <FontAwesomeIcon icon={faUserRegular} className="text-[#E9C882] text-3xl" />
                    </div>
                    <div className='flex w-[30px] h-[30px] md:w-[40px] md:h-[40px] justify-center items-center absolute top-20 md:top-26 left-3 md:left-3 rounded-[20px] bg-[#00844B] cursor-pointer'>
                        <FontAwesomeIcon icon={faCamera} className="text-white text-right font-[Font_Awesome_5_Free] text-[12px] md:text-[16px] not-italic font-black leading-[16px]" />
                    </div>
                </section>

                {/* info of user */}
                <h1 className='text-[#E9C882] text-right font-[Tajawal] text-[24px] md:text-[28px] not-italic font-bold leading-normal mt-6'>أحمد محمد</h1>
                <p className='text-[#8A8A8A] text-right font-[Cairo] text-[14px] md:text-[16px] not-italic font-normal leading-[27.2px] mt-3'>ahmed@example.com</p>
                <h1 className='text-[#E9C882] text-center font-[Poppins] text-[18px] md:text-[20px] not-italic font-semibold leading-normal mt-7'>47</h1>
                <p className='text-[#8A8A8A] text-center font-[Tajawal] text-[12px] md:text-[14px] not-italic font-normal leading-normal -mt-2'>منشور</p>
                <div className='w-[90%] md:w-[75.5%] h-[1px] bg-[rgba(233,200,130,0.45)] my-8 md:my-12'></div>
            </section>

            {/* Mobile menu button */}
            <div className='md:hidden flex justify-center mb-6'>
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className='text-[#E9C882] text-2xl cursor-pointer'
                >
                    <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} />
                </button>
            </div>

            {/* main part */}
            <section className='flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10 mt-4 px-4 md:px-0'>
                {/* Mobile sidebar */}
                {showMobileMenu && (
                    <div className='md:hidden w-full p-5 flex flex-col items-end gap-4 rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
                        <div className='relative w-full'>
                            <h1 className='text-[#E9C882] text-right font-[Cairo] text-[18px] not-italic font-bold leading-[35.36px]'>إعدادات الحساب</h1>
                            <div className='w-[50px] h-[2px] absolute left-90 top-10 bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
                        </div>

                        <div className='mt-3 flex flex-col gap-5 w-full items-end'>
                            <div
                                onClick={() => {
                                    setInfo(true);
                                    setChangePass(false);
                                    setPosts(false);
                                    setStatistics(false);
                                    setShowMobileMenu(false);
                                }}
                                className={`text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex cursor-pointer items-center gap-2 w-full justify-end p-3 rounded ${info ? 'text-[#E9C882] bg-[rgba(233,200,130,0.10)]' : 'text-white'}`}
                            >
                                <h1>المعلومات الشخصية</h1>
                                <FontAwesomeIcon icon={faUserSolid} />
                            </div>

                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(true);
                                    setPosts(false);
                                    setStatistics(false);
                                    setShowMobileMenu(false);
                                }}
                                className={`text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex  cursor-pointer items-center gap-2 w-full justify-end p-3 rounded ${changePass ? 'text-[#E9C882] bg-[rgba(233,200,130,0.10)]' : 'text-white'}`}
                            >
                                <h1>تغيير كلمة السر</h1>
                                <FontAwesomeIcon icon={faLock} />
                            </div>

                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(false);
                                    setPosts(true);
                                    setStatistics(false);
                                    setShowMobileMenu(false);
                                }}
                                className={`text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex  cursor-pointer items-center gap-2 w-full justify-end p-3 rounded ${posts ? 'text-[#E9C882] bg-[rgba(233,200,130,0.10)]' : 'text-white'}`}
                            >
                                <h1>منشوراتي</h1>
                                <FontAwesomeIcon icon={faAddressCard} />
                            </div>

                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(false);
                                    setPosts(false);
                                    setStatistics(true);
                                    setShowMobileMenu(false);
                                }}
                                className={`text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex   cursor-pointer items-center gap-2 w-full justify-end p-3 rounded ${statistics ? 'text-[#E9C882] bg-[rgba(233,200,130,0.10)]' : 'text-white'}`}
                            >
                                <h1>الإحصائيات</h1>
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                        </div>
                    </div>
                )}
                {/* Content section */}
                <div className='w-full md:w-auto'>
                    {info && <UserInfo />}
                    {changePass && <ChangePass />}
                    {posts && <UserPosts />}
                    {statistics && <Statistics />}
                </div>

                {/* sidebar - desktop */}
                <div className={`hidden md:flex w-[250px] lg:w-[300px] p-[20px] lg:p-[25px] pb-[30px] lg:pb-[37.79px] flex-col items-end gap-[20px] lg:gap-[24.01px] rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]`}>
                    {/* title of sidebar */}
                    <div className='relative'>
                        <h1 className='text-[#E9C882] text-right font-[Cairo] text-[18px] lg:text-[20.8px] not-italic font-bold leading-[35.36px]'>إعدادات الحساب</h1>
                        <div className='w-[40px] lg:w-[50px] h-[2px] absolute left-20 lg:left-24 top-10 bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
                    </div>

                    {/* sidebar items */}
                    <div className='mt-3 flex flex-col gap-5 lg:gap-7 items-end'>
                        {/* item 1 */}
                        {info ? (
                            <div className='flex pl-[50px] lg:pl-[74.28px] pr-[10px] lg:pr-[12.79px] pt-[10px] lg:pt-[11.79px] pb-[10px] lg:pb-[12.8px] items-center gap-[10px] lg:gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[#E9C882] text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-1 -me-1'>
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
                                    setStatistics(false);
                                }}
                                className='text-white cursor-pointer text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2 me-1'
                            >
                                <h1>المعلومات الشخصية</h1>
                                <FontAwesomeIcon icon={faUserSolid} />
                            </div>
                        )}

                        {/* item 2 */}
                        {changePass ? (
                            <div className='flex pl-[90px] lg:pl-[120px] pr-[10px] lg:pr-[12.79px] pt-[10px] lg:pt-[11.79px] pb-[10px] lg:pb-[12.8px] items-center gap-[10px] lg:gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[#E9C882] text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-1 -me-2'>
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
                                    setStatistics(false);
                                }}
                                className='text-white cursor-pointer text-right me-1 font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2'
                            >
                                <h1>تغيير كلمة السر</h1>
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                        )}

                        {/* item 3 */}
                        {posts ? (
                            <div className='flex pl-[120px] lg:pl-[150px] pr-[10px] lg:pr-[12.79px] pt-[10px] lg:pt-[11.79px] pb-[10px] lg:pb-[12.8px] items-center gap-[10px] lg:gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[#E9C882] text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2 -me-2'>
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
                                    setStatistics(false);
                                }}
                                className='text-white cursor-pointer text-right me-1 font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2'
                            >
                                <h1>منشوراتي</h1>
                                <FontAwesomeIcon icon={faAddressCard} />
                            </div>
                        )}

                        {/* item 4 */}
                        {statistics ? (
                            <div className='flex pl-[120px] lg:pl-[150px] pr-[10px] lg:pr-[12.79px] pt-[10px] lg:pt-[11.79px] pb-[10px] lg:pb-[12.8px] items-center gap-[10px] lg:gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[#E9C882] text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2 -me-2'>
                                    <h1>الإحصائيات</h1>
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(false);
                                    setPosts(false);
                                    setStatistics(true);
                                }}
                                className='text-white cursor-pointer text-right me-1 font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2'
                            >
                                <h1>الإحصائيات</h1>
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                        )}
                    </div>
                </div>

               
            </section>
        </section>
    </>
}