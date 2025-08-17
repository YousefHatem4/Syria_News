import React from 'react'

export default function LastPosts() {
  return <>
    <section className='flex w-[804px] px-[17px] pt-8 pb-[444.8px] flex-col items-center gap-[33.2px] shrink-0 rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
      {/* title 1*/}
      <div className='flex items-end flex-col w-full'>
        <section className='relative w-full'>
          <h1 className='text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]'>آخر المنشورات</h1>
          <div className='w-[50px] md:w-[70px] absolute start-92 md:start-174 top-9 md:top-12 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
        </section>
      </div>
    </section>
  </>
}
