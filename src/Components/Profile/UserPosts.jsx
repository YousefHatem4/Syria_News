import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTrashCan } from '@fortawesome/free-regular-svg-icons';

export default function UserPosts() {
  return <>
    <section className='flex w-[804px]  pt-8 pr-[33px] pb-[33px] pl-[33px] flex-col  gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
      {/* title */}
      <div className='flex items-end flex-col'>
        <section className='relative'>
          <h1 className='text-[#E9C882] text-right font-[Cairo] text-2xl not-italic font-bold leading-[40.8px]'>منشوراتي</h1>
          <div className='w-[70px] absolute start-9 top-11 h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
        </section>
      </div>

      {/* posts */}


      <div className='flex items-center justify-center mt-6'>
        <div class="w-[367px] h-[341px] rounded-[8px] bg-white shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
          <img class="w-[426px] h-[204px] shrink-0 rounded-t-[8px] object-cover" src="post_image.jpg" alt="" />

          <div class="flex w-[345px] flex-col items-end gap-3 mt-4">
            {/* title of post */}
            <div className='flex items-center gap-2'>
              <h1 className='text-black font-[Poppins] text-[20px] not-italic font-semibold leading-normal'>شرق أوسط </h1>
              <span className='w-[5px] h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)]'></span>
            </div>
            {/* desciption */}
            <div>
              <p className='text-black text-right font-[Tajawal] text-sm not-italic font-normal leading-normal'>بعد مقتل زاده.. قائد جديد للقوة الجوفضائية بالحرس </p>
              <p className='text-black text-right font-[Tajawal] text-sm not-italic font-normal leading-normal'>.... الثوري</p>
            </div>

            <div className='flex justify-between w-full'>
              <div className='text-[var(--Gray,#8A8A8A)] cursor-pointer ms-4 text-right font-[Poppins] text-xs not-italic font-normal leading-normal flex items-center gap-1'>
                <p>حذف</p>
                <FontAwesomeIcon className='text-[#000000]' icon={faTrashCan} />
              </div>
              
              <div className='text-[var(--Gray,#8A8A8A)] text-right font-[Poppins] text-xs not-italic font-normal leading-normal flex items-center gap-2'>
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
