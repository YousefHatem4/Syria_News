import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTrashCan } from '@fortawesome/free-regular-svg-icons';

export default function UserPosts() {
  return <>
    <section className='flex w-full md:w-[804px] pt-6 md:pt-8 pr-4 md:pr-[33px] pb-6 md:pb-[33px] pl-4 md:pl-[33px] flex-col gap-4 md:gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
      {/* title */}
      <div className='flex items-end flex-col w-full'>
        <section className='relative w-full'>
          <h1 className='text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]'>منشوراتي</h1>
          <div className='w-[50px] md:w-[70px] absolute start-92 md:start-166 top-9 md:top-11 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
        </section>
      </div>

      {/* posts */}
      <div className='flex items-center justify-center mt-4 md:mt-6 w-full'>
        <div className="w-full sm:w-[367px] h-auto sm:h-[355px] rounded-[8px] bg-white shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
          <img className="w-full h-[180px] sm:h-[204px] shrink-0 rounded-t-[8px] object-cover" src="post_image.jpg" alt="" />

          <div className="flex w-full px-4 py-1 sm:w-[345px] flex-col items-end gap-3 mt-2 sm:mt-4">
            {/* title of post */}
            <div className='flex items-center gap-2'>
              <h1 className='text-black font-[Poppins] text-[18px] md:text-[20px] not-italic font-semibold leading-normal'>شرق أوسط </h1>
              <span className='w-[4px] md:w-[5px] h-[16px] md:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)]'></span>
            </div>
            {/* desciption */}
            <div>
              <p className='text-black text-right font-[Tajawal] text-[13px] md:text-sm not-italic font-normal leading-normal'>بعد مقتل زاده.. قائد جديد للقوة الجوفضائية بالحرس </p>
              <p className='text-black text-right font-[Tajawal] text-[13px] md:text-sm not-italic font-normal leading-normal'>.... الثوري</p>
            </div>

            <div className='flex justify-between w-full'>
              <div className='text-[var(--Gray,#8A8A8A)] cursor-pointer ms-4 text-right font-[Poppins] text-[11px] md:text-xs not-italic font-normal leading-normal flex items-center gap-1'>
                <p>حذف</p>
                <FontAwesomeIcon className='text-[#000000]' icon={faTrashCan} />
              </div>

              <div className='text-[var(--Gray,#8A8A8A)] text-right font-[Poppins] text-[11px] md:text-xs not-italic font-normal leading-normal flex items-center gap-2'>
                <p>منذ 3 أيام </p>
                <FontAwesomeIcon icon={faClock} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
}