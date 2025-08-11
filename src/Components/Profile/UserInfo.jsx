import React from 'react'

export default function UserInfo() {
    return <>
        <section className='flex w-[804px] pt-8 pr-[33px] pb-[33px] pl-[33px] flex-col items-end gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
            {/* title */}
            <section className='relative'>
                <h1 className='text-[#E9C882] text-right font-[Cairo] text-2xl not-italic font-bold leading-[40.8px]'>المعلومات الشخصية</h1>
                <div className='w-[70px] absolute start-37 top-11 h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
            </section>

            {/* form */}
            <form className='mt-3'>
                {/* first input */}
                <div className='flex flex-col items-end gap-2'>
                    <label for="text" class="text-[#E9C882] font-[Cairo] text-base not-italic font-normal leading-[27.2px]">الاسم الكامل</label>
                    <input type="text" id="text" class="text-white flex w-[738px] py-[13.8px] px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-base not-italic font-normal leading-normal" defaultValue="أحمد محمد" />
                </div>

                {/* second input */}
                <div className='flex flex-col items-end gap-2 mt-6'>
                    <label for="email" class="text-[#E9C882] font-[Cairo] text-base not-italic font-normal leading-[27.2px]">البريد الإلكتروني</label>
                    <input type="email" id="email" class="text-white flex w-[738px] py-[13.8px] px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-base not-italic font-normal leading-normal" defaultValue="ahmed@example.com" />
                </div>

                {/* third input */}
                <div className='flex flex-col items-end gap-2 mt-6'>
                    <label for="tel" class="text-[#E9C882] font-[Cairo] text-base not-italic font-normal leading-[27.2px]">رقم الهاتف</label>
                    <input type="tel" id="tel" class="text-white flex w-[738px] py-[13.8px] px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-base not-italic font-normal leading-normal" defaultValue="+963 123 456 789" />
                </div>

                {/* fourth input */}
                <div className='flex flex-col items-end gap-2 mt-6'>
                    <label for="tel" class="text-[#E9C882] font-[Cairo] text-base not-italic font-normal leading-[27.2px]">رقم الهاتف</label>
                    <textarea id="message" rows="4" class="text-white h-[134.5px] resize-none flex w-[738px] py-[13.8px] px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-base not-italic font-normal leading-normal" defaultValue="...مراسل سياسي متخصص في شؤون المنطقة، أعمل في مجال الصحافة منذ أكثر من 10 سنوات"></textarea>
                </div>

                {/* btn */}

                <button type='submit' className='text-[#1B1D1E] mt-7 cursor-pointer text-center font-[Cairo] text-base not-italic font-semibold leading-normal flex w-[738px] pt-[13.8px] pr-6 pb-[12.8px] pl-6 flex-col justify-center items-center rounded-[5px] bg-[var(--light-sand-beige-e-9-c-882,#E9C882)]'>
                    حفظ التغييرات
                </button>
            </form>
        </section>
    </>
}
