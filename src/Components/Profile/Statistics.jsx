import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp , faArrowDown} from '@fortawesome/free-solid-svg-icons';

export default function Statistics() {
    return <>
        <section className='flex w-[804px] items-end  pt-8 pr-[33px] pb-[33px] pl-[33px] flex-col  gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
            {/* title 1*/}
            <div className='flex items-end flex-col'>
                <section className='relative'>
                    <h1 className='text-[#E9C882] text-right font-[Cairo] text-2xl not-italic font-bold leading-[40.8px]'>الإحصائيات</h1>
                    <div className='w-[70px] absolute start-10 top-11 h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
                </section>
            </div>

            {/* cards */}
            <div className='grid grid-cols-3 gap-x-6 gap-y-3'>

                {/* card 1 */}
                <div className='w-[243.33px] flex flex-col items-end gap-4 h-[164px] px-5 py-6 shrink-0 rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[14.4px] not-italic font-normal leading-normal'>
                        قيد المراجعة
                    </h1>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[28.8px] not-italic font-bold leading-normal'>
                        5
                    </h1>
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#E74C3C] font-[Cairo] text-[12.8px] not-italic font-normal leading-normal'>
                                12%
                            </span>
                            <span className='text-[#E74C3C] font-[Cairo] text-[12.8px] not-italic font-normal leading-normal'>
                                عن الشهر الماضي
                            </span>
                        </div>
                        <FontAwesomeIcon className='text-[#E74C3C] text-right text-[12.8px] not-italic font-black leading-[12.8px]' icon={faArrowDown}></FontAwesomeIcon>
                    </div>
                </div>

                {/* card 2 */}
                <div className='w-[243.33px] flex flex-col items-end gap-4 h-[164px] px-5 py-6 shrink-0 rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[14.4px] not-italic font-normal leading-normal'>
                        المنشورات المقبولة
                    </h1>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[28.8px] not-italic font-bold leading-normal'>
                        38
                    </h1>
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] font-[Cairo] text-[12.8px] not-italic font-normal leading-normal'>
                                8%
                            </span>
                            <span className='text-[#00844B] font-[Cairo] text-[12.8px] not-italic font-normal leading-normal'>
                                عن الشهر الماضي
                            </span>
                        </div>
                        <FontAwesomeIcon className='text-[#00844B] text-right text-[12.8px] not-italic font-black leading-[12.8px]' icon={faArrowUp}></FontAwesomeIcon>
                    </div>
                </div>

                {/* card 3 */}
                <div className='w-[243.33px] flex flex-col items-end gap-4 h-[164px] px-5 py-6 shrink-0 rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[14.4px] not-italic font-normal leading-normal'>
                        إجمالي المنشورات
                    </h1>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[28.8px] not-italic font-bold leading-normal'>
                        47
                    </h1>
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] font-[Cairo] text-[12.8px] not-italic font-normal leading-normal'>
                                12%
                            </span>
                            <span className='text-[#00844B] font-[Cairo] text-[12.8px] not-italic font-normal leading-normal'>
                                عن الشهر الماضي
                            </span>
                        </div>
                        <FontAwesomeIcon className='text-[#00844B] text-right text-[12.8px] not-italic font-black leading-[12.8px]' icon={faArrowUp}></FontAwesomeIcon>
                  </div>
                </div>

                {/* card 4 */}
                <div className='col-start-3 w-[243.33px] flex flex-col items-end gap-4 h-[164px] px-5 py-6 shrink-0 rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[14.4px] not-italic font-normal leading-normal'>
                        الرفض
                    </h1>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[28.8px] not-italic font-bold leading-normal'>
                        4
                    </h1>
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] font-[Cairo] text-[12.8px] not-italic font-normal leading-normal'>
                                4%
                            </span>
                            <span className='text-[#00844B] font-[Cairo] text-[12.8px] not-italic font-normal leading-normal'>
                                عن الشهر الماضي
                            </span>
                        </div>
                        <FontAwesomeIcon className='text-[#00844B] text-right text-[12.8px] not-italic font-black leading-[12.8px]' icon={faArrowDown}></FontAwesomeIcon>
                    </div>
                </div>
            </div>

            {/* part 2 */}
            {/* title 2*/}
            <div className='flex items-end flex-col mt-4'>
                <section className='relative'>
                    <h1 className='text-[#E9C882] text-right font-[Cairo] text-2xl not-italic font-bold leading-[40.8px]'>إحصائيات شهرية</h1>
                    <div className='w-[425%] absolute right-0.5 top-11 h-[1px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
                </section>

                <div className='mt-15 grid grid-cols-3 gap-x-6 gap-y-3'>
                    {/* card 1 */}
                    <div className='flex flex-col gap-4 w-[243.33px] px-5 pt-6 pb-[52px] justify-center items-center rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                        <h1 className='text-[#00844B] text-right font-[Poppins] text-[20px] not-italic font-semibold leading-normal'>يناير</h1>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                12
                            </span>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                 منشور
                            </span>
                        </div>

                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                100+
                            </span>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                تفاعل
                            </span>
                        </div>
                    </div>

                    {/* card 2 */}
                    <div className='flex flex-col gap-4 w-[243.33px] px-5 pt-6 pb-[52px] justify-center items-center rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                        <h1 className='text-[#00844B] text-right font-[Poppins] text-[20px] not-italic font-semibold leading-normal'>يناير</h1>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                12
                            </span>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                منشور
                            </span>
                        </div>

                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                100+
                            </span>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                تفاعل
                            </span>
                        </div>
                    </div>

                    {/* card 3 */}
                    <div className='flex flex-col gap-4 w-[243.33px] px-5 pt-6 pb-[52px] justify-center items-center rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                        <h1 className='text-[#00844B] text-right font-[Poppins] text-[20px] not-italic font-semibold leading-normal'>يناير</h1>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                12
                            </span>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                منشور
                            </span>
                        </div>

                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                100+
                            </span>
                            <span className='text-[#00844B] text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>
                                تفاعل
                            </span>
                        </div>
                    </div>


                </div>
            </div>

        </section>
    </>
}
