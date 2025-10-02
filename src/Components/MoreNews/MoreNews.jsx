import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faFutbol, faGavel, faLandmark, faMasksTheater } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


export default function MoreNews() {





  // Slider state and refs
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const cardWidth = 261;
  const cardsToShow = 5;

  // Sample data for the more news section
  const moreNewsData = [
    { id: 1, image: "morepost-1.png", title: "اشترك في النشرة الإخبارية", content: "أخبار وتحليلات خبراء لكل جدول. احصل على إصدارات الصباح والمساء من نشرتنا الإخبارية الرئيسية في بريدك الإلكتروني" },
    { id: 2, image: "morepost-2.png", title: "سجل للحصول علي حساب", content: "أخبار وتحليلات خبراء لكل جدول. احصل على إصدارات الصباح والمساء من نشرتنا الإخبارية الرئيسية في بريدك الإلكتروني" },
    { id: 3, image: "morepost-1.png", title: "اشترك في النشرة الإخبارية", content: "أخبار وتحليلات خبراء لكل جدول. احصل على إصدارات الصباح والمساء من نشرتنا الإخبارية الرئيسية في بريدك الإلكتروني" },
    { id: 4, image: "morepost-3.png", title: "اشترك في النشرة الإخبارية", content: "أخبار وتحليلات خبراء لكل جدول. احصل على إصدارات الصباح والمساء من نشرتنا الإخبارية الرئيسية في بريدك الإلكتروني" },
    { id: 5, image: "morepost-1.png", title: "اشترك في النشرة الإخبارية", content: "أخبار وتحليلات خبراء لكل جدول. احصل على إصدارات الصباح والمساء من نشرتنا الإخبارية الرئيسية في بريدك الإلكتروني" },
    { id: 6, image: "morepost-1.png", title: "اشترك في النشرة الإخبارية", content: "أخبار وتحليلات خبراء لكل جدول. احصل على إصدارات الصباح والمساء من نشرتنا الإخبارية الرئيسية في بريدك الإلكتروني" },
    { id: 7, image: "morepost-2.png", title: "سجل للحصول علي حساب", content: "أخبار وتحليلات خبراء لكل جدول. احصل على إصدارات الصباح والمساء من نشرتنا الإخبارية الرئيسية في بريدك الإلكتروني" },
    { id: 8, image: "morepost-3.png", title: "اشترك في النشرة الإخبارية", content: "أخبار وتحليلات خبراء لكل جدول. احصل على إصدارات الصباح والمساء من نشرتنا الإخبارية الرئيسية في بريدك الإلكتروني" }
  ];



  // Handle next slide
  const nextSlide = () => {
    if (currentSlide < moreNewsData.length - cardsToShow) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  // Handle previous slide
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return <>
    <section className='bg-[linear-gradient(164deg,#004025_-0.36%,rgba(255,255,255,0.80)_34.44%,rgba(0,64,37,0.50)_101.6%)] h-auto pb-10 relative flex flex-col'>

      {/* proccessing */}
      <section className='flex items-center gap-3 absolute top-32 sm:top-20 md:top-28 lg:top-35 left-4 sm:left-8 md:left-12 lg:left-15'>
        <h1 className='font-poppins text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-normal text-white'>الصفحه الرئيسه </h1>
        <FontAwesomeIcon icon={faAngleRight} className='text-white text-sm md:text-base'></FontAwesomeIcon>
        <h1 className='font-poppins text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-normal text-[#00341E]'>جميع الأخبار </h1>
      </section>

      {/* first section */}
      <section className='mt-40 sm:mt-32 md:mt-44 lg:mt-55 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-15 px-4 sm:px-6 md:px-8 lg:px-0'>
        {/* left section */}
        <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0'>
          <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
          {/* card content */}
          <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
            <div className='flex items-center justify-end gap-4'>
              <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
              <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
            </div>

            <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

            <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>

            <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
              <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'>.....إقراء المزيد</Link>
              <div className='flex items-center gap-4'>
                <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
              </div>
            </div>
          </div>
        </section>

        {/* right section */}
        <section className='w-full max-w-[869px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0'>
          <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
          {/* card content */}
          <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6 lg:gap-8'>
            <div className='flex items-center justify-end gap-4'>
              <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
              <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
            </div>

            <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

            <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>

            <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
              <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'>.....إقراء المزيد</Link>
              <div className='flex items-center gap-4'>
                <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* other posts */}
      <section className='p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col gap-6 sm:gap-8 lg:gap-10'>
        {/* first row */}
        <div className='flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10'>
          <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-0 lg:mt-0'>
            <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
            {/* card content */}
            <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
              <div className='flex items-center justify-end gap-4'>
                <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
              </div>

              <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

              <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>

              <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'>.....إقراء المزيد</Link>
                <div className='flex items-center gap-4'>
                  <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                  <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                </div>
              </div>
            </div>
          </section>

          <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-0 lg:mt-0'>
            <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
            {/* card content */}
            <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
              <div className='flex items-center justify-end gap-4'>
                <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
              </div>

              <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

              <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>

              <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'>.....إقراء المزيد</Link>
                <div className='flex items-center gap-4'>
                  <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                  <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                </div>
              </div>
            </div>
          </section>

          <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-0 lg:mt-0 hidden xl:block'>
            <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
            {/* card content */}
            <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
              <div className='flex items-center justify-end gap-4'>
                <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
              </div>

              <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

              <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>

              <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'>.....إقراء المزيد</Link>
                <div className='flex items-center gap-4'>
                  <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                  <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* second row */}
        <div className='flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10'>
          <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-0 lg:mt-0'>
            <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
            {/* card content */}
            <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
              <div className='flex items-center justify-end gap-4'>
                <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
              </div>

              <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

              <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>

              <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'>.....إقراء المزيد</Link>
                <div className='flex items-center gap-4'>
                  <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                  <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                </div>
              </div>
            </div>
          </section>

          <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-0 lg:mt-0'>
            <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
            {/* card content */}
            <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
              <div className='flex items-center justify-end gap-4'>
                <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
              </div>

              <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

              <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>

              <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'>.....إقراء المزيد</Link>
                <div className='flex items-center gap-4'>
                  <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                  <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                </div>
              </div>
            </div>
          </section>

          <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-0 lg:mt-0 hidden xl:block'>
            <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
            {/* card content */}
            <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
              <div className='flex items-center justify-end gap-4'>
                <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
              </div>

              <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

              <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>

              <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'>.....إقراء المزيد</Link>
                <div className='flex items-center gap-4'>
                  <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                  <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* more news section 3 */}
      <section className='mt-3 mb-5 h-auto md:h-[440px] shrink-0 bg-[#1B1D1E] py-8 sm:py-9 md:py-10'>
        <div className='flex justify-center'>
          <div className='w-[90%] md:w-[95%] lg:w-[1400px] h-[1px] bg-white'></div>
        </div>

        {/* title */}
        <div className='flex justify-between items-center mx-4 sm:mx-6 md:mx-10 lg:mx-15 mt-4 sm:mt-3 md:mt-2'>
          <div className=''>
            {/* title */}
            <div className='inline-flex pb-3 flex-col items-end border-b border-white' >
              <h1 className='text-white text-right font-[Tajawal] text-[12px] sm:text-[13px] md:text-[14px] not-italic font-normal leading-normal'>اكتشف المزيد من أخبار سوريا</h1>
            </div>
          </div>
          <div className='flex gap-3 sm:gap-4 md:gap-5'>
            <FontAwesomeIcon
              className={`cursor-pointer text-base sm:text-lg md:text-xl ${currentSlide === 0 ? 'text-white/30' : 'text-white'}`}
              icon={faAngleLeft}
              onClick={prevSlide}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              className={`cursor-pointer text-base sm:text-lg md:text-xl ${currentSlide >= moreNewsData.length - cardsToShow ? 'text-white/30' : 'text-white'}`}
              icon={faAngleRight}
              onClick={nextSlide}
            ></FontAwesomeIcon>
          </div>
        </div>

        {/* main section */}
        <section className='mt-6 sm:mt-8 md:mt-10 ms-4 sm:ms-6 md:ms-10 lg:ms-15 overflow-hidden relative'>
          <div
            ref={sliderRef}
            className='flex gap-4 sm:gap-5 md:gap-6 lg:gap-7 transition-transform duration-300 ease-in-out'
            style={{ transform: `translateX(-${currentSlide * cardWidth}px)` }}
          >
            {moreNewsData.map((item) => (
              <div key={item.id} className='flex w-[200px] sm:w-[220px] md:w-[240px] lg:w-[261px] h-[260px] sm:h-[270px] md:h-[285px] lg:h-[297px] flex-col items-end gap-2 flex-shrink-0'>
                <img src={item.image} className='h-[130px] sm:h-[140px] md:h-[150px] lg:h-[160px] shrink-0 self-stretch rounded-[4px] object-cover' alt="" />
                <h1 className='text-white text-right font-[Poppins] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] not-italic font-semibold leading-normal'>{item.title}</h1>
                <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%]">
                  <p className="text-[#8A8A8A] text-right font-[Tajawal] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] not-italic font-normal leading-4 self-stretch">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

    </section>
  </>
}
