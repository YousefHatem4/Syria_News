import React, { useEffect, useState, useRef, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCirclePlus, faSquarePollVertical, faCamera, faVideo, faCheckCircle, faTimes, faClock, faAngleLeft, faAngleRight, faLandmark, faGavel, faFutbol, faMasksTheater, faCheck, faPlus, faPen, faBars } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper, faUser, faCalendar, faClock as faclock } from '@fortawesome/free-regular-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { userContext } from '../Context/userContext';
import { BASE_URL } from '../../App'

export default function Home() {
    const [showSection2, setShowSection2] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [articleTitle, setArticleTitle] = useState('');
    const [articleBio, setArticleBio] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef(null);
    let { userToken } = useContext(userContext);
    const navigate = useNavigate();

    // API Posts State - Section 1
    const [section1Posts, setSection1Posts] = useState([]);
    const [section1Loading, setSection1Loading] = useState(true);
    const [section1Error, setSection1Error] = useState(null);
    const [currentSection1Index, setCurrentSection1Index] = useState(0);

    // API Posts State - Section 2
    const [section2Posts, setSection2Posts] = useState([]);
    const [section2Loading, setSection2Loading] = useState(true);
    const [section2Error, setSection2Error] = useState(null);
    const [section2CurrentPage, setSection2CurrentPage] = useState(0);
    const [section2TotalPages, setSection2TotalPages] = useState(0);

    // Image loading states
    const [imageLoadingStates, setImageLoadingStates] = useState({});

    // New state for article sections
    const [articleSections, setArticleSections] = useState([
        { id: 1, title: '', content: '', image: null, imagePreview: null }
    ]);

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

    // Fetch Section 1 Posts (Latest Posts - multiple for rotation)
    const fetchSection1Posts = async () => {
        try {
            setSection1Loading(true);
            setSection1Error(null);

            const response = await axios.get(`${BASE_URL}articles/status`, {
                params: {
                    page: 0,
                    size: 10, // Fetch more posts for rotation
                    status: 'approved',
                    sort: 'desc'
                },
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json',
                } : {
                    'Accept': 'application/json',
                }
            });

            if (response.data && Array.isArray(response.data.content)) {
                setSection1Posts(response.data.content);

                // Initialize image loading states
                const initialLoadingStates = {};
                response.data.content.forEach((post, index) => {
                    if (post.imageUrl) {
                        initialLoadingStates[post.id] = true;
                    }
                });
                setImageLoadingStates(initialLoadingStates);
            }
        } catch (err) {
            console.error('Error fetching section 1 posts:', err);
            setSection1Error('فشل في تحميل المنشورات');
        } finally {
            setSection1Loading(false);
        }
    };

    // Fetch Section 2 Posts (4 posts per page)
    const fetchSection2Posts = async (page = 0) => {
        try {
            setSection2Loading(true);
            setSection2Error(null);

            const response = await axios.get(`${BASE_URL}articles/status`, {
                params: {
                    page: page,
                    size: 4,
                    status: 'approved',
                    sort: 'desc'
                },
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json',
                } : {
                    'Accept': 'application/json',
                }
            });

            if (response.data && Array.isArray(response.data.content)) {
                setSection2Posts(response.data.content);
                setSection2TotalPages(response.data.totalPages || 1);

                // Initialize image loading states for section 2
                const newLoadingStates = { ...imageLoadingStates };
                response.data.content.forEach((post) => {
                    if (post.imageUrl && !newLoadingStates[post.id]) {
                        newLoadingStates[post.id] = true;
                    }
                });
                setImageLoadingStates(newLoadingStates);
            }
        } catch (err) {
            console.error('Error fetching section 2 posts:', err);
            setSection2Error('فشل في تحميل المنشورات');
        } finally {
            setSection2Loading(false);
        }
    };

    // Handle image load
    const handleImageLoad = (postId) => {
        setImageLoadingStates(prev => ({
            ...prev,
            [postId]: false
        }));
    };

    // Handle image error
    const handleImageError = (postId) => {
        setImageLoadingStates(prev => ({
            ...prev,
            [postId]: false
        }));
    };

    // Rotate section 1 posts
    useEffect(() => {
        if (section1Posts.length > 1) {
            const interval = setInterval(() => {
                setCurrentSection1Index(prevIndex =>
                    prevIndex === section1Posts.length - 1 ? 0 : prevIndex + 1
                );
            }, 10000); // Change every 10 seconds

            return () => clearInterval(interval);
        }
    }, [section1Posts]);

    // Format date helper
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            const diffMinutes = Math.ceil(diffTime / (1000 * 60));

            if (diffMinutes < 60) {
                return `منذ ${diffMinutes} دقيقة`;
            } else if (diffHours < 24) {
                return `منذ ${diffHours} ساعة`;
            } else if (diffDays === 1) {
                return 'منذ يوم';
            } else if (diffDays < 7) {
                return `منذ ${diffDays} أيام`;
            } else {
                return date.toLocaleDateString('ar-EG');
            }
        } catch (error) {
            return 'تاريخ غير معروف';
        }
    };

    // Pagination for Section 2
    const handleSection2PageChange = (newPage) => {
        setSection2CurrentPage(newPage);
        fetchSection2Posts(newPage);
    };

    // Generate pagination buttons
    const getPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 3;

        if (section2TotalPages <= maxButtons) {
            for (let i = 0; i < section2TotalPages; i++) {
                buttons.push(i);
            }
        } else {
            if (section2CurrentPage === 0) {
                buttons.push(0, 1, 2);
            } else if (section2CurrentPage === section2TotalPages - 1) {
                buttons.push(section2TotalPages - 3, section2TotalPages - 2, section2TotalPages - 1);
            } else {
                buttons.push(section2CurrentPage - 1, section2CurrentPage, section2CurrentPage + 1);
            }
        }

        return buttons;
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}categories`);
            if (response.data && Array.isArray(response.data)) {
                setCategories(response.data);
                if (response.data.length > 0) {
                    setSelectedCategory(response.data[0].name);
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([
                { name: 'الفنون', nameAr: 'الفنون', description: 'Arts', descriptionAr: 'الفنون' },
                { name: 'الرياضة', nameAr: 'الرياضة', description: 'Sports', descriptionAr: 'الرياضة' },
                { name: 'الاقتصاد', nameAr: 'الاقتصاد', description: 'Economy', descriptionAr: 'الاقتصاد' },
                { name: 'السياسة', nameAr: 'السياسة', description: 'Politics', descriptionAr: 'السياسة' },
            ]);
        }
    };

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

    useEffect(() => {
        fetchCategories();
        fetchSection1Posts();
        fetchSection2Posts(0);
    }, []);

    // Handle image upload
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle section image upload
    const handleSectionImageUpload = (sectionId, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setArticleSections(sections =>
                sections.map(section =>
                    section.id === sectionId
                        ? { ...section, image: file, imagePreview: URL.createObjectURL(file) }
                        : section
                )
            );
        }
    };

    // Handle section field change
    const handleSectionChange = (sectionId, field, value) => {
        setArticleSections(sections =>
            sections.map(section =>
                section.id === sectionId
                    ? { ...section, [field]: value }
                    : section
            )
        );
    };

    // Add new section
    const addNewSection = () => {
        const newSection = {
            id: Date.now(),
            title: '',
            content: '',
            image: null,
            imagePreview: null
        };
        setArticleSections([...articleSections, newSection]);
    };

    // Remove section
    const removeSection = (sectionId) => {
        if (articleSections.length > 1) {
            setArticleSections(sections => sections.filter(section => section.id !== sectionId));
        }
    };

    // Remove section image
    const removeSectionImage = (sectionId) => {
        setArticleSections(sections =>
            sections.map(section =>
                section.id === sectionId
                    ? { ...section, image: null, imagePreview: null }
                    : section
            )
        );
    };

    // Get category name by ID
    const getCategoryName = (categoryName) => {
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.nameAr || category.name : 'غير محدد';
    };

    // Submit article sections to API
    const submitArticleSections = async (articleId) => {
        if (!userToken) {
            console.error('User not authenticated');
            return false;
        }

        try {
            for (const section of articleSections) {
                if (section.title && section.content) {
                    const formData = new FormData();
                    formData.append('header', section.title);
                    formData.append('content', section.content);

                    if (section.image) {
                        formData.append('file', section.image);
                    }

                    const response = await axios.post(`${BASE_URL}sections/${articleId}`, formData, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    console.log('Section submitted successfully:', response.data);
                }
            }
            return true;
        } catch (error) {
            console.error('Error submitting article sections:', error);
            return false;
        }
    };

    // Submit article to API
    const submitArticle = async () => {
        if (!userToken) {
            console.error('User not authenticated');
            return false;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('header', articleTitle);
            formData.append('bio', articleBio);
            formData.append('categoryName', selectedCategory);

            if (coverImage) {
                formData.append('file', coverImage);
            }

            const response = await axios.post(`${BASE_URL}articles`, formData, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            const articleId = response.data.id;

            if (articleId) {
                await submitArticleSections(articleId);
            }

            return true;
        } catch (error) {
            console.error('Error submitting article:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentStep === 1) {
            if (!articleTitle || !coverImage || !selectedCategory) {
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            const hasValidSection = articleSections.some(section => section.title && section.content);
            if (!hasValidSection) {
                return;
            }
            setCurrentStep(3);
        } else if (currentStep === 3) {
            const success = await submitArticle();
            if (success) {
                setShowToast(true);
                handleClose();
            }
        }
    };

    // Handle close modal
    const handleClose = () => {
        setShowSection2(false);
        setCurrentStep(1);
        setArticleTitle('');
        setArticleBio('');
        setCoverImage(null);
        setImagePreview(null);
        if (categories.length > 0) {
            setSelectedCategory(categories[0].name);
        }
        setArticleSections([{ id: 1, title: '', content: '', image: null, imagePreview: null }]);
    };

    // Handle previous step
    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className='bg-[linear-gradient(164deg,#004025_-0.36%,rgba(255,255,255,0.80)_34.44%,rgba(0,64,37,0.50)_101.6%)] h-auto pb-25'>
            {/* add post section */}
            <section className='flex justify-center items-center pt-30 md:pt-50 px-4'>
                <div
                    onClick={() => {
                        if (!userToken) {
                            navigate('/login');
                        } else {
                            setShowSection2(true);
                        }
                    }}
                    className='flex w-full max-w-[407px] cursor-pointer items-center justify-between md:gap-[123px] px-[6px] py-[5px] rounded-[12px] border border-black/30 transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:scale-[1.02]'
                >
                    <p className='text-white font-poppins text-[12px] font-normal leading-normal truncate'>......اكتب عن الخبر الذي تريده </p>
                    <button className='flex p-2 cursor-pointer justify-center items-center gap-2 rounded-lg bg-[#00844B] text-white font-[tajawal] text-[14px] md:text-[16px] font-bold leading-normal transition-all duration-300 hover:bg-[#006D3D] hover:shadow-md'>
                        <FontAwesomeIcon className='text-white' icon={faCirclePlus}></FontAwesomeIcon>
                        أضف مقاله
                    </button>
                </div>
            </section>

            {/* Modal code remains the same - keeping it as is for brevity */}
            {showSection2 && (
                <section
                    onClick={handleClose}
                    className='fixed inset-0 bg-black/70 flex justify-center items-start z-[9999] transition-opacity duration-300 animate-fadeIn p-4 overflow-y-auto'
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    <style jsx="true" global="true">{`
                        section::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    <section
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                        className='flex w-full max-w-[1024px] my-8 p-4 md:p-7 flex-col items-start gap-4 md:gap-6 rounded-[16px] bg-white shadow-lg transition-all duration-300 animate-modalIn'
                    >
                        {/* title */}
                        <div className='w-full '>
                            {currentStep === 3 ? <>
                                <div>
                                    <h1 className='font-tajawal font-bold text-[28px] leading-[100%] tracking-[0%] text-center align-middle text-[#1B1D1E]'>مراجعة المقال</h1>
                                    <p className='font-poppins font-normal text-[11.9px] leading-[21px] mt-3 tracking-[0%] text-center align-middle text-[#6B7280]'>راجع مقالك قبل النشر وتأكد من صحة جميع المعلومات</p>
                                </div>
                            </> :
                                <>
                                    <h1 className='font-[Tajawal] font-bold text-[20px] md:text-[28px] leading-[100%] tracking-[0%] text-right align-middle text-[#1B1D1E]'>
                                        إضافة مقال جديد
                                    </h1>
                                </>}
                        </div>

                        {/* processing steps */}
                        <div className="w-full mt-4 md:mt-10 flex items-center justify-center ">
                            {/* step 3 */}
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 3 ? 'bg-[#00844B]' : 'bg-[#D1D5DB]'}`}>
                                    {currentStep > 3 ? (
                                        <FontAwesomeIcon icon={faCheck} className="text-white text-2xl" />
                                    ) : currentStep === 3 ? (
                                        <h1 className="font-Inter font-semibold text-[12px] md:text-[13.6px] leading-[24px] tracking-[0%] align-middle text-white">3</h1>
                                    ) : (
                                        <h1 className="font-Inter font-semibold text-[12px] md:text-[13.6px] leading-[24px] tracking-[0%] align-middle text-white">3</h1>
                                    )}
                                </div>
                                <h1 className={`font-Inter font-medium text-[10px] md:text-[12px] leading-[20px] tracking-[0%] text-center align-middle ${currentStep >= 3 ? 'text-[#1B1D1E]' : 'text-[#6B7280]'} opacity-100 mt-1 whitespace-nowrap`}>
                                    المراجعة والنشر
                                </h1>
                            </div>

                            {/* line */}
                            <div className="w-[100px] md:w-[384.56px] h-1 opacity-100 transition-all duration-300 bg-[#D1D5DB]"></div>

                            {/* step 2 */}
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 2 ? 'bg-[#00844B]' : 'bg-[#D1D5DB]'}`}>
                                    {currentStep > 2 ? (
                                        <FontAwesomeIcon icon={faCheck} className="text-white text-2xl" />
                                    ) : currentStep === 2 ? (
                                        <h1 className="font-Inter font-semibold text-[12px] md:text-[13.6px] leading-[24px] tracking-[0%] align-middle text-white">2</h1>
                                    ) : (
                                        <h1 className="font-Inter font-semibold text-[12px] md:text-[13.6px] leading-[24px] tracking-[0%] align-middle text-white">2</h1>
                                    )}
                                </div>
                                <h1 className={`font-Inter font-medium text-[10px] md:text-[12px] leading-[20px] tracking-[0%] text-center align-middle ${currentStep >= 2 ? 'text-[#1B1D1E]' : 'text-[#6B7280]'} opacity-100 mt-1 whitespace-nowrap`}>
                                    محتوى المقال
                                </h1>
                            </div>

                            {/* line */}
                            <div className="w-[100px] md:w-[384.56px] h-1 opacity-100 transition-all duration-300 bg-[#D1D5DB]"></div>

                            {/* step 1 */}
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 1 ? 'bg-[#00844B]' : 'bg-[#D1D5DB]'}`}>
                                    {currentStep > 1 ? (
                                        <FontAwesomeIcon icon={faCheck} className="text-white text-2xl" />
                                    ) : currentStep === 1 ? (
                                        <h1 className="font-Inter font-semibold text-[12px] md:text-[13.6px] leading-[24px] tracking-[0%] align-middle text-white">1</h1>
                                    ) : (
                                        <h1 className="font-Inter font-semibold text-[12px] md:text-[13.6px] leading-[24px] tracking-[0%] align-middle text-white">1</h1>
                                    )}
                                </div>
                                <h1 className="font-Inter font-semibold text-[10px] md:text-[12px] leading-[20px] tracking-[0%] text-center align-middle text-[#1B1D1E] opacity-100 mt-1 whitespace-nowrap">
                                    المعلومات الأساسية
                                </h1>
                            </div>
                        </div>

                        {/* form content */}
                        <form className='w-full mt-4 md:mt-7' onSubmit={handleSubmit}>
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <div className='w-full animate-slideUp'>
                                    {/* title of post */}
                                    <div className='text-right w-full'>
                                        <label htmlFor="title_post" className="font-Inter font-semibold text-[15px] md:text-[17px] leading-[30px] tracking-[0%] text-[#1B1D1E]">
                                            عنوان المقال
                                        </label>
                                        <input
                                            type="text"
                                            id="title_post"
                                            value={articleTitle}
                                            onChange={(e) => setArticleTitle(e.target.value)}
                                            className="w-full mt-3 md:mt-6 h-[45px] md:h-[49.6px] rounded-[12px] border border-[#D1D5DB] text-right px-4 py-3 opacity-100 bg-white font-[Inter] font-normal text-[14px] md:text-[16px] leading-[24px] tracking-[0%] placeholder:text-[#CCCCCC] text-black focus:outline-none focus:border-[#00844B] transition-colors"
                                            placeholder="ادخل عنوان المقال"
                                            required
                                        />
                                    </div>

                                    {/* BIO INPUT - NEW */}
                                    <div className='text-right w-full mt-6 md:mt-8'>
                                        <label htmlFor="bio_post" className="font-Inter font-semibold text-[15px] md:text-[17px] leading-[30px] tracking-[0%] text-[#1B1D1E]">
                                            نبذة عن المقال
                                        </label>
                                        <textarea
                                            id="bio_post"
                                            value={articleBio}
                                            onChange={(e) => setArticleBio(e.target.value)}
                                            className="w-full mt-3 md:mt-6 h-[80px] md:h-[90px] rounded-[12px] border border-[#D1D5DB] text-right px-4 py-3 opacity-100 bg-white font-[Inter] font-normal text-[14px] md:text-[16px] leading-[24px] tracking-[0%] placeholder:text-[#CCCCCC] text-black focus:outline-none focus:border-[#00844B] transition-colors resize-none"
                                            placeholder="اكتب نبذة مختصرة عن المقال"
                                        />
                                    </div>

                                    {/* input of image */}
                                    <div className="text-right mt-6 md:mt-8 w-full">
                                        <label className="block font-Inter font-semibold text-[15px] md:text-[17px] leading-[30px] tracking-[0%] text-[#1B1D1E]">
                                            صورة الغلاف
                                        </label>
                                        <label
                                            htmlFor="dropzone-file"
                                            className="mt-3 md:mt-5 flex flex-col items-center justify-center w-full h-[120px] md:h-[143.2px] rounded-[12px] border border-dashed border-[#D1D5DB] opacity-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            {imagePreview ? (
                                                <div className="relative w-full h-full">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[12px]" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setCoverImage(null);
                                                            setImagePreview(null);
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 25.2L10.172 16.028C10.9221 15.2781 11.9393 14.8568 13 14.8568C14.0607 14.8568 15.0779 15.2781 15.828 16.028L25 25.2M21 21.2L24.172 18.028C24.9221 17.2781 25.9393 16.8568 27 16.8568C28.0607 16.8568 29.0779 17.2781 29.828 18.028L33 21.2M21 9.19995H21.02M5 33.2H29C30.0609 33.2 31.0783 32.7785 31.8284 32.0284C32.5786 31.2782 33 30.2608 33 29.2V5.19995C33 4.13909 32.5786 3.12167 31.8284 2.37152C31.0783 1.62138 30.0609 1.19995 29 1.19995H5C3.93913 1.19995 2.92172 1.62138 2.17157 2.37152C1.42143 3.12167 1 4.13909 1 5.19995V29.2C1 30.2608 1.42143 31.2782 2.17157 32.0284C2.92172 32.7785 3.93913 33.2 5 33.2Z" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>

                                                    <p className="mt-3 font-Inter font-normal text-[11px] md:text-[11.9px] leading-[20px] tracking-[0%] text-center align-middle text-[#6B7280]">
                                                        اسحب وأفلت الصورة هنا أو انقر للاختيار
                                                    </p>
                                                    <p className="font-Inter font-normal text-[9px] md:text-[10.2px] leading-[16px] tracking-[0%] text-center align-middle text-[#9CA3AF]">
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                required={!coverImage}
                                            />
                                        </label>
                                    </div>

                                    {/* category */}
                                    <div className='text-right flex flex-col mt-6 md:mt-8 w-full'>
                                        <label htmlFor="category" className="font-Inter font-semibold text-[15px] md:text-[17px] leading-[30px] tracking-[0%]">
                                            فئة المقال
                                        </label>

                                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-3 md:mt-5'>
                                            {categories.map((category, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(category.name)}
                                                    className={`w-full h-[90px] md:h-[103.2px] rounded-[12px] border ${selectedCategory === category.name ? 'border-[#00844B] bg-[#00844B]/5' : 'border-[#E5E7EB]'} opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:border-[#00844B] hover:bg-[#00844B]/5`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCategory === category.name ? 'bg-[#00844B] text-white' : 'bg-gray-200 text-gray-600'} transition-colors`}>
                                                        <FontAwesomeIcon icon={faNewspaper} className="text-lg" />
                                                    </div>
                                                    <h1 className={`font-Inter font-medium text-[12px] md:text-[13.6px] leading-[24px] tracking-[0%] text-center align-middle ${selectedCategory === category.name ? 'text-[#00844B]' : 'text-[#374151]'} transition-colors`}>
                                                        {category.nameAr || category.name}
                                                    </h1>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Article Content */}
                            {currentStep === 2 && (
                                <div className='w-full animate-slideUp flex flex-col items-center justify-center gap-5'>
                                    {articleSections.map((section, index) => (
                                        <div key={section.id} className='w-full max-w-[896px] rounded-[24px] bg-white p-[24px] gap-[16px] shadow-[0px_2px_4px_-1px_#0000001A,0px_1px_6px_-1px_#00000024] opacity-100 transition-all duration-300 hover:shadow-lg'>
                                            <div className='flex flex-row justify-between items-center'>
                                                <div className='flex gap-2'>
                                                    {articleSections.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSection(section.id)}
                                                            className='text-red-500 hover:text-red-700 transition-colors'
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                    )}
                                                </div>
                                                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.07329 15.7778C1.53857 15.7778 1.08081 15.5874 0.700026 15.2067C0.319239 14.8259 0.128845 14.3681 0.128845 13.8334C0.128845 13.2987 0.319239 12.8409 0.700026 12.4601C1.08081 12.0793 1.53857 11.8889 2.07329 11.8889C2.60801 11.8889 3.06577 12.0793 3.44655 12.4601C3.82734 12.8409 4.01773 13.2987 4.01773 13.8334C4.01773 14.3681 3.82734 14.8259 3.44655 15.2067C3.06577 15.5874 2.60801 15.7778 2.07329 15.7778ZM7.90662 15.7778C7.3719 15.7778 6.91415 15.5874 6.53336 15.2067C6.15257 14.8259 5.96218 14.3681 5.96218 13.8334C5.96218 13.2987 6.15257 12.8409 6.53336 12.4601C6.91415 12.0793 7.3719 11.8889 7.90662 11.8889C8.44135 11.8889 8.8991 12.0793 9.27989 12.4601C9.66067 12.8409 9.85107 13.2987 9.85107 13.8334C9.85107 14.3681 9.66067 14.8259 9.27989 15.2067C8.8991 15.5874 8.44135 15.7778 7.90662 15.7778ZM2.07329 9.9445C1.53857 9.9445 1.08081 9.75411 0.700026 9.37332C0.319239 8.99253 0.128845 8.53478 0.128845 8.00005C0.128845 7.46533 0.319239 7.00758 0.700026 6.62679C1.08081 6.246 1.53857 6.05561 2.07329 6.05561C2.60801 6.05561 3.06577 6.246 3.44655 6.62679C3.82734 7.00758 4.01773 7.46533 4.01773 8.00005C4.01773 8.53478 3.82734 8.99253 3.44655 9.37332C3.06577 9.75411 2.60801 9.9445 2.07329 9.9445ZM7.90662 9.9445C7.3719 9.9445 6.91415 9.75411 6.53336 9.37332C6.15257 8.99253 5.96218 8.53478 5.96218 8.00005C5.96218 7.46533 6.15257 7.00758 6.53336 6.62679C6.91415 6.246 7.3719 6.05561 7.90662 6.05561C8.44135 6.05561 8.8991 6.246 9.27989 6.62679C9.66067 7.00758 9.85107 7.46533 9.85107 8.00005C9.85107 8.53478 9.66067 8.99253 9.27989 9.37332C8.8991 9.75411 8.44135 9.9445 7.90662 9.9445ZM2.07329 4.11117C1.53857 4.11117 1.08081 3.92077 0.700026 3.53998C0.319239 3.1592 0.128845 2.70144 0.128845 2.16672C0.128845 1.632 0.319239 1.17424 0.700026 0.793457C1.08081 0.41267 1.53857 0.222277 2.07329 0.222277C2.60801 0.222277 3.06577 0.41267 3.44655 0.793457C3.82734 1.17424 4.01773 1.632 4.01773 2.16672C4.01773 2.70144 3.82734 3.1592 3.44655 3.53998C3.06577 3.92077 2.60801 4.11117 2.07329 4.11117ZM7.90662 4.11117C7.3719 4.11117 6.91415 3.92077 6.53336 3.53998C6.15257 3.1592 5.96218 2.70144 5.96218 2.16672C5.96218 1.632 6.15257 1.17424 6.53336 0.793457C6.91415 0.41267 7.3719 0.222277 7.90662 0.222277C8.44135 0.222277 8.8991 0.41267 9.27989 0.793457C9.66067 1.17424 9.85107 1.632 9.85107 2.16672C9.85107 2.70144 9.66067 3.1592 9.27989 3.53998C8.8991 3.92077 8.44135 4.11117 7.90662 4.11117Z" fill="#6B7280" />
                                                </svg>
                                            </div>

                                            {/* title */}
                                            <h1 className='font-poppins font-semibold text-[19px] leading-[30px] tracking-[0%] align-middle text-[#1B1D1E] text-right mt-5'>
                                                محتوى المقال {articleSections.length > 1 ? `- القسم ${index + 1}` : ''}
                                            </h1>

                                            {/* form inputs */}
                                            <div className='mt-4'>
                                                {/* input 1 */}
                                                <div className='text-right'>
                                                    <label htmlFor={`add_sections_${section.id}`} className="mb-3 font-poppins font-normal text-[12px] leading-[21px] tracking-[0%] text-[#6B7280] align-middle">
                                                        أضف الأقسام المختلفة لمقالك وقم بترتيبها كما تشاء
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id={`add_sections_${section.id}`}
                                                        value={section.title}
                                                        onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                                                        className="w-full h-[50px] mt-1 rounded-[12px] border border-[#EEEEEE] bg-[#F9FAFB] px-[13px] pt-[11px] pb-[12px] font-worksans font-normal text-[16px] leading-[100%] tracking-[0%] text-[#BDBDBD] align-middle opacity-100 text-right focus:text-black focus:outline-none focus:border-[#00844B] transition-all"
                                                        placeholder="عنوان محتوي المقالة"
                                                        required
                                                    />
                                                </div>

                                                {/* input 2 */}
                                                <div className='text-right mt-5'>
                                                    <label htmlFor={`add_main_${section.id}`} className="mb-3 font-poppins font-normal text-[12px] leading-[21px] tracking-[0%] text-[#6B7280] align-middle">
                                                        المحتوى
                                                    </label>
                                                    <textarea
                                                        id={`add_main_${section.id}`}
                                                        value={section.content}
                                                        onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                                                        className="w-full h-[122px] mt-1 rounded-[12px] border border-[#EEEEEE] bg-[#F9FAFB] px-[13px] pt-[11px] pb-[12px] font-worksans font-normal text-[16px] leading-[100%] tracking-[0%] text-[#BDBDBD] align-middle opacity-100 text-right focus:text-black resize-none focus:outline-none focus:border-[#00844B] transition-all"
                                                        placeholder="اكتب محتوي هذا القسم هنا"
                                                        required
                                                    />
                                                </div>

                                                {/* input 3 image */}
                                                <div className='mt-5'>
                                                    <label
                                                        htmlFor={`dropzone-file-section-${section.id}`}
                                                        className="flex flex-col items-center justify-center w-full h-[120px] md:h-[143.2px] rounded-[12px] border border-dashed border-[#D1D5DB] opacity-100 cursor-pointer hover:bg-gray-50 transition-all duration-300 hover:border-[#00844B]"
                                                    >
                                                        {section.imagePreview ? (
                                                            <div className="relative w-full h-full">
                                                                <img src={section.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[12px]" />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        removeSectionImage(section.id);
                                                                    }}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                                >
                                                                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1 25.2L10.172 16.028C10.9221 15.2781 11.9393 14.8568 13 14.8568C14.0607 14.8568 15.0779 15.2781 15.828 16.028L25 25.2M21 21.2L24.172 18.028C24.9221 17.2781 25.9393 16.8568 27 16.8568C28.0607 16.8568 29.0779 17.2781 29.828 18.028L33 21.2M21 9.19995H21.02M5 33.2H29C30.0609 33.2 31.0783 32.7785 31.8284 32.0284C32.5786 31.2782 33 30.2608 33 29.2V5.19995C33 4.13909 32.5786 3.12167 31.8284 2.37152C31.0783 1.62138 30.0609 1.19995 29 1.19995H5C3.93913 1.19995 2.92172 1.62138 2.17157 2.37152C1.42143 3.12167 1 4.13909 1 5.19995V29.2C1 30.2608 1.42143 31.2782 2.17157 32.0284C2.92172 32.7785 3.93913 33.2 5 33.2Z" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>

                                                                <p className="mt-3 font-Inter font-normal text-[11px] md:text-[11.9px] leading-[20px] tracking-[0%] text-center align-middle text-[#6B7280]">
                                                                    صورة القسم (اختيارية)
                                                                </p>
                                                                <p className="font-Inter font-normal text-[9px] md:text-[10.2px] leading-[16px] tracking-[0%] text-center align-middle text-[#9CA3AF]">
                                                                    PNG, JPG, GIF up to 10MB
                                                                </p>
                                                            </div>
                                                        )}
                                                        <input
                                                            id={`dropzone-file-section-${section.id}`}
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleSectionImageUpload(section.id, e)}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* add more section button */}
                                    <button
                                        type="button"
                                        onClick={addNewSection}
                                        className='w-full max-w-[903px] h-[50px] rounded-[12px] border border-dashed border-[#00844B] px-4 py-[13px] gap-[8px] font-inter font-medium text-[13.6px] leading-[24px] tracking-[0%] text-center align-middle text-[#00844B] opacity-100 transition-all duration-300 hover:bg-[#00844B]/5 hover:shadow-md'
                                    >
                                        إضف قسم جديد
                                        <FontAwesomeIcon icon={faPlus} className='ms-2'></FontAwesomeIcon>
                                    </button>
                                </div>
                            )}

                            {/* Step 3: Review and Publish */}
                            {currentStep === 3 && (
                                <div className='w-full animate-slideUp flex flex-col items-center justify-center'>
                                    {/* Main Review Card */}
                                    <div className='w-full max-w-[647px] rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm opacity-100 my-5 transition-all duration-300 hover:shadow-md'>
                                        {/* Cover Image */}
                                        <div className='relative'>
                                            <img
                                                src={imagePreview || "post_image_2.jpg"}
                                                className='w-full h-[172px] rounded-t-[9.06px] opacity-100 object-cover'
                                                alt="Cover"
                                            />
                                            {/* Edit Cover Button */}
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(1)}
                                                className='absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110'
                                            >
                                                <FontAwesomeIcon icon={faPen} className='text-[#00844B] text-sm' />
                                            </button>
                                        </div>

                                        {/* Article Header */}
                                        <div className='w-full bg-gradient-to-t from-[#2D4639] to-[#000000] opacity-100 p-5'>
                                            {/* Title */}
                                            <div className='flex items-center justify-end gap-3'>
                                                <h1 className='font-poppins font-bold text-[20px] md:text-[24px] leading-[100%] tracking-[0%] align-middle text-white text-right'>
                                                    {articleTitle || "الحكومة السورية تعلن عن إجراءات جديدة لتحسين"}
                                                </h1>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentStep(1)}
                                                    className='text-white hover:text-[#E9C882] transition-colors'
                                                >
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>
                                            </div>

                                            {/* Meta Information */}
                                            <div className='flex flex-wrap justify-end items-center mt-6 gap-3 md:gap-5'>
                                                <div className='w-auto px-3 h-[28px] rounded-full bg-[#E9C882] opacity-100 flex items-center justify-center transition-all duration-300 hover:bg-[#d4b874]'>
                                                    <h1 className='font-inter font-medium text-[11.9px] leading-[20px] tracking-[0%] align-middle text-[#2D4639]'>
                                                        {getCategoryName(selectedCategory)}
                                                    </h1>
                                                </div>
                                                <div className='flex items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer'>
                                                    <h1 className='font-inter font-normal text-[11.9px] leading-[20px] tracking-[0%] text-right align-middle'>ناشر</h1>
                                                    <FontAwesomeIcon icon={faUser} className='text-sm' />
                                                </div>

                                                <div className='flex items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer'>
                                                    <h1 className='font-inter font-normal text-[11.9px] leading-[20px] tracking-[0%] text-right align-middle'>اليوم</h1>
                                                    <FontAwesomeIcon icon={faCalendar} className='text-sm' />
                                                </div>

                                                <div className='flex items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer'>
                                                    <h1 className='font-inter font-normal text-[11.9px] leading-[20px] tracking-[0%] text-right align-middle'>الآن</h1>
                                                    <FontAwesomeIcon icon={faclock} className='text-sm' />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Article Sections */}
                                        <div className='p-2 space-y-6'>
                                            {articleSections.map((section, index) => (
                                                <div key={section.id} className='flex flex-col md:flex-row justify-between gap-4 p-4 rounded-[12px]  transition-all duration-300 '>
                                                    {/* Section Image */}
                                                    {section.imagePreview && (
                                                        <img
                                                            src={section.imagePreview}
                                                            className='w-full md:w-[180px] h-[128px] rounded-t-[9.06px] opacity-100 object-cover'
                                                            alt={`Section ${index + 1}`}
                                                        />
                                                    )}

                                                    {/* Section Content */}
                                                    <div className='md:me-10'>
                                                        {/* Section Header */}
                                                        <div className='flex items-center justify-between mb-3 gap-5'>

                                                            <h1 className='font-poppins font-semibold text-[16px] md:text-[17px] leading-[30px] tracking-[0%] align-middle text-[#1B1D1E] text-right'>
                                                                {section.title || "عنوان محتوي المقال"}
                                                            </h1>
                                                            <div className='flex items-center gap-2'>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setCurrentStep(2)}
                                                                    className='w-[28px] h-[28px] rounded-[6px] bg-[#F3F4F6] text-black opacity-100 flex items-center justify-center transition-all duration-300 hover:bg-[#00844B] hover:text-white'
                                                                >
                                                                    <FontAwesomeIcon icon={faPen} className='text-[12px]' />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className='w-[28px] h-[28px] rounded-[6px] bg-[#F3F4F6] text-black opacity-100 flex items-center justify-center transition-all duration-300 hover:bg-[#00844B] hover:text-white'
                                                                >
                                                                    <FontAwesomeIcon icon={faBars} className='text-[12px]' />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Section Content */}
                                                        <div className='w-full opacity-100'>
                                                            <p className='font-poppins font-normal text-[12px] leading-[22px] tracking-[0%] align-middle text-[#374151] text-right'>
                                                                {section.content || "تفاصيل محتوي المقال كلام كتيييير جداتفاصيل محتوي المقال كلام كتيييير جدا تفاصيل محتوي المقال كلام كتيييير جداتفاصيل محتوي المقال كلام كتيييير جدا تفاصيل محتوي المقال كلام كتيييير جداتفاصيل محتوي المقال كلام كتيييير جدا"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Additional Sections Info */}
                                        {articleSections.length > 1 && (
                                            <div className='px-5 pb-5'>
                                                <div className='w-full p-3 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB]'>
                                                    <p className='font-inter font-normal text-[12px] leading-[20px] tracking-[0%] text-center text-[#6B7280]'>
                                                        يحتوي المقال على {articleSections.length} أقسام
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}

                            {/* navigation buttons */}
                            <div className='mt-6 md:mt-7 flex items-center justify-between gap-3'>
                                {currentStep === 1 ? <>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className='w-[120px] md:w-[147.8px] h-[45px] md:h-[49.6px] rounded-[12px] bg-[#F7F2E9] font-Inter font-medium text-[12px] md:text-[13.6px] leading-[24px] text-center align-middle text-black opacity-100 hover:bg-[#E8E3DA] transition-all duration-300 hover:shadow-md'
                                    >
                                        إلغاء
                                    </button>
                                </> : <>
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className='w-[120px] flex items-center justify-center md:w-[147.8px] h-[45px] md:h-[49.6px] rounded-[12px] bg-[#F7F2E9] font-Inter font-medium text-[12px] md:text-[13.6px] leading-[24px] text-center align-middle text-black opacity-100 hover:bg-[#E8E3DA] transition-all duration-300 hover:shadow-md'
                                    >
                                        <FontAwesomeIcon icon={faAngleLeft} className='text-xl me-1'></FontAwesomeIcon>
                                        السابق
                                    </button>
                                </>}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={
                                            (currentStep === 1 && (!articleTitle || !coverImage)) ||
                                            (currentStep === 2 && !articleSections.some(section => section.title && section.content)) ||
                                            isLoading
                                        }
                                        className={`w-[100px] md:w-[119.05px] h-[45px] md:h-[48px] rounded-[12px] font-Inter font-medium text-[12px] md:text-[13.6px] leading-[24px] text-center align-middle text-white transition-all duration-300 ${(currentStep === 1 && (!articleTitle || !coverImage)) ||
                                            (currentStep === 2 && !articleSections.some(section => section.title && section.content)) ||
                                            isLoading
                                            ? 'bg-[#00844B99] cursor-not-allowed'
                                            : 'bg-[#00844B] hover:bg-[#006D3D] cursor-pointer hover:shadow-md'
                                            }`}
                                    >
                                        {isLoading ? 'جاري النشر...' : currentStep === 3 ? 'نشر المقال' : 'التالي'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>
                </section>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className={`fixed top-20 md:top-26 right-4 md:right-17 flex w-[220px] md:w-[250px] h-[45px] px-4 justify-center flex-row-reverse items-center gap-2 rounded-lg bg-white shadow-md transition-all duration-500 z-[10000] animate-toastIn`}>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#00844B] text-lg" />
                    <div className='text-black text-[12px] md:text-[14px] font-[400] font-[Tajawal] not-italic leading-normal'>
                        تم ارسال المنشور للادمن
                    </div>
                </div>
            )}
            {/* Animation styles */}
            <style jsx="true" global="true">{`
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

                {/* right section - latest post with API and rotation */}
                <section className='w-full max-w-[723px] h-auto md:h-[510px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0'>
                    {section1Loading ? (
                        <div className='w-full h-full flex items-center justify-center'>
                            <p className='text-gray-500'>جاري التحميل...</p>
                        </div>
                    ) : section1Error ? (
                        <div className='w-full h-full flex items-center justify-center'>
                            <p className='text-red-500'>{section1Error}</p>
                        </div>
                    ) : section1Posts.length > 0 ? (
                        <>
                            <div className="relative">
                                {imageLoadingStates[section1Posts[currentSection1Index]?.id] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-t-[8px]">
                                        <p className="text-gray-500">جاري تحميل الصورة...</p>
                                    </div>
                                )}
                                <img
                                    src={section1Posts[currentSection1Index].imageUrl || "post.jpg"}
                                    className={`w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover ${imageLoadingStates[section1Posts[currentSection1Index]?.id] ? 'opacity-0' : 'opacity-100'}`}
                                    alt="post_Photo"
                                    onLoad={() => handleImageLoad(section1Posts[currentSection1Index].id)}
                                    onError={() => handleImageError(section1Posts[currentSection1Index].id)}
                                />
                            </div>
                            <div className='flex-col p-4 flex gap-6 md:gap-8'>
                                <div className='flex items-center justify-end gap-4'>
                                    <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>
                                        {formatDate(section1Posts[currentSection1Index].createdAt)}
                                    </p>
                                    <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>
                                        عاجل
                                    </h1>
                                </div>

                                <h1 className='text-black text-right font-poppins text-[18px] md:text-[20px] font-semibold leading-normal'>
                                    {section1Posts[currentSection1Index].header}
                                </h1>

                                <p className='text-[#636262] text-right font-tajawal text-[14px] font-normal leading-normal'>
                                    {section1Posts[currentSection1Index].bio || 'لا توجد نبذة متاحة'}
                                </p>

                                <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 md:ms-10'>
                                    <Link
                                        to={`/newsdetails`}
                                        className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'
                                    >
                                        .....إقراء المزيد
                                    </Link>
                                    <div className='flex items-center gap-4'>
                                        <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>
                                            {section1Posts[currentSection1Index].publisher?.username || 'مجهول'}
                                        </h1>
                                        <img src="profile.jpg" className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                            <p className='text-gray-500'>لا توجد منشورات متاحة</p>
                        </div>
                    )}
                </section>
            </section>

            {/* last news section 2 */}
            <section className='mt-25 flex flex-col lg:flex-row gap-8 lg:gap-15 justify-center responsive-padding'>
                {/* left section */}
                <section className='flex flex-col w-full lg:w-[401px] items-end gap-[25px] lg:gap-[43px]'>
                    <div className='flex gap-2'>
                        <h1 className='text-black font-[tajawal] text-[24px] lg:text-[28px] font-bold leading-normal'>أختارنا لكم </h1>
                        <div className='w-[4px] lg:w-[5px] h-[32px] lg:h-[42px] rounded-[1px] bg-[#2D4639]'></div>
                    </div>

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

                        {/* cards 2-6 remain the same */}
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

                {/* right section with API */}
                <section className='flex flex-col w-full lg:w-auto'>
                    <div className='flex justify-between flex-row-reverse'>
                        <div className='flex gap-2'>
                            <h1 className='text-black font-[tajawal] text-[24px] lg:text-[28px] font-bold leading-normal'>اخر الاخبار</h1>
                            <div className='w-[4px] lg:w-[5px] h-[32px] lg:h-[42px] rounded-[1px] bg-[#2D4639]'></div>
                        </div>
                        <Link to={'/more-news'} className='text-[#545454] font-poppins text-[16px] lg:text-[20px] font-semibold leading-normal'>...رؤيه المزيد</Link>
                    </div>

                    {/* posts with API */}
                    {section2Loading ? (
                        <div className='flex justify-center items-center h-64 mt-10'>
                            <p className='text-gray-500 text-lg'>جاري التحميل...</p>
                        </div>
                    ) : section2Error ? (
                        <div className='flex justify-center items-center h-64 mt-10'>
                            <p className='text-red-500 text-lg'>{section2Error}</p>
                        </div>
                    ) : section2Posts.length > 0 ? (
                        <>
                            <section className='flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10 mt-6 lg:mt-11'>
                                {/* Column 1 - First 2 posts */}
                                <div className='flex flex-col space-y-5 lg:space-y-10 w-full lg:w-[426px]'>
                                    {section2Posts.slice(0, 2).map((post) => (
                                        <div key={post.id} className="lg:w-[426px] h-[260px] md:h-[340px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
                                            <div className="relative">
                                                {imageLoadingStates[post.id] && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-t-[8px]">
                                                        <p className="text-gray-500">جاري تحميل الصورة...</p>
                                                    </div>
                                                )}
                                                <img
                                                    className={`w-full h-[160px] lg:h-[204px] shrink-0 rounded-t-[8px] object-cover ${imageLoadingStates[post.id] ? 'opacity-0' : 'opacity-100'}`}
                                                    src={post.imageUrl || "post_image.jpg"}
                                                    alt={post.header}
                                                    onLoad={() => handleImageLoad(post.id)}
                                                    onError={() => handleImageError(post.id)}
                                                />
                                            </div>

                                            <div className="flex w-full px-4 flex-col items-end gap-3 lg:gap-5 mt-1 lg:mt-4">
                                                <div className='flex items-center gap-2'>
                                                    <h1 className='text-black font-[Poppins] text-[16px] lg:text-[20px] not-italic font-semibold leading-normal'>
                                                        {post.header}
                                                    </h1>
                                                    <span className='w-[3px] lg:w-[5px] h-[14px] lg:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)]'></span>
                                                </div>

                                                <div>
                                                    <p className='text-black text-right font-[Tajawal] text-[12px] lg:text-sm not-italic font-normal leading-normal line-clamp-2'>
                                                        {post.bio}
                                                    </p>
                                                </div>

                                                <div className='flex justify-between w-full'>
                                                    <Link
                                                        to={`/newsdetails`}
                                                        className='text-[var(--Gray,#8A8A8A)] cursor-pointer ms-2 lg:ms-4 text-right font-[Poppins] text-[11px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1'
                                                    >
                                                        <p>...قراءة المزيد</p>
                                                    </Link>

                                                    <div className='text-[var(--Gray,#8A8A8A)] text-right font-[Poppins] text-[10px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1 lg:gap-2'>
                                                        <p>{formatDate(post.createdAt)}</p>
                                                        <FontAwesomeIcon icon={faClock} className='text-[10px] lg:text-xs' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Column 2 - Last 2 posts */}
                                <div className='flex flex-col space-y-5 lg:space-y-10 w-full lg:w-[426px]'>
                                    {section2Posts.slice(2, 4).map((post) => (
                                        <div key={post.id} className="lg:w-[426px] h-[260px] md:h-[340px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
                                            <div className="relative">
                                                {imageLoadingStates[post.id] && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-t-[8px]">
                                                        <p className="text-gray-500">جاري تحميل الصورة...</p>
                                                    </div>
                                                )}
                                                <img
                                                    className={`w-full h-[160px] lg:h-[204px] shrink-0 rounded-t-[8px] object-cover ${imageLoadingStates[post.id] ? 'opacity-0' : 'opacity-100'}`}
                                                    src={post.imageUrl || "post_image.jpg"}
                                                    alt={post.header}
                                                    onLoad={() => handleImageLoad(post.id)}
                                                    onError={() => handleImageError(post.id)}
                                                />
                                            </div>

                                            <div className="flex w-full px-4 flex-col items-end gap-3 lg:gap-5 mt-1 lg:mt-4">
                                                <div className='flex items-center gap-2'>
                                                    <h1 className='text-black font-[Poppins] text-[16px] lg:text-[20px] not-italic font-semibold leading-normal'>
                                                        {post.header}
                                                    </h1>
                                                    <span className='w-[3px] lg:w-[5px] h-[14px] lg:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)]'></span>
                                                </div>

                                                <div>
                                                    <p className='text-black text-right font-[Tajawal] text-[12px] lg:text-sm not-italic font-normal leading-normal line-clamp-2'>
                                                        {post.bio}
                                                    </p>
                                                </div>

                                                <div className='flex justify-between w-full'>
                                                    <Link
                                                        to={`/newsdetails`}
                                                        className='text-[var(--Gray,#8A8A8A)] cursor-pointer ms-2 lg:ms-4 text-right font-[Poppins] text-[11px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1'
                                                    >
                                                        <p>...قراءة المزيد</p>
                                                    </Link>

                                                    <div className='text-[var(--Gray,#8A8A8A)] text-right font-[Poppins] text-[10px] lg:text-xs not-italic font-normal leading-normal flex items-center gap-1 lg:gap-2'>
                                                        <p>{formatDate(post.createdAt)}</p>
                                                        <FontAwesomeIcon icon={faClock} className='text-[10px] lg:text-xs' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Pagination */}
                            {section2TotalPages > 1 && (
                                <div className='flex gap-2 items-center justify-center mt-8'>
                                    {/* Left arrow */}
                                    <button
                                        onClick={() => handleSection2PageChange(Math.max(0, section2CurrentPage - 1))}
                                        disabled={section2CurrentPage === 0}
                                        className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${section2CurrentPage === 0
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-[#2D4639] text-white hover:bg-[#00844B]"
                                            }`}
                                    >
                                        ←
                                    </button>

                                    {/* Page numbers */}
                                    {getPaginationButtons().map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handleSection2PageChange(pageNumber)}
                                            className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${section2CurrentPage === pageNumber
                                                ? "bg-[#00844B] text-white"
                                                : "bg-[#2D4639] text-white hover:bg-[#00844B]"
                                                }`}
                                        >
                                            {pageNumber + 1}
                                        </button>
                                    ))}

                                    {/* Right arrow */}
                                    <button
                                        onClick={() => handleSection2PageChange(Math.min(section2TotalPages - 1, section2CurrentPage + 1))}
                                        disabled={section2CurrentPage === section2TotalPages - 1}
                                        className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${section2CurrentPage === section2TotalPages - 1
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-[#2D4639] text-white hover:bg-[#00844B]"
                                            }`}
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='flex justify-center items-center h-64 mt-10'>
                            <p className='text-gray-500 text-lg'>لا توجد منشورات متاحة</p>
                        </div>
                    )}
                </section>
            </section>

            {/* more news section 3 */}
            <section className='mt-20 mb-5 h-auto md:h-[440px] shrink-0 bg-[#1B1D1E] py-10'>
                <div className='flex justify-center'>
                    <div className='w-[90%] md:w-[1400px] h-[1px] bg-white'></div>
                </div>

                <div className='flex justify-between items-center mx-4 md:mx-15 mt-2'>
                    <div className=''>
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

            {/* Animation styles */}
            <style jsx="true" global="true">{`
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
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
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

        </div>
    );
}