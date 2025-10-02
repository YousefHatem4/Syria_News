import React, { useState, useEffect } from 'react'
import style from './NewsDetails.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faEye, faCalendar, faComment } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

export default function NewsDetails() {
    // State management for comment section
    const [isLiked, setIsLiked] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [comments, setComments] = useState([
        {
            id: 1,
            author: 'أحمد محمد',
            text: 'هذا الموضوع في غايه الخطوره و اري من وجه نظري ان يجب النظر فيه جيدا حتي لا تسوء الاحوال',
            avatar: 'profile.jpg'
        },
        {
            id: 2,
            author: 'محمد علي',
            text: 'هذا الموضوع في غايه الخطوره و اري من وجه نظري ان يجب النظر فيه جيدا حتي لا تسوء الاحوال',
            avatar: 'profile.jpg'
        },
        {
            id: 3,
            author: 'سارة أحمد',
            text: 'هذا الموضوع في غايه الخطوره و اري من وجه نظري ان يجب النظر فيه جيدا حتي لا تسوء الاحوال',
            avatar: 'profile.jpg'
        }
    ]);

    // Toggle like functionality
    const handleLikeToggle = () => {
        setIsLiked(!isLiked);
    };

    // Toggle show all comments
    const handleShowAllComments = () => {
        setShowAllComments(!showAllComments);
    };

    // Toggle comment input
    const handleCommentInputToggle = () => {
        setShowCommentInput(!showCommentInput);
    };

    // Handle comment submission
    const handleCommentSubmit = () => {
        if (commentText.trim() !== '') {
            const newComment = {
                id: comments.length + 1,
                author: 'أنت',
                text: commentText,
                avatar: 'profile.jpg'
            };
            setComments([newComment, ...comments]);
            setCommentText('');
            setShowCommentInput(false);

            // Show toast notification
            setShowToast(true);

            // Hide toast after 3 seconds
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    };

    return <>
        {/* Enhanced Toast Notification */}
        {showToast && (
            <div
                className={`fixed top-20 md:top-10 right-4 md:right-19 flex w-[220px] md:w-[250px] h-[45px] px-4 justify-center flex-row-reverse items-center gap-2 rounded-lg bg-white shadow-md transition-all duration-500 z-[10000] animate-toastIn`}
            >
                <FontAwesomeIcon icon={faCheckCircle} className="text-[#00844B] text-lg" />
                <div className='text-black text-[12px] md:text-[14px] font-[400] font-[Tajawal] not-italic leading-normal'>
                    تم إضافة التعليق بنجاح
                </div>
            </div>
        )}

        <section className='bg-[linear-gradient(164deg,#004025_-0.36%,rgba(255,255,255,0.80)_34.44%,rgba(0,64,37,0.50)_101.6%)] h-auto relative flex items-center flex-col pb-10 pt-10 md:pt-0'>
            {/* breadcrumb navigation */}
            <section className='flex items-center gap-2 sm:gap-3 absolute top-30 sm:top-24 md:top-28 lg:top-32 xl:top-35 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-15'>
                <h1 className='font-poppins text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-normal text-white'>الصفحه الرئيسه </h1>
                <FontAwesomeIcon icon={faAngleRight} className='text-white text-xs sm:text-sm md:text-base'></FontAwesomeIcon>
                <h1 className='font-poppins text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-normal text-[#00341E]'>تفاصيل الخبر </h1>
            </section>

            {/* main section */}
            <section className='w-[90%] sm:w-[85%] md:w-[90%] lg:w-[95%] xl:w-[1377px] max-w-[1377px] pb-[20px] sm:pb-[25px] md:pb-[31px] rounded-[15px] sm:rounded-[20px] 
bg-[linear-gradient(151deg,#2D4639_-1.74%,#1B1D1E_105.33%)] 
shadow-[0_25px_50px_0_rgba(0,132,75,0.25),0_0_0_0_rgba(233,200,130,0.25)] 
backdrop-blur-[5px] mt-32 sm:mt-40 md:mt-48 lg:mt-52 xl:mt-55'>
                <img src="post_image_2.jpg" className='h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[372px] w-full self-stretch rounded-t-[15px] sm:rounded-t-[20px] object-cover' alt="" />

                {/* content section 1*/}
                <div className='p-4 sm:p-5 md:p-6 lg:p-5 flex flex-col items-end gap-4 sm:gap-5 md:gap-6 lg:gap-7'>
                    {/* title badge */}
                    <div className='w-[70px] sm:w-[75px] md:w-[81px] flex items-center justify-center h-[35px] sm:h-[38px] md:h-[41px] rounded-[30px] px-[18px] sm:px-[20px] md:px-[24px] py-[6px] sm:py-[7px] md:py-[8px] bg-[#00844B] opacity-100 shadow-[0px_4px_15px_0px_#004025]'>
                        <h1 className='font-cairo font-bold text-[12px] sm:text-[13px] md:text-[14.4px] leading-[20px] sm:leading-[22px] md:leading-[24.48px] tracking-[0%] text-right align-middle text-white'>عاجل</h1>
                    </div>

                    <h1 className='font-poppins font-bold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] xl:text-[48px] leading-[100%] tracking-[0%] text-right align-middle text-white '>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>

                    {/* reacts */}
                    <div className='flex flex-wrap items-center gap-3 sm:gap-4 md:gap-4'>
                        <div className="w-auto flex flex-row-reverse justify-between gap-1 items-center font-cairo font-normal text-[12px] sm:text-[13px] md:text-[14.4px] leading-[20px] sm:leading-[22px] md:leading-[24.48px] text-[#E9C882]">
                            <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                            <span>100+</span>
                            <span>تفاعلات</span>
                        </div>

                        <div className="w-auto flex flex-row-reverse justify-between gap-1 items-center font-cairo font-normal text-[12px] sm:text-[13px] md:text-[14.4px] leading-[20px] sm:leading-[22px] md:leading-[24.48px] text-[#E9C882]">
                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            <span>100+</span>
                            <span>مشاهدة</span>
                        </div>

                        <div className="w-auto flex flex-row-reverse justify-between gap-1 items-center font-cairo font-normal text-[12px] sm:text-[13px] md:text-[14.4px] leading-[20px] sm:leading-[22px] md:leading-[24.48px] text-[#E9C882]">
                            <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>
                            <span>منذ ساعتين</span>
                        </div>
                    </div>
                </div>

                {/* content section 2 */}
                <div className='flex flex-col gap-4 sm:gap-5 md:gap-6 items-center justify-center mt-4 sm:mt-5 md:mt-6 px-4 sm:px-6 md:px-8 lg:px-0'>
                    <p className='w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[930px] font-poppins font-semibold text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[150%] text-right align-middle text-white opacity-100'>في تطورات مفاجئة للأحداث، شهدت المنطقة تحولات كبيرة في المشهد السياسي والاقتصادي خلال الساعات
                        الأخيرة، مما أثر بشكل مباشر على الحياة اليومية للمواطنين وأسواق المال المحلية</p>

                    <div className='w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[802px] min-h-[120px] sm:min-h-[130px] md:min-h-[140px] lg:min-h-[154.33px] rounded-[12px] sm:rounded-[15px] border-l-[3px] sm:border-l-[4px] border-[#00844B] bg-[rgba(255,255,255,0.09)] flex p-[20px] sm:p-[24px] md:p-[28px] lg:p-[32px_32px_32px_36px] flex-col items-start gap-2 border-r-[3px] sm:border-r-[4px] '>
                        <h1 className='text-white text-right font-poppins text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] not-italic font-semibold leading-normal'>من جهة أخرى، شهدت أسواق المال ردود أفعال متباينة، حيث ارتفعت أسعار بعض السلع الأساسية بنسبة وصلت إلى %10، بينما شهدت العملة المحلية استقرارًا نسبيًا أمام العملات الأجنبية</h1>
                    </div>

                    <div className='w-full sm:w-[95%] md:w-[70%] lg:w-[60%] xl:w-[479px] h-[120px] sm:h-[130px] md:h-[140px] lg:h-[143.33px] rounded-[12px] sm:rounded-[15px] border-l-[3px] sm:border-l-[4px] border-[#00844B] border-r-[3px] sm:border-r-[4px] flex flex-col items-center justify-center gap-2'>
                        <img src="article_details.jpg" className='w-full h-full object-cover rounded-[12px] sm:rounded-[15px]' alt="" />
                    </div>

                    <p className='w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[930px] font-poppins font-semibold text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[150%] text-right align-middle text-white opacity-100'>
                        وفقًا لمصادرنا الموثوقة، فإن هذه التطورات تأتي بعد سلسلة من الاجتماعات المغلقة بين ممثلي الدول الكبرى،
                        والتي استمرت لأيام في العاصمة. الخبراء يعتبرون هذه الخطوة نقطة تحول في تاريخ المنطقة
                    </p>

                    <div className='w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[802px] min-h-[120px] sm:min-h-[130px] md:min-h-[140px] lg:min-h-[154.33px] rounded-[12px] sm:rounded-[15px] border-l-[3px] sm:border-l-[4px] border-[#00844B] bg-[rgba(255,255,255,0.09)] flex p-[20px] sm:p-[24px] md:p-[28px] lg:p-[32px_32px_32px_36px] flex-col items-start gap-2 border-r-[3px] sm:border-r-[4px] '>
                        <h1 className='text-white text-right font-poppins text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] not-italic font-semibold leading-normal'>في الشارع المحلي، عبر المواطنون عن مشاعر مختلطة بين التفاؤل والحذر. محمد أحمد، أحد سكان العاصمة، قال:
                            "نأمل أن تؤدي هذه التطورات إلى تحسين الأوضاع المعيشية التي أصبحت صعبة في الفترة الأخيرة"</h1>
                    </div>

                    {/* Comments section */}
                    <div className='flex flex-col gap-1 w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[809px]'>
                        {/*show comments header section*/}
                        <div className='w-full flex flex-col sm:flex-row items-center justify-between min-h-[72px] rounded-t-[8px] pt-[20px] sm:pt-[26px] pr-[15px] sm:pr-[20px] pb-[20px] sm:pb-[26px] pl-[15px] sm:pl-[20px] gap-3 sm:gap-2 bg-[#2D4639] shadow-[0_4px_4px_0_#00000040] opacity-100'>
                            <button
                                onClick={handleShowAllComments}
                                className='w-full sm:w-[120px] cursor-pointer h-[34px] flex items-center justify-center pt-[8px] pr-[10px] pb-[8px] pl-[10px] gap-2 rounded-[25px] border border-[#FFFFFF26] font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right text-[#FFFFFF] opacity-100 hover:bg-[#00844B] transition-all duration-300'>
                                {showAllComments ? 'إخفاء التعليقات' : '....إقراء كل التعليقات'}
                            </button>
                            <div className='flex items-center gap-3 sm:gap-4'>
                                <div
                                    onClick={handleShowAllComments}
                                    className='flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200'>
                                    <h1 className='font-tajawal font-normal text-[13px] sm:text-[14px] leading-[100%] tracking-[0%] text-right text-[#E9C882]'>تعليقات </h1>
                                    <FontAwesomeIcon icon={faComment} className='text-[#E9C882]'></FontAwesomeIcon>
                                </div>

                                <div
                                    onClick={handleLikeToggle}
                                    className='flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200'>
                                    <h1 className='font-tajawal font-normal text-[13px] sm:text-[14px] leading-[100%] tracking-[0%] text-right text-[#E9C882]'>اعجبني </h1>
                                    <FontAwesomeIcon
                                        icon={faThumbsUp}
                                        className={`${isLiked ? 'text-[#E9C882]' : 'text-white'} transition-colors duration-300`}
                                    ></FontAwesomeIcon>
                                </div>
                            </div>
                        </div>

                        {/* my add comment section */}
                        <div className='w-full min-h-[67px] border-t border-t-[#000000] p-[13px] gap-2 bg-[#2D4639] opacity-100 flex flex-col sm:flex-row items-center justify-between'>
                            {!showCommentInput ? (
                                <button
                                    onClick={handleCommentInputToggle}
                                    className='w-full sm:w-[104px] h-[34px] gap-2 rounded-[12px] border border-[#8A8A8A] p-2 font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFFAD] opacity-100 hover:border-[#00844B] transition-all duration-300'>
                                    ......إضف تعليقك
                                </button>
                            ) : (
                                <div className='flex items-center gap-2 w-full sm:flex-1'>
                                    <button
                                        onClick={handleCommentSubmit}
                                        className='px-3 sm:px-4 h-[34px] rounded-[12px] bg-[#00844B] text-white font-poppins text-[11px] sm:text-[12px] hover:bg-[#00a05d] transition-all duration-300'>
                                        إرسال
                                    </button>
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                        className='flex-1 h-[34px] p-[8px] gap-2 rounded-[12px] border border-[#8A8A8A] bg-transparent font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF] focus:border-[#00844B] focus:outline-none transition-all duration-300'
                                        placeholder='....اكتب تعليقك'
                                    />
                                </div>
                            )}

                            <div className='flex items-center gap-3 mt-2 sm:mt-0'>
                                <h1 className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF]'>أنت</h1>
                                <img src="profile.jpg" className='w-[35px] h-[35px] sm:w-[41px] sm:h-[41px] rounded-[41px] object-cover' alt="profile picture" />
                            </div>
                        </div>

                        {/* Display first comment (always visible) */}
                        <div className='w-full min-h-[67px] border-t border-t-[#000000] p-[13px] gap-2 bg-[#2D4639] opacity-100 flex flex-col sm:flex-row items-start sm:items-center justify-between'>
                            <h1 className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[150%] sm:leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF] flex-1 mb-2 sm:mb-0'>{comments[0].text}</h1>
                            <div className='flex items-center gap-3 self-end sm:self-auto'>
                                <h1 className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF]'>{comments[0].author}</h1>
                                <img src={comments[0].avatar} className='w-[35px] h-[35px] sm:w-[41px] sm:h-[41px] rounded-[41px] object-cover' alt="profile picture" />
                            </div>
                        </div>

                        {/* Display all other comments when toggled */}
                        {showAllComments && comments.slice(1).map((comment) => (
                            <div key={comment.id} className='w-full min-h-[67px] border-t border-t-[#000000] p-[13px] gap-2 bg-[#2D4639] opacity-100 flex flex-col sm:flex-row items-start sm:items-center justify-between'>
                                <h1 className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[150%] sm:leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF] flex-1 mb-2 sm:mb-0'>{comment.text}</h1>
                                <div className='flex items-center gap-3 self-end sm:self-auto'>
                                    <h1 className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF]'>{comment.author}</h1>
                                    <img src={comment.avatar} className='w-[35px] h-[35px] sm:w-[41px] sm:h-[41px] rounded-[41px] object-cover' alt="profile picture" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* posts that related to that post */}
                <section className='px-4 sm:px-6 md:px-8 lg:px-10 mt-8 sm:mt-9 md:mt-10'>
                    {/* title */}
                    <div className='flex flex-col items-end'>
                        <h1 className='font-Tajawal font-bold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] leading-[100%] tracking-[0%] text-right align-middle text-[#E9C882]'>أخبار ذات صلة</h1>
                        <div className='w-[140px] sm:w-[150px] md:w-[160px] lg:w-[165px] h-[3px] rounded-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882] opacity-100 mt-3 sm:mt-4'></div>
                    </div>

                    {/* other posts */}
                    <section className='flex flex-col gap-6 sm:gap-8 lg:gap-7 mt-6 sm:mt-8 md:mt-10'>
                        {/* first row */}
                        <div className='flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-5 lg:gap-5'>
                            {/* Post Card 1 */}
                            <section className='w-full max-w-[500px] md:max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
                                <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
                                <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
                                    <div className='flex items-center justify-end gap-4'>
                                        <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                                        <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
                                    </div>
                                    <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>
                                    <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>
                                    <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                                        <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal  transition-all duration-300'>.....إقراء المزيد</Link>
                                        <div className='flex items-center gap-4'>
                                            <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                                            <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Post Card 2 */}
                            <section className='w-full max-w-[500px] md:max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
                                <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
                                <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
                                    <div className='flex items-center justify-end gap-4'>
                                        <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                                        <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
                                    </div>
                                    <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>
                                    <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>
                                    <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                                        <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal   transition-all duration-300'>.....إقراء المزيد</Link>
                                        <div className='flex items-center gap-4'>
                                            <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                                            <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Post Card 3 */}
                            <section className='w-full max-w-[500px] md:max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] hidden lg:block'>
                                <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
                                <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
                                    <div className='flex items-center justify-end gap-4'>
                                        <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                                        <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
                                    </div>
                                    <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>
                                    <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>
                                    <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                                        <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal   transition-all duration-300'>.....إقراء المزيد</Link>
                                        <div className='flex items-center gap-4'>
                                            <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                                            <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* second row */}
                        <div className='flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-5'>
                            {/* Post Card 4 */}
                            <section className='w-full max-w-[500px] md:max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
                                <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
                                <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
                                    <div className='flex items-center justify-end gap-4'>
                                        <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                                        <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
                                    </div>
                                    <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>
                                    <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>
                                    <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                                        <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal   transition-all duration-300'>.....إقراء المزيد</Link>
                                        <div className='flex items-center gap-4'>
                                            <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                                            <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Post Card 5 */}
                            <section className='w-full max-w-[500px] md:max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
                                <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
                                <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
                                    <div className='flex items-center justify-end gap-4'>
                                        <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                                        <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
                                    </div>
                                    <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>
                                    <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>
                                    <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                                        <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal  transition-all duration-300'>.....إقراء المزيد</Link>
                                        <div className='flex items-center gap-4'>
                                            <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                                            <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Post Card 6 */}
                            <section className='w-full max-w-[500px] md:max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] hidden lg:block'>
                                <img src="post.jpg" className='w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover' alt="post_Photo" />
                                <div className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
                                    <div className='flex items-center justify-end gap-4'>
                                        <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>منذ ساعتين </p>
                                        <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>عاجل</h1>
                                    </div>
                                    <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal'>تطورات مهمة في الأحداث الجارية والتي تؤثر على المنطقة</h1>
                                    <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal'>نص المقال يحتوي على تفاصيل مهمة حول الأحداث الجارية والتطورات الأخيرة التي تؤثر على المنطقة والعالم. يتضمن هذا المقال تحليلاً شاملاً للوضع الحالي</p>
                                    <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 '>
                                        <Link to={'/newsdetails'} className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal  transition-all duration-300'>.....إقراء المزيد</Link>
                                        <div className='flex items-center gap-4'>
                                            <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>أحمد محمد </h1>
                                            <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                </section>
            </section>
        </section>
    </>
}
