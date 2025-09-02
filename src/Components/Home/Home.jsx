import React, { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCirclePlus, faSquarePollVertical, faCamera, faVideo, faCheckCircle, faTimes, faClock, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



export default function Home() {
    const [showSection2, setShowSection2] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [poll, setPoll] = useState(false);
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const modalRef = useRef(null);

    // Slider state and refs
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);
    const cardWidth = 261; // Width of each card including gap
    const cardsToShow = 5; // Number of cards to show at once

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

    useEffect(() => {
        document.body.style.overflow = showSection2 ? "hidden" : "auto";
    }, [showSection2]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 2500);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleShare = () => {
        if (!text && !image && !video && (!poll || pollOptions.every(opt => !opt.trim()))) return;
        setShowToast(true);
        setShowSection2(false);
        setText("");
        setImage(null);
        setVideo(null);
        setPoll(false);
        setPollOptions(["", ""]);
    };

    const handleImageUpload = (e) => {
        if (e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
            setVideo(null);
        }
    };

    const handleVideoUpload = (e) => {
        if (e.target.files[0]) {
            setVideo(URL.createObjectURL(e.target.files[0]));
            setImage(null);
        }
    };

    const removeMedia = () => {
        setImage(null);
        setVideo(null);
    };


    return (
        <div className='bg-[linear-gradient(164deg,#004025_-0.36%,rgba(255,255,255,0.80)_34.44%,rgba(0,64,37,0.50)_101.6%)]  min-h-[315vh] '>

            {/* add post section - Added hover animation */}
            <section className='flex justify-center items-center pt-30 md:pt-50 px-4'>
                <div
                    onClick={() => setShowSection2(true)}
                    className='flex w-full max-w-[407px] cursor-pointer items-center justify-between md:gap-[123px] px-[6px] py-[5px] rounded-[12px] border border-black/30 transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:scale-[1.02]'
                >
                    <p className='text-white font-poppins text-[12px] font-normal leading-normal truncate'>......اكتب عن الخبر الذي تريده </p>
                    <button className='flex p-2 cursor-pointer justify-center items-center gap-2 rounded-lg bg-[#00844B] text-white font-[tajawal] text-[14px] md:text-[16px] font-bold leading-normal transition-all duration-300 hover:bg-[#006D3D] hover:shadow-md'>
                        <FontAwesomeIcon className='text-white' icon={faCirclePlus}></FontAwesomeIcon>
                        أضف مقاله
                    </button>
                </div>
            </section>

            {/* add post section 2 - Enhanced with animations */}
            {showSection2 && (
                <section
                    onClick={() => setShowSection2(false)}
                    className='fixed inset-0 bg-black/70 flex justify-center items-center z-[9999] transition-opacity duration-300 animate-fadeIn p-4'
                >
                    <section
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                        className='flex w-full max-w-[570px] p-[15px] flex-col items-start gap-[15px] rounded-[10px] bg-white shadow-md transition-all duration-300 animate-modalIn'
                    >

                        {/* Input Row - Added focus animation */}
                        <div className='flex h-[44px] items-center gap-2 self-stretch'>
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                type="text"
                                className='flex flex-col items-start flex-[1_0_0] p-[12px_15px] rounded-[20px] bg-[#F9F9F9] text-[#757575] text-right font-tajawal text-[14px] font-normal leading-normal focus:outline-none focus:ring-2 focus:ring-[#00844B]/50 transition-all duration-200'
                                placeholder='ما الجديد؟'
                                autoFocus
                            />
                            <img src="profile.jpg" className='w-10 h-10 rounded-full object-cover transition-transform duration-300 hover:scale-105' alt="" />
                        </div>

                        {/* Media Preview - Added animation */}
                        {(image || video) && (
                            <div className='w-full relative animate-fadeIn'>
                                {image && (
                                    <img
                                        src={image}
                                        alt="preview"
                                        className="rounded-lg max-h-60 w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                                    />
                                )}
                                {video && (
                                    <video
                                        controls
                                        src={video}
                                        className="rounded-lg max-h-60 w-full object-cover"
                                    />
                                )}
                                <button
                                    onClick={removeMedia}
                                    className='absolute top-2 left-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300'
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        )}

                        {/* Poll Section - Added animation */}
                        {poll && (
                            <div className='flex flex-col gap-2 w-full animate-slideUp'>
                                {pollOptions.map((opt, idx) => (
                                    <div key={idx} className='relative'>
                                        <input
                                            value={opt}
                                            onChange={(e) => {
                                                const newOptions = [...pollOptions];
                                                newOptions[idx] = e.target.value;
                                                setPollOptions(newOptions);
                                            }}
                                            placeholder={`الخيار ${idx + 1}`}
                                            className="w-full p-2 rounded-md border border-gray-300 text-right focus:outline-none focus:ring-2 focus:ring-[#00844B]/30 transition-all duration-200"
                                        />
                                        {idx > 1 && (
                                            <button
                                                onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                                                className='absolute left-3 top-3 text-gray-400 hover:text-red-500 transition-colors duration-200'
                                            >
                                                <FontAwesomeIcon icon={faTimes} size="xs" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {pollOptions.length < 4 && (
                                    <button
                                        onClick={() => setPollOptions([...pollOptions, ""])}
                                        className="text-[#00844B] text-sm hover:text-[#006D3D] transition-colors duration-200 self-start mt-2"
                                    >
                                        + إضافة خيار
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Actions Row - Enhanced hover effects */}
                        <div className='flex h-[46px] pt-[11px] pl-[0.02px] justify-between items-center self-stretch border-t border-[#EEE] flex-wrap gap-2'>
                            <button
                                onClick={handleShare}
                                className='flex cursor-pointer flex-col justify-center items-center px-[15px] pt-[9px] pb-[10px] rounded-[20px] bg-[#00844B] text-white text-center font-[tajawal] text-[14px] md:text-[16px] font-bold leading-normal transition-all duration-300 hover:bg-[#006D3D] hover:shadow-md hover:scale-[1.02]'
                            >
                                نشر
                            </button>

                            <div
                                onClick={() => setPoll(!poll)}
                                className={`text-[#8A8A8A] cursor-pointer flex items-center gap-1 text-center font-[tajawal] text-[12px] md:text-[14px] font-normal leading-normal transition-all duration-200 ${poll ? 'text-[#00844B]' : 'hover:text-gray-600'}`}
                            >
                                <h1>استطلاع</h1>
                                <FontAwesomeIcon icon={faSquarePollVertical}></FontAwesomeIcon>
                            </div>

                            <label className='text-[#8A8A8A] cursor-pointer flex items-center gap-1 text-center font-[tajawal] text-[12px] md:text-[14px] font-normal leading-normal transition-all duration-200 hover:text-gray-600'>
                                <h1>فيديو</h1>
                                <FontAwesomeIcon icon={faVideo}></FontAwesomeIcon>
                                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                            </label>

                            <label className='text-[#8A8A8A] cursor-pointer flex items-center gap-1 text-center font-[tajawal] text-[12px] md:text-[14px] font-normal leading-normal transition-all duration-200 hover:text-gray-600'>
                                <h1>صورة</h1>
                                <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </section>
                </section>
            )}

            {/* Enhanced Toast Notification */}
            {showToast && (
                <div
                    className={`fixed top-20 md:top-26 right-4 md:right-17 flex w-[220px] md:w-[250px] h-[45px] px-4 justify-center flex-row-reverse items-center gap-2 rounded-lg bg-white shadow-md transition-all duration-500 z-[10000] animate-toastIn`}
                >
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#00844B] text-lg" />
                    <div className='text-black text-[12px] md:text-[14px] font-[400] font-[Tajawal] not-italic leading-normal'>
                        تم ارسال المنشور للادمن
                    </div>
                </div>
            )}

            {/* Animation styles */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalIn {
                    from { 
                        opacity: 0;
                        transform: translateY(20px) scale(0.98);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes toastIn {
                    from { 
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes toastOut {
                    from { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to { 
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-modalIn {
                    animation: modalIn 0.3s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out forwards;
                }
                .animate-toastIn {
                    animation: toastIn 0.3s ease-out forwards;
                }
                .animate-toastOut {
                    animation: toastOut 0.3s ease-in forwards;
                }
                
                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .responsive-flex-col {
                        flex-direction: column;
                    }
                    
                    .responsive-padding {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                }
            `}</style>

            {/* posts section 1 */}
            <section className='mt-10 md:mt-20 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-15 responsive-padding'>
                {/* left section */}
                <section className='flex flex-col gap-4 w-full max-w-[574px]'>

                    <div className='h-auto md:h-[272px] w-full self-stretch rounded-[8px] flex-col p-4 flex items-end bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]'>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-black font-[tajawal] text-[24px] md:text-[28px] font-bold leading-normal'>أحدث الأخبار </h1>
                            <FontAwesomeIcon icon={faNewspaper} className='text-[24px] md:text-[28px] text-gray-500'></FontAwesomeIcon>
                        </div>

                        <p className='text-black font-[poppins] mt-5 text-[18px] md:text-[20px] font-semibold leading-normal '>تطورات اقتصادية مهمة في المنطقة</p>

                        <div className='mt-2 flex flex-row-reverse gap-4 items-center'>
                            <h1 className='flex justify-center items-center gap-2 px-[6px] py-[2px] rounded-[13px] bg-[#B9AF82] text-white font-[poppins] text-[16px] md:text-[20px] font-semibold leading-normal'>إقتصاد</h1>
                            <p className='text-[#8A8A8A] font-poppins text-[12px] font-normal leading-normal'>منذ 30 دقيقة</p>
                        </div>

                        <div className='w-full h-px bg-[rgba(0,0,0,0.15)] mt-3'></div>

                        <p className='text-black font-[poppins] text-[18px] md:text-[20px] font-semibold leading-normal mt-3'>تقنية جديدة تغير المشهد</p>

                        <div className='mt-2 flex flex-row-reverse gap-4 items-center'>
                            <h1 className='flex justify-center items-center gap-2 px-[10px] py-[3px] rounded-[13px] bg-[#2D4639] text-white font-[poppins] text-[16px] md:text-[20px] font-semibold leading-normal'>تقنية</h1>
                            <p className='text-[#8A8A8A] font-poppins text-[12px] font-normal leading-normal'>منذ ساعة</p>
                        </div>
                    </div>

                    <div className='h-auto md:h-[223px] w-full self-stretch flex-col p-4 flex rounded-[8px] bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]'>

                        <div className='flex justify-end'>
                            <div className='text-black font-[tajawal] text-[24px] md:text-[28px] font-bold leading-normal flex items-center gap-2'>
                                <h1>المواضيع الرائجة</h1>
                                <FontAwesomeIcon icon={faFire} className='text-[24px] md:text-[28px] text-gray-500'></FontAwesomeIcon>
                            </div>
                        </div>

                        <div className='flex items-center justify-between mt-6 md:mt-8 '>
                            <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>1.2k</p>
                            <h1 className='text-black font-[poppins] text-[16px] md:text-[20px] font-semibold leading-normal'>التقنية_الجديدة #</h1>
                        </div>

                        <div className='flex items-center justify-between mt-1 '>
                            <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>856</p>
                            <h1 className='text-black font-[poppins] text-[16px] md:text-[20px] font-semibold leading-normal'>الاقتصاد_العربي #</h1>
                        </div>

                        <div className='flex items-center justify-between mt-1 '>
                            <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>623</p>
                            <h1 className='text-black font-[poppins] text-[16px] md:text-[20px] font-semibold leading-normal'>أحداث اليوم #</h1>
                        </div>
                    </div>
                </section>

                {/* right section */}
                <section className='w-full max-w-[723px] h-auto md:h-[510px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0'>
                    <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
                    {/* card content */}
                    <div className='flex-col p-4 flex gap-6 md:gap-8'>
                        <div className='flex items-center justify-end gap-4'>
                            <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                            <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
                        </div>

                        <h1 className='text-black text-right font-poppins text-[18px] md:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

                        <p className='text-[#636262] text-right font-tajawal text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>

                        <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 md:ms-10'>
                            <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'>.....إقراء المزيد</Link>
                            <div className='flex items-center gap-4'>
                                <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                                <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                            </div>
                        </div>
                    </div>
                </section>
            </section>



            {/* last news section 2 */}
            <section className='mt-25 flex flex-col lg:flex-row gap-8 lg:gap-15 justify-center responsive-padding'>
                {/* left section */}
                <section className='flex flex-col w-full lg:w-[401px] items-end gap-[25px] lg:gap-[43px]'>
                    {/* title */}
                    <div className='flex gap-2'>
                        <h1 className='text-black font-[tajawal] text-[24px] lg:text-[28px] font-bold leading-normal'>أختارنا لكم </h1>
                        <div className='w-[4px] lg:w-[5px] h-[32px] lg:h-[42px] rounded-[1px] bg-[#2D4639]'></div>
                    </div>

                    {/* body */}
                    <section className='flex flex-col justify-end items-center self-stretch p-[15px_10px_16px_20px] lg:p-[21px_10px_16px_28px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
                        {/* card 1 */}
                        <div className='flex items-center gap-4 lg:gap-5'>
                            <div className='flex flex-col w-[65%] lg:w-[240px] items-end gap-[12px] lg:gap-[18px]'>
                                <div className='flex gap-2'>
                                    <h1 className='text-black font-[tajawal] text-[12px] lg:text-[14px] font-bold leading-normal'>رياضه</h1>
                                    <div className='w-[3px] lg:w-[5px] h-[18px] lg:h-[24px] rounded-[1px] bg-[#2D4639]'></div>
                                </div>
                                <p className='text-black text-right font-poppins text-[11px] lg:text-[12px] font-normal leading-normal'>فوز منتخب البرتغال بلقب اخر بمساعدة الدون</p>
                            </div>
                            <div className='w-[35%] lg:w-auto'>
                                <img src="card-1.png" className='w-full lg:w-[136px] h-[70px] lg:h-[80px] rounded-[4px] object-cover' alt="sport photo" />
                            </div>
                        </div>
                        <div className='w-full lg:w-[316px] h-[1px] bg-black/15 mt-4 lg:mt-6'></div>

                        {/* card 2 */}
                        <div className='flex items-center gap-4 lg:gap-5 mt-4 lg:mt-5'>
                            <div className='flex flex-col w-[65%] lg:w-[240px] items-end gap-[12px] lg:gap-[18px]'>
                                <div className='flex gap-2'>
                                    <h1 className='text-black font-[tajawal] text-[12px] lg:text-[14px] font-bold leading-normal'>اقتصاد</h1>
                                    <div className='w-[3px] lg:w-[5px] h-[18px] lg:h-[24px] rounded-[1px] bg-[#2D4639]'></div>
                                </div>
                                <p className='text-black text-right font-poppins text-[11px] lg:text-[12px] font-normal leading-normal'>فوز منتخب البرتغال بلقب اخر بمساعدة الدون</p>
                            </div>
                            <div className='w-[35%] lg:w-auto'>
                                <img src="card-2.png" className='w-full lg:w-[136px] h-[70px] lg:h-[80px] rounded-[4px] object-cover' alt="sport photo" />
                            </div>
                        </div>
                        <div className='w-full lg:w-[316px] h-[1px] bg-black/15 mt-4 lg:mt-6'></div>

                        {/* card 3 */}
                        <div className='flex items-center gap-4 lg:gap-5 mt-4 lg:mt-5'>
                            <div className='flex flex-col w-[65%] lg:w-[240px] items-end gap-[12px] lg:gap-[18px]'>
                                <div className='flex gap-2'>
                                    <h1 className='text-black font-[tajawal] text-[12px] lg:text-[14px] font-bold leading-normal'>سياسه</h1>
                                    <div className='w-[3px] lg:w-[5px] h-[18px] lg:h-[24px] rounded-[1px] bg-[#2D4639]'></div>
                                </div>
                                <p className='text-black text-right font-poppins text-[11px] lg:text-[12px] font-normal leading-normal'>فوز منتخب البرتغال بلقب اخر بمساعدة الدون</p>
                            </div>
                            <div className='w-[35%] lg:w-auto'>
                                <img src="card-3.png" className='w-full lg:w-[136px] h-[70px] lg:h-[80px] rounded-[4px] object-cover' alt="sport photo" />
                            </div>
                        </div>
                        <div className='w-full lg:w-[316px] h-[1px] bg-black/15 mt-4 lg:mt-6'></div>

                        {/* card 4 */}
                        <div className='flex items-center gap-4 lg:gap-5 mt-4 lg:mt-5'>
                            <div className='flex flex-col w-[65%] lg:w-[240px] items-end gap-[12px] lg:gap-[18px]'>
                                <div className='flex gap-2'>
                                    <h1 className='text-black font-[tajawal] text-[12px] lg:text-[14px] font-bold leading-normal'>علمي</h1>
                                    <div className='w-[3px] lg:w-[5px] h-[18px] lg:h-[24px] rounded-[1px] bg-[#2D4639]'></div>
                                </div>
                                <p className='text-black text-right font-poppins text-[11px] lg:text-[12px] font-normal leading-normal'>فوز منتخب البرتغال بلقب اخر بمساعدة الدون</p>
                            </div>
                            <div className='w-[35%] lg:w-auto'>
                                <img src="card-4.png" className='w-full lg:w-[136px] h-[70px] lg:h-[80px] rounded-[4px] object-cover' alt="sport photo" />
                            </div>
                        </div>
                        <div className='w-full lg:w-[316px] h-[1px] bg-black/15 mt-4 lg:mt-6'></div>

                        {/* card 5 */}
                        <div className='flex items-center gap-4 lg:gap-5 mt-4 lg:mt-5'>
                            <div className='flex flex-col w-[65%] lg:w-[240px] items-end gap-[12px] lg:gap-[18px]'>
                                <div className='flex gap-2'>
                                    <h1 className='text-black font-[tajawal] text-[12px] lg:text-[14px] font-bold leading-normal'>رياضه</h1>
                                    <div className='w-[3px] lg:w-[5px] h-[18px] lg:h-[24px] rounded-[1px] bg-[#2D4639]'></div>
                                </div>
                                <p className='text-black text-right font-poppins text-[11px] lg:text-[12px] font-normal leading-normal'>فوز منتخب البرتغال بلقب اخر بمساعدة الدون</p>
                            </div>
                            <div className='w-[35%] lg:w-auto'>
                                <img src="card-5.png" className='w-full lg:w-[136px] h-[70px] lg:h-[80px] rounded-[4px] object-cover' alt="sport photo" />
                            </div>
                        </div>
                        <div className='w-full lg:w-[316px] h-[1px] bg-black/15 mt-4 lg:mt-6'></div>

                        {/* card 6 */}
                        <div className='flex items-center gap-4 lg:gap-5 mt-4 lg:mt-5'>
                            <div className='flex flex-col w-[65%] lg:w-[240px] items-end gap-[12px] lg:gap-[18px]'>
                                <div className='flex gap-2'>
                                    <h1 className='text-black font-[tajawal] text-[12px] lg:text-[14px] font-bold leading-normal'>عالم</h1>
                                    <div className='w-[3px] lg:w-[5px] h-[18px] lg:h-[24px] rounded-[1px] bg-[#2D4639]'></div>
                                </div>
                                <p className='text-black text-right font-poppins text-[11px] lg:text-[12px] font-normal leading-normal'>فوز منتخب البرتغال بلقب اخر بمساعدة الدون</p>
                            </div>
                            <div className='w-[35%] lg:w-auto'>
                                <img src="card-6.png" className='w-full lg:w-[136px] h-[70px] lg:h-[80px] rounded-[4px] object-cover' alt="sport photo" />
                            </div>
                        </div>
                    </section>
                </section>

                {/* right section */}
                <section className='flex flex-col w-full lg:w-auto'>
                    {/* title */}
                    <div className='flex justify-between flex-row-reverse'>
                        <div className='flex gap-2'>
                            <h1 className='text-black font-[tajawal] text-[24px] lg:text-[28px] font-bold leading-normal'>اخر الاخبار</h1>
                            <div className='w-[4px] lg:w-[5px] h-[32px] lg:h-[42px] rounded-[1px] bg-[#2D4639]'></div>
                        </div>
                        <Link to={'/more-news'} className='text-[#545454] font-poppins text-[16px] lg:text-[20px] font-semibold leading-normal'>...رؤيه المزيد</Link>
                    </div>

                    {/* posts */}
                    <section className='flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10 mt-6 lg:mt-11'>

                        {/* Column 1 */}
                        <div className='flex flex-col space-y-5 lg:space-y-10 w-full lg:w-[426px]'>
                            <div className="lg:w-[426px] h-[260px] md:h-[340px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
                                <img className="w-full h-[160px] lg:h-[204px] shrink-0 rounded-t-[8px] object-cover" src="post_image.jpg" alt="" />

                                <div className="flex w-full px-4 flex-col items-end gap-3 lg:gap-5 mt-1 lg:mt-4">
                                    {/* title of post */}
                                    <div className='flex items-center gap-2'>
                                        <h1 className='text-black font-[Poppins] text-[16px] lg:text-[20px] not-italic font-semibold leading-normal'>شرق أوسط </h1>
                                        <span className='w-[3px] lg:w-[5px] h-[14px] lg:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)]'></span>
                                    </div>
                                    {/* description */}
                                    <div>
                                        <p className='text-black text-right font-[Tajawal] text-[12px] lg:text-sm not-italic font-normal leading-normal'>...بعد مقتل زاده.. قائد جديد للقوة الجوفضائية بالحرس الثوري</p>
                                    </div>

                                    <div className='flex justify-between w-full'>
                                        <Link to={'/newsdetails'} className='text-[var(--Gray,#8A8A8A)] cursor-pointer ms-2 lg:ms-4 text-right font-[Poppins] text-[11px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1'>
                                            <p>...قراءة المزيد</p>
                                        </Link>

                                        <div className='text-[var(--Gray,#8A8A8A)] text-right font-[Poppins] text-[10px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1 lg:gap-2'>
                                            <p>منذ 3 أيام </p>
                                            <FontAwesomeIcon icon={faClock} className='text-[10px] lg:text-xs' />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-[426px] h-[260px] md:h-[340px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
                                <img className="w-full h-[160px] lg:h-[204px] shrink-0 rounded-t-[8px] object-cover" src="post_image.jpg" alt="" />

                                <div className="flex w-full px-4 flex-col items-end gap-3 lg:gap-5 mt-1 lg:mt-4">
                                    {/* title of post */}
                                    <div className='flex items-center gap-2'>
                                        <h1 className='text-black font-[Poppins] text-[16px] lg:text-[20px] not-italic font-semibold leading-normal'>شرق أوسط </h1>
                                        <span className='w-[3px] lg:w-[5px] h-[14px] lg:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)]'></span>
                                    </div>
                                    {/* description */}
                                    <div>
                                        <p className='text-black text-right font-[Tajawal] text-[12px] lg:text-sm not-italic font-normal leading-normal'>...بعد مقتل زاده.. قائد جديد للقوة الجوفضائية بالحرس الثوري</p>
                                    </div>

                                    <div className='flex justify-between w-full'>
                                        <Link to={'/newsdetails'} className='text-[var(--Gray,#8A8A8A)] cursor-pointer ms-2 lg:ms-4 text-right font-[Poppins] text-[11px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1'>
                                            <p>...قراءة المزيد</p>
                                        </Link>

                                        <div className='text-[var(--Gray,#8A8A8A)] text-right font-[Poppins] text-[10px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1 lg:gap-2'>
                                            <p>منذ 3 أيام </p>
                                            <FontAwesomeIcon icon={faClock} className='text-[10px] lg:text-xs' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className='flex flex-col space-y-5 lg:space-y-10 w-full lg:w-[426px]'>

                            <div className="lg:w-[426px] h-[260px] md:h-[340px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
                                <img className="w-full h-[160px] lg:h-[204px] shrink-0 rounded-t-[8px] object-cover" src="post_image.jpg" alt="" />

                                <div className="flex w-full px-4 flex-col items-end gap-3 lg:gap-5 mt-1 lg:mt-4">
                                    {/* title of post */}
                                    <div className='flex items-center gap-2'>
                                        <h1 className='text-black font-[Poppins] text-[16px] lg:text-[20px] not-italic font-semibold leading-normal'>شرق أوسط </h1>
                                        <span className='w-[3px] lg:w-[5px] h-[14px] lg:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)]'></span>
                                    </div>
                                    {/* description */}
                                    <div>
                                        <p className='text-black text-right font-[Tajawal] text-[12px] lg:text-sm not-italic font-normal leading-normal'>...بعد مقتل زاده.. قائد جديد للقوة الجوفضائية بالحرس الثوري</p>
                                    </div>

                                    <div className='flex justify-between w-full'>
                                        <Link to={'/newsdetails'} className='text-[var(--Gray,#8A8A8A)] cursor-pointer ms-2 lg:ms-4 text-right font-[Poppins] text-[11px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1'>
                                            <p>...قراءة المزيد</p>
                                        </Link>

                                        <div className='text-[var(--Gray,#8A8A8A)] text-right font-[Poppins] text-[10px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1 lg:gap-2'>
                                            <p>منذ 3 أيام </p>
                                            <FontAwesomeIcon icon={faClock} className='text-[10px] lg:text-xs' />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-[426px] h-[260px] md:h-[340px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
                                <img className="w-full h-[160px] lg:h-[204px] shrink-0 rounded-t-[8px] object-cover" src="post_image.jpg" alt="" />

                                <div className="flex w-full px-4 flex-col items-end gap-3 lg:gap-5 mt-1 lg:mt-4">
                                    {/* title of post */}
                                    <div className='flex items-center gap-2'>
                                        <h1 className='text-black font-[Poppins] text-[16px] lg:text-[20px] not-italic font-semibold leading-normal'>شرق أوسط </h1>
                                        <span className='w-[3px] lg:w-[5px] h-[14px] lg:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)]'></span>
                                    </div>
                                    {/* description */}
                                    <div>
                                        <p className='text-black text-right font-[Tajawal] text-[12px] lg:text-sm not-italic font-normal leading-normal'>...بعد مقتل زاده.. قائد جديد للقوة الجوفضائية بالحرس الثوري</p>
                                    </div>

                                    <div className='flex justify-between w-full'>
                                        <Link to={'/newsdetails'} className='text-[var(--Gray,#8A8A8A)] cursor-pointer ms-2 lg:ms-4 text-right font-[Poppins] text-[11px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1'>
                                            <p>...قراءة المزيد</p>
                                        </Link>

                                        <div className='text-[var(--Gray,#8A8A8A)] text-right font-[Poppins] text-[10px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1 lg:gap-2'>
                                            <p>منذ 3 أيام </p>
                                            <FontAwesomeIcon icon={faClock} className='text-[10px] lg:text-xs' />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </section>
                </section>
            </section>

            {/* more news section 3 */}
            <section className='mt-20 mb-5 h-auto md:h-[440px] shrink-0 bg-[#1B1D1E] py-10'>
                <div className='flex justify-center'>
                    <div className='w-[90%] md:w-[1400px] h-[1px] bg-white'></div>
                </div>

                {/* title */}
                <div className='flex justify-between items-center mx-4 md:mx-15 mt-2'>
                    <div className=''>
                        {/* title */}
                        <div className='inline-flex pb-3 flex-col items-end border-b border-white' >
                            <h1 className='text-white text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>اكتشف المزيد من أخبار سوريا</h1>
                        </div>
                    </div>
                    <div className='flex gap-5'>
                        <FontAwesomeIcon
                            className={`cursor-pointer ${currentSlide === 0 ? 'text-white/30' : 'text-white'}`}
                            icon={faAngleLeft}
                            onClick={prevSlide}
                        ></FontAwesomeIcon>
                        <FontAwesomeIcon
                            className={`cursor-pointer ${currentSlide >= moreNewsData.length - cardsToShow ? 'text-white/30' : 'text-white'}`}
                            icon={faAngleRight}
                            onClick={nextSlide}
                        ></FontAwesomeIcon>
                    </div>
                </div>

                {/* main section */}
                <section className='mt-10 ms-4 md:ms-15 overflow-hidden relative'>
                    <div
                        ref={sliderRef}
                        className='flex gap-4 md:gap-7 transition-transform duration-300 ease-in-out'
                        style={{ transform: `translateX(-${currentSlide * cardWidth}px)` }}
                    >
                        {moreNewsData.map((item) => (
                            <div key={item.id} className='flex w-[220px] md:w-[261px] h-[270px] md:h-[297px] flex-col items-end gap-2 flex-shrink-0'>
                                <img src={item.image} className='h-[140px] md:h-[160px] shrink-0 self-stretch rounded-[4px] object-cover' alt="" />
                                <h1 className='text-white text-right font-[Poppins] text-[16px] md:text-[20px] not-italic font-semibold leading-normal'>{item.title}</h1>
                                <div className="w-[90%] md:w-[80%]">
                                    <p className="text-[#8A8A8A] text-right font-[Tajawal] text-[12px] md:text-[14px] not-italic font-normal leading-4 self-stretch">
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </section>


        </div>
    );
}