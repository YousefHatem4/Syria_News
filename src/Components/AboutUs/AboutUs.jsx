import React from 'react'
import style from './AboutUs.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faRocket, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

/**
 * AboutUs Component - Displays company information, mission, vision, story, and team members
 * Features:
 * - Responsive design with three breakpoints (desktop, tablet, mobile)
 * - Gradient backgrounds and modern UI design
 * - Team member profiles with social links
 * - Arabic language support with right-to-left layout
 */
export default function AboutUs() {
    return (
        <>
            {/* ============ LARGE SCREEN (DESKTOP) LAYOUT ============ */}
            {/* Hidden on mobile and tablet, visible on large screens (lg:flex hidden) */}
            <section className='[background:linear-gradient(to_bottom_right,#004025_0%,#FFFFFFCC_50%,#004025_100%)] min-h-[190vh] lg:flex items-center justify-center hidden'>
                {/* Main Container Card with Gradient Background */}
                <div className='w-[923px] h-[1240.66px] [background:linear-gradient(152deg,#2D4639_0%,#1B1D1E_103.17%)] [box-shadow:0_0_0_0_rgba(233,200,130,0.25),0_25px_50px_0_rgba(0,132,75,0.25)] backdrop-blur-[5px] rounded-2xl md:mt-35 '>
                    <section className='flex flex-col items-center justify-center py-15'>

                        {/* ============ MAIN TITLE SECTION ============ */}
                        <div className='relative'>
                            {/* Main "About Us" Title */}
                            <h1 className='font-bold text-[#E9C882] text-[48px] my-cairo-text [text-shadow:0px_2px_10px_#E9C8824D]'>من نحن</h1>
                            {/* Gradient underline decoration */}
                            <div className='absolute w-[150px] h-[4px] start-1 top-23 rounded-sm [background:linear-gradient(90deg,#00844B_0%,#E9C882_100%)]'></div>
                        </div>

                        {/* Subtitle Description */}
                        <p className='mt-10 text-[#FFF] my-cairo-text '>رحلة عبر الكون المعرفي لنقل الحقيقة بكل وضوح وشفافية</p>

                        {/* ============ MISSION, VISION & STORY BOXES ============ */}
                        <section className='mt-13'>

                            {/* Box 1: Vision */}
                            <div className='w-[802px] h-[143.33px] rounded-[15px] border-l-[4px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col pe-8 py-8 text-right '>
                                <div className='flex gap-3 justify-end'>
                                    <h1 className='text-[#E9C882] text-right my-Poppins-text  text-[20px] not-italic font-semibold leading-normal'>رؤيتنا</h1>
                                    {/* Vision Icon */}
                                    <FontAwesomeIcon icon={faBullseye} className="text-[#00844B] text-right font-[Font_Awesome_5_Free] text-[24px] not-italic font-black leading-[24px]" />
                                </div>
                                {/* Vision Description */}
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text mt-3  text-[14px] not-italic font-normal leading-normal'>
                                    نطمح لأن نكون النجم اللامع في سماء الصحافة الرقمية، حيث نقدم المحتوى بجودة عالية ودقة متناهية
                                </p>
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text  text-[14px] not-italic font-normal leading-normal'>
                                    .لنكون وجهتك الأولى للأخبار الموثوقة والتحليلات العميقة
                                </p>
                            </div>

                            {/* Box 2: Mission */}
                            <div className='w-[802px] h-[143.33px] rounded-[15px] border-l-[4px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col pe-8 py-8 text-right mt-8'>
                                <div className='flex gap-3 justify-end'>
                                    <h1 className='text-[#E9C882] text-right my-Poppins-text  text-[20px] not-italic font-semibold leading-normal'>مهمتنا</h1>
                                    {/* Mission Icon */}
                                    <FontAwesomeIcon icon={faRocket} className="text-[#00844B] text-right font-[Font_Awesome_5_Free] text-[24px] not-italic font-black leading-[24px]" />
                                </div>
                                {/* Mission Description */}
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text mt-3  text-[14px] not-italic font-normal leading-normal'>
                                    مهمتنا هي إضاءة الطريق أمام القارئ العربي بمحتوى هادف، نكسر فيه حواجز التضليل ونبني جسور
                                </p>
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text  text-[14px] not-italic font-normal leading-normal'>
                                    .الثقة مع جمهورنا عبر الشفافية والمهنية العالية في الطرح والتحليل
                                </p>
                            </div>

                            {/* Box 3: Story */}
                            <div className='w-[802px] h-[143.33px] rounded-[15px] border-l-[4px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col pe-8 py-8 text-right mt-8'>
                                <div className='flex gap-3 justify-end'>
                                    <h1 className='text-[#E9C882] text-right my-Poppins-text  text-[20px] not-italic font-semibold leading-normal'>قصتنا</h1>
                                    {/* Story Icon */}
                                    <FontAwesomeIcon icon={faClockRotateLeft} className="text-[#00844B] text-right font-[Font_Awesome_5_Free] text-[24px] not-italic font-black leading-[24px]" />
                                </div>
                                {/* Story Description */}
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text mt-3  text-[14px] not-italic font-normal leading-normal'>
                                    كفكرة صغيرة بين مجموعة من الصحفيين الشباب، وتطورنا عبر السنين لنصبح منصة
                                </p>
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text  text-[14px] not-italic font-normal leading-normal'>
                                    .إعلامية رائدة تضم فريقًا من المحترفين في مختلف التخصصات الصحفية والتقنية
                                </p>
                            </div>
                        </section>

                        {/* ============ TEAM MEMBERS SECTION ============ */}
                        {/* Section Title */}
                        <div className='relative mt-15'>
                            <h1 className='text-[#E9C882] text-center  text-[28.8px] not-italic font-bold leading-normal my-cairo-text'>طاقمنا</h1>
                            {/* Gradient underline decoration */}
                            <div className='absolute w-[100px] h-[3px] -left-1 top-14 rounded-sm [background:linear-gradient(90deg,#00844B_0%,#E9C882_100%)]'></div>
                        </div>

                        {/* Team Members Cards */}
                        <div className='mt-15 flex gap-9'>

                            {/* Team Member 1: Sarah Khaled - Reporter */}
                            <div className='w-[246px] h-[292px] rounded-[15px] border-t-[2px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center  '>
                                {/* Profile Image with golden border */}
                                <img
                                    src="photo_1.jpg"
                                    className='w-[120px] h-[120px] shrink-0 rounded-[60px] border-[3px] border-[#E9C882] object-top object-cover [box-shadow:0_5px_15px_0_rgba(0,0,0,0.2)]'
                                    alt="صورة ساره خالد"
                                />
                                {/* Member Name */}
                                <h1 className='text-[#E9C882] text-center my-cairo-text text-[20.8px] not-italic font-bold leading-normal mt-5'>ساره خالد</h1>
                                {/* Member Position */}
                                <p className='text-[#B9AF82] text-center my-cairo-text text-[14.4px] not-italic font-normal leading-normal mt-4'>مراسلة</p>
                                {/* Social Media Links */}
                                <div className='flex gap-2 mt-4'>
                                    {/* LinkedIn Icon with hover effect */}
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="text-white cursor-pointer hover:text-[#1da1f2] transition-colors duration-300"
                                    />
                                    {/* Twitter Icon with hover effect */}
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="text-white cursor-pointer hover:text-[#3b5998] transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            {/* Team Member 2: Mahmoud Ahmed - Economic Editor */}
                            <div className='w-[246px] h-[292px] rounded-[15px] border-t-[2px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center  '>
                                <img
                                    src="photo_2.jpg"
                                    className='w-[120px] h-[120px] shrink-0 rounded-[60px] border-[3px] border-[#E9C882] object-top object-cover [box-shadow:0_5px_15px_0_rgba(0,0,0,0.2)]'
                                    alt="صورة محمود أحمد"
                                />
                                <h1 className='text-[#E9C882] text-center my-cairo-text text-[20.8px] not-italic font-bold leading-normal mt-5'>محمود أحمد </h1>
                                <p className='text-[#B9AF82] text-center my-cairo-text text-[14.4px] not-italic font-normal leading-normal mt-4'>محرر اقتصادي</p>
                                <div className='flex gap-2 mt-4'>
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="text-white cursor-pointer hover:text-[#1da1f2] transition-colors duration-300"
                                    />
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="text-white cursor-pointer hover:text-[#3b5998] transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            {/* Team Member 3: Mohammed Ahmed - Editor in Chief */}
                            <div className='w-[246px] h-[292px] rounded-[15px] border-t-[2px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center  '>
                                <img
                                    src="photo_3.jpg"
                                    className='w-[120px] h-[120px] shrink-0 rounded-[60px] border-[3px] border-[#E9C882] object-top object-cover [box-shadow:0_5px_15px_0_rgba(0,0,0,0.2)]'
                                    alt="صورة محمد أحمد"
                                />
                                <h1 className='text-[#E9C882] text-center my-cairo-text text-[20.8px] not-italic font-bold leading-normal mt-5'>محمد أحمد</h1>
                                <p className='text-[#B9AF82] text-center my-cairo-text text-[14.4px] not-italic font-normal leading-normal mt-4'>رئيس التحرير</p>
                                <div className='flex gap-2 mt-4'>
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="text-white cursor-pointer hover:text-[#1da1f2] transition-colors duration-300"
                                    />
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="text-white cursor-pointer hover:text-[#3b5998] transition-colors duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>

            {/* ============ MEDIUM SCREEN (TABLET) LAYOUT ============ */}
            {/* Hidden on mobile and desktop, visible on medium screens (lg:hidden md:flex hidden) */}
            <section className='[background:linear-gradient(to_bottom_right,#004025_0%,#FFFFFFCC_50%,#004025_100%)] min-h-[165vh] lg:hidden md:flex hidden items-center justify-center'>
                {/* Main Container Card - Adjusted for tablet */}
                <div className='w-[90%] max-w-[700px] h-auto py-10 [background:linear-gradient(152deg,#2D4639_0%,#1B1D1E_103.17%)] [box-shadow:0_0_0_0_rgba(233,200,130,0.25),0_25px_50px_0_rgba(0,132,75,0.25)] backdrop-blur-[5px] rounded-2xl mt-20'>
                    <section className='flex flex-col items-center justify-center px-5'>

                        {/* Main Title Section - Tablet Size */}
                        <div className='relative'>
                            <h1 className='font-bold text-[#E9C882] text-[38px] my-cairo-text [text-shadow:0px_2px_10px_#E9C8824D]'>من نحن</h1>
                            {/* Smaller underline for tablet */}
                            <div className='absolute w-[120px] h-[4px] start-1 top-18 rounded-sm [background:linear-gradient(90deg,#00844B_0%,#E9C882_100%)]'></div>
                        </div>
                        <p className='mt-8 text-[#FFF] my-cairo-text text-center'>رحلة عبر الكون المعرفي لنقل الحقيقة بكل وضوح وشفافية</p>

                        {/* Mission, Vision & Story Boxes - Tablet Layout */}
                        <section className='mt-10 w-full'>

                            {/* Box 1: Vision - Tablet */}
                            <div className='w-full h-auto rounded-[15px] border-l-[4px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col pe-5 py-6 text-right '>
                                <div className='flex gap-3 justify-end'>
                                    <h1 className='text-[#E9C882] text-right my-Poppins-text text-[18px] not-italic font-semibold leading-normal'>رؤيتنا</h1>
                                    {/* Smaller icon for tablet */}
                                    <FontAwesomeIcon icon={faBullseye} className="text-[#00844B] text-right font-[Font_Awesome_5_Free] text-[22px] not-italic font-black leading-[24px]" />
                                </div>
                                {/* Combined text for better tablet layout */}
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text mt-3 text-[13px] not-italic font-normal leading-normal'>
                                    نطمح لأن نكون النجم اللامع في سماء الصحافة الرقمية، حيث نقدم المحتوى بجودة عالية ودقة متناهية لنكون وجهتك الأولى للأخبار الموثوقة والتحليلات العميقة.
                                </p>
                            </div>

                            {/* Box 2: Mission - Tablet */}
                            <div className='w-full h-auto rounded-[15px] border-l-[4px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col pe-5 py-6 text-right mt-6'>
                                <div className='flex gap-3 justify-end'>
                                    <h1 className='text-[#E9C882] text-right my-Poppins-text text-[18px] not-italic font-semibold leading-normal'>مهمتنا</h1>
                                    <FontAwesomeIcon icon={faRocket} className="text-[#00844B] text-right font-[Font_Awesome_5_Free] text-[22px] not-italic font-black leading-[24px]" />
                                </div>
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text mt-3 text-[13px] not-italic font-normal leading-normal'>
                                    مهمتنا هي إضاءة الطريق أمام القارئ العربي بمحتوى هادف، نكسر فيه حواجز التضليل ونبني جسور الثقة مع جمهورنا عبر الشفافية والمهنية العالية في الطرح والتحليل.
                                </p>
                            </div>

                            {/* Box 3: Story - Tablet */}
                            <div className='w-full h-auto rounded-[15px] border-l-[4px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col pe-5 py-6 text-right mt-6'>
                                <div className='flex gap-3 justify-end'>
                                    <h1 className='text-[#E9C882] text-right my-Poppins-text text-[18px] not-italic font-semibold leading-normal'>قصتنا</h1>
                                    <FontAwesomeIcon icon={faClockRotateLeft} className="text-[#00844B] text-right font-[Font_Awesome_5_Free] text-[22px] not-italic font-black leading-[24px]" />
                                </div>
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text mt-3 text-[13px] not-italic font-normal leading-normal'>
                                    كفكرة صغيرة بين مجموعة من الصحفيين الشباب، وتطورنا عبر السنين لنصبح منصة إعلامية رائدة تضم فريقًا من المحترفين في مختلف التخصصات الصحفية والتقنية.
                                </p>
                            </div>
                        </section>

                        {/* Team Members Section - Tablet */}
                        <div className='relative mt-12'>
                            <h1 className='text-[#E9C882] text-center text-[25px] not-italic font-bold leading-normal my-cairo-text'>طاقمنا</h1>
                            {/* Smaller underline for tablet */}
                            <div className='absolute w-[80px] h-[3px] -left-0.5 top-14 rounded-sm [background:linear-gradient(90deg,#00844B_0%,#E9C882_100%)]'></div>
                        </div>

                        {/* Team Members Cards - Tablet Layout with flex-wrap */}
                        <div className='mt-10 flex flex-wrap justify-center gap-6 w-full'>

                            {/* Team Member 1 - Tablet Size */}
                            <div className='w-[200px] h-[260px] rounded-[15px] border-t-[2px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center py-5'>
                                {/* Smaller profile image for tablet */}
                                <img
                                    src="photo_1.jpg"
                                    className='w-[100px] h-[100px] shrink-0 rounded-[50px] border-[3px] border-[#E9C882] object-top object-cover [box-shadow:0_5px_15px_0_rgba(0,0,0,0.2)]'
                                    alt="صورة ساره خالد"
                                />
                                <h1 className='text-[#E9C882] text-center my-cairo-text text-[18px] not-italic font-bold leading-normal mt-4'>ساره خالد</h1>
                                <p className='text-[#B9AF82] text-center my-cairo-text text-[13px] not-italic font-normal leading-normal mt-2'>مراسلة</p>
                                <div className='flex gap-2 mt-3'>
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="text-white cursor-pointer hover:text-[#1da1f2] transition-colors duration-300"
                                    />
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="text-white cursor-pointer hover:text-[#3b5998] transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            {/* Team Member 2 - Tablet Size */}
                            <div className='w-[200px] h-[260px] rounded-[15px] border-t-[2px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center py-5'>
                                <img
                                    src="photo_2.jpg"
                                    className='w-[100px] h-[100px] shrink-0 rounded-[50px] border-[3px] border-[#E9C882] object-top object-cover [box-shadow:0_5px_15px_0_rgba(0,0,0,0.2)]'
                                    alt="صورة محمود أحمد"
                                />
                                <h1 className='text-[#E9C882] text-center my-cairo-text text-[18px] not-italic font-bold leading-normal mt-4'>محمود أحمد</h1>
                                <p className='text-[#B9AF82] text-center my-cairo-text text-[13px] not-italic font-normal leading-normal mt-2'>محرر اقتصادي</p>
                                <div className='flex gap-2 mt-3'>
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="text-white cursor-pointer hover:text-[#1da1f2] transition-colors duration-300"
                                    />
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="text-white cursor-pointer hover:text-[#3b5998] transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            {/* Team Member 3 - Tablet Size */}
                            <div className='w-[200px] h-[260px] rounded-[15px] border-t-[2px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center py-5'>
                                <img
                                    src="photo_3.jpg"
                                    className='w-[100px] h-[100px] shrink-0 rounded-[50px] border-[3px] border-[#E9C882] object-top object-cover [box-shadow:0_5px_15px_0_rgba(0,0,0,0.2)]'
                                    alt="صورة محمد أحمد"
                                />
                                <h1 className='text-[#E9C882] text-center my-cairo-text text-[18px] not-italic font-bold leading-normal mt-4'>محمد أحمد</h1>
                                <p className='text-[#B9AF82] text-center my-cairo-text text-[13px] not-italic font-normal leading-normal mt-2'>رئيس التحرير</p>
                                <div className='flex gap-2 mt-3'>
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="text-white cursor-pointer hover:text-[#1da1f2] transition-colors duration-300"
                                    />
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="text-white cursor-pointer hover:text-[#3b5998] transition-colors duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>

            {/* ============ SMALL SCREEN (MOBILE) LAYOUT ============ */}
            {/* Hidden on tablet and desktop, visible on small screens (md:hidden flex) */}
            <section className='[background:linear-gradient(to_bottom_right,#004025_0%,#FFFFFFCC_50%,#004025_100%)] min-h-[190vh] md:hidden flex items-center justify-center'>
                {/* Main Container Card - Mobile Optimized */}
                <div className='w-[90%] max-w-[500px] h-auto py-8 [background:linear-gradient(152deg,#2D4639_0%,#1B1D1E_103.17%)] [box-shadow:0_0_0_0_rgba(233,200,130,0.25),0_25px_50px_0_rgba(0,132,75,0.25)] backdrop-blur-[5px] rounded-2xl mt-30 mb-15'>
                    <section className='flex flex-col items-center justify-center px-4'>

                        {/* Main Title Section - Mobile Size */}
                        <div className='relative'>
                            <h1 className='font-bold text-[#E9C882] text-[32px] my-cairo-text [text-shadow:0px_2px_10px_#E9C8824D]'>من نحن</h1>
                            {/* Smallest underline for mobile */}
                            <div className='absolute w-[100px] h-[3px] start-1 top-15 rounded-sm [background:linear-gradient(90deg,#00844B_0%,#E9C882_100%)]'></div>
                        </div>
                        {/* Smaller text for mobile */}
                        <p className='mt-6 text-[#FFF] my-cairo-text text-center text-[14px]'>رحلة عبر الكون المعرفي لنقل الحقيقة بكل وضوح وشفافية</p>

                        {/* Mission, Vision & Story Boxes - Mobile Layout */}
                        <section className='mt-8 w-full'>

                            {/* Box 1: Vision - Mobile */}
                            <div className='w-full h-auto rounded-[12px] border-l-[3px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col pe-4 py-5 text-right '>
                                <div className='flex gap-2 justify-end'>
                                    <h1 className='text-[#E9C882] text-right my-Poppins-text text-[16px] not-italic font-semibold leading-normal'>رؤيتنا</h1>
                                    {/* Smallest icon for mobile */}
                                    <FontAwesomeIcon icon={faBullseye} className="text-[#00844B] text-right font-[Font_Awesome_5_Free] text-[20px] not-italic font-black leading-[24px]" />
                                </div>
                                {/* Smaller text for mobile readability */}
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text mt-2 text-[12px] not-italic font-normal leading-normal'>
                                    نطمح لأن نكون النجم اللامع في سماء الصحافة الرقمية، حيث نقدم المحتوى بجودة عالية ودقة متناهية لنكون وجهتك الأولى للأخبار الموثوقة والتحليلات العميقة.
                                </p>
                            </div>

                            {/* Box 2: Mission - Mobile */}
                            <div className='w-full h-auto rounded-[12px] border-l-[3px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col pe-4 py-5 text-right mt-5'>
                                <div className='flex gap-2 justify-end'>
                                    <h1 className='text-[#E9C882] text-right my-Poppins-text text-[16px] not-italic font-semibold leading-normal'>مهمتنا</h1>
                                    <FontAwesomeIcon icon={faRocket} className="text-[#00844B] text-right font-[Font_Awesome_5_Free] text-[20px] not-italic font-black leading-[24px]" />
                                </div>
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text mt-2 text-[12px] not-italic font-normal leading-normal'>
                                    مهمتنا هي إضاءة الطريق أمام القارئ العربي بمحتوى هادف، نكسر فيه حواجز التضليل ونبني جسور الثقة مع جمهورنا عبر الشفافية والمهنية العالية في الطرح والتحليل.
                                </p>
                            </div>

                            {/* Box 3: Story - Mobile */}
                            <div className='w-full h-auto rounded-[12px] border-l-[3px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col pe-4 py-5 text-right mt-5'>
                                <div className='flex gap-2 justify-end'>
                                    <h1 className='text-[#E9C882] text-right my-Poppins-text text-[16px] not-italic font-semibold leading-normal'>قصتنا</h1>
                                    <FontAwesomeIcon icon={faClockRotateLeft} className="text-[#00844B] text-right font-[Font_Awesome_5_Free] text-[20px] not-italic font-black leading-[24px]" />
                                </div>
                                <p className='text-[rgba(255,255,255,0.8)] text-right my-Tajawal-text mt-2 text-[12px] not-italic font-normal leading-normal'>
                                    كفكرة صغيرة بين مجموعة من الصحفيين الشباب، وتطورنا عبر السنين لنصبح منصة إعلامية رائدة تضم فريقًا من المحترفين في مختلف التخصصات الصحفية والتقنية.
                                </p>
                            </div>
                        </section>

                        {/* Team Members Section - Mobile */}
                        <div className='relative mt-10'>
                            <h1 className='text-[#E9C882] text-center text-[22px] not-italic font-bold leading-normal my-cairo-text'>طاقمنا</h1>
                            {/* Smallest underline for mobile */}
                            <div className='absolute w-[70px] h-[2px] -left-0.5 top-10 rounded-sm [background:linear-gradient(90deg,#00844B_0%,#E9C882_100%)]'></div>
                        </div>

                        {/* Team Members Cards - Mobile Layout with responsive sizing */}
                        <div className="flex flex-wrap justify-center gap-6 mt-10">

                            {/* Team Member 1 - Mobile with responsive sizing */}
                            <div className='w-[220px] h-[300px] sm:w-[180px] sm:h-[240px] rounded-[12px] border-t-[2px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center py-4'>
                                {/* Profile image with responsive sizing */}
                                <img
                                    src="photo_1.jpg"
                                    className='w-[110px] h-[110px] rounded-full border-[2px] border-[#E9C882] object-top object-cover [box-shadow:0_5px_15px_0_rgba(0,0,0,0.2)]'
                                    alt="صورة ساره خالد"
                                />
                                <h1 className='text-[#E9C882] text-center my-cairo-text text-[18px] font-bold mt-3'>ساره خالد</h1>
                                <p className='text-[#B9AF82] text-center my-cairo-text text-[14px] font-normal mt-1'>مراسلة</p>
                                {/* Larger gap for better touch targets on mobile */}
                                <div className='flex gap-3 mt-2'>
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="text-white cursor-pointer hover:text-[#1da1f2] transition-colors duration-300"
                                    />
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="text-white cursor-pointer hover:text-[#3b5998] transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            {/* Team Member 2 - Mobile with responsive sizing */}
                            <div className='w-[220px] h-[300px] sm:w-[180px] sm:h-[240px] rounded-[12px] border-t-[2px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center py-4'>
                                <img
                                    src="photo_2.jpg"
                                    className='w-[110px] h-[110px] rounded-full border-[2px] border-[#E9C882] object-top object-cover [box-shadow:0_5px_15px_0_rgba(0,0,0,0.2)]'
                                    alt="صورة أحمد علي"
                                />
                                <h1 className='text-[#E9C882] text-center my-cairo-text text-[18px] font-bold mt-3'>أحمد علي</h1>
                                <p className='text-[#B9AF82] text-center my-cairo-text text-[14px] font-normal mt-1'>مصور</p>
                                <div className='flex gap-3 mt-2'>
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="text-white cursor-pointer hover:text-[#1da1f2] transition-colors duration-300"
                                    />
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="text-white cursor-pointer hover:text-[#3b5998] transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            {/* Team Member 3 - Mobile with responsive sizing */}
                            <div className='w-[220px] h-[300px] sm:w-[180px] sm:h-[240px] rounded-[12px] border-t-[2px] border-[#00844B] bg-[rgba(255,255,255,0.05)] flex flex-col items-center justify-center py-4'>
                                <img
                                    src="photo_3.jpg"
                                    className='w-[110px] h-[110px] rounded-full border-[2px] border-[#E9C882] object-top object-cover [box-shadow:0_5px_15px_0_rgba(0,0,0,0.2)]'
                                    alt="صورة منى حسن"
                                />
                                <h1 className='text-[#E9C882] text-center my-cairo-text text-[18px] font-bold mt-3'>منى حسن</h1>
                                <p className='text-[#B9AF82] text-center my-cairo-text text-[14px] font-normal mt-1'>محررة</p>
                                <div className='flex gap-3 mt-2'>
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="text-white cursor-pointer hover:text-[#1da1f2] transition-colors duration-300"
                                    />
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="text-white cursor-pointer hover:text-[#3b5998] transition-colors duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </>
    )
}