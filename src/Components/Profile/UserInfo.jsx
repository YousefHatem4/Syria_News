import React from 'react'

export default function UserInfo() {
    return <>
        <section className='flex w-full md:w-[804px] pt-6 md:pt-8 pr-4 md:pr-[33px] pb-6 md:pb-[33px] pl-4 md:pl-[33px] flex-col items-end gap-4 md:gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
            {/* title */}
            <section className='relative w-full'>
                <h1 className='text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]'>المعلومات الشخصية</h1>
                <div className='w-[50px] md:w-[70px] absolute start-92 md:start-166 top-10 md:top-11 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
            </section>

            {/* form */}
            <form className='mt-3 w-full'>
                {/* first input */}
                <div className='flex flex-col items-end gap-2 w-full'>
                    <label htmlFor="text" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">الاسم الكامل</label>
                    <input type="text" id="text" className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal" defaultValue="أحمد محمد" />
                </div>

                {/* second input */}
                <div className='flex flex-col items-end gap-2 mt-4 md:mt-6 w-full'>
                    <label htmlFor="email" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">البريد الإلكتروني</label>
                    <input type="email" id="email" className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal" defaultValue="ahmed@example.com" />
                </div>

                {/* third input */}
                <div className='flex flex-col items-end gap-2 mt-4 md:mt-6 w-full'>
                    <label htmlFor="tel" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">رقم الهاتف</label>
                    <input type="tel" id="tel" className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal" defaultValue="+963 123 456 789" />
                </div>

                {/* fourth input */}
                <div className='flex flex-col items-end gap-2 mt-4 md:mt-6 w-full'>
                    <label htmlFor="message" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">نبذة عني</label>
                    <textarea id="message" rows="4" className="text-white h-[100px] md:h-[134.5px] resize-none flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal" defaultValue="...مراسل سياسي متخصص في شؤون المنطقة، أعمل في مجال الصحافة منذ أكثر من 10 سنوات"></textarea>
                </div>

                {/* btn */}
                <button type='submit' className='text-[#1B1D1E] mt-5 md:mt-7 cursor-pointer text-center font-[Cairo] text-sm md:text-base not-italic font-semibold leading-normal flex w-full md:w-[738px] py-3 md:pt-[13.8px] md:pr-6 md:pb-[12.8px] md:pl-6 flex-col justify-center items-center rounded-[5px] bg-[var(--light-sand-beige-e-9-c-882,#E9C882)]'>
                    حفظ التغييرات
                </button>
            </form>
        </section>
    </>
}