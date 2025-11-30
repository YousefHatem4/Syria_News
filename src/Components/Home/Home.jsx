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

/**
 * Home Component - Main landing page that displays news articles, categories, and allows article creation
 * Features:
 * - Article creation modal with multi-step form
 * - Three sections of news posts from API
 * - Category display
 * - Responsive design with animations
 */
export default function Home() {
    // ============ MODAL STATE MANAGEMENT ============
    const [showSection2, setShowSection2] = useState(false); // Controls modal visibility
    const [showToast, setShowToast] = useState(false); // Toast notification state
    const [currentStep, setCurrentStep] = useState(1); // Current step in article creation process (1-3)
    const [selectedCategory, setSelectedCategory] = useState(''); // Selected category for new article
    const [articleTitle, setArticleTitle] = useState(''); // Article title input
    const [articleBio, setArticleBio] = useState(''); // Article bio/description
    const [coverImage, setCoverImage] = useState(null); // Cover image file
    const [imagePreview, setImagePreview] = useState(null); // Cover image preview URL
    const [categories, setCategories] = useState([]); // Available categories from API
    const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
    const modalRef = useRef(null); // Reference for modal container
    let { userToken } = useContext(userContext); // User authentication token
    const navigate = useNavigate(); // Navigation hook

    // ============ API POSTS STATE MANAGEMENT ============
    // Section 1: Latest posts with rotation (hero section)
    const [section1Posts, setSection1Posts] = useState([]);
    const [section1Loading, setSection1Loading] = useState(true);
    const [section1Error, setSection1Error] = useState(null);
    const [currentSection1Index, setCurrentSection1Index] = useState(0); // Current index for rotating posts

    // Section 2: Paginated posts (4 posts per page)
    const [section2Posts, setSection2Posts] = useState([]);
    const [section2Loading, setSection2Loading] = useState(true);
    const [section2Error, setSection2Error] = useState(null);
    const [section2CurrentPage, setSection2CurrentPage] = useState(0);
    const [section2TotalPages, setSection2TotalPages] = useState(0);

    // Section 3: Slider posts (last section)
    const [section3Posts, setSection3Posts] = useState([]);
    const [section3Loading, setSection3Loading] = useState(true);
    const [section3Error, setSection3Error] = useState(null);

    // Latest News Posts (for left section)
    const [latestNewsPosts, setLatestNewsPosts] = useState([]);
    const [latestNewsLoading, setLatestNewsLoading] = useState(true);
    const [latestNewsError, setLatestNewsError] = useState(null);

    // ============ IMAGE LOADING STATES ============
    const [imageLoadingStates, setImageLoadingStates] = useState({}); // Tracks loading state for each post image

    // ============ ARTICLE SECTIONS STATE ============
    // Manages dynamic sections for article content (title, content, image for each section)
    const [articleSections, setArticleSections] = useState([
        { id: 1, title: '', content: '', image: null, imagePreview: null }
    ]);

    // ============ SLIDER STATE MANAGEMENT ============
    const [currentSlide, setCurrentSlide] = useState(0); // Current slide index for section 3
    const sliderRef = useRef(null); // Reference for slider container
    const cardWidth = 261; // Fixed width for each card in pixels
    const cardsToShow = 5; // Number of cards to show at once

    // Category images mapping - maintain existing images by index
    const categoryImages = [
        "card-4.png",
        "card-3.png",
        "card-5.png",
        "card-8.png",
        "card-7.png",
        "card-2.png",
    ];

    // Category translation mapping
    const categoryTranslations = {
        'Sports': 'الرياضة',
        'Economy': 'الاقتصاد',
        'Politics': 'السياسة',
        'Arts': 'الفنون',
        'Technology': 'التقنية',
        'General': 'عام',
        'Health':'صحة'
    };

    // ============ API FUNCTIONS ============

    /**
     * Fetches Latest News Posts for Left Section
     * Gets the last 2 posts from /articles/latest_news API
     */
    const fetchLatestNewsPosts = async () => {
        try {
            setLatestNewsLoading(true);
            setLatestNewsError(null);

            const response = await axios.get(`${BASE_URL}articles/latest_news`, {
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json',
                } : {
                    'Accept': 'application/json',
                }
            });

            if (response.data && Array.isArray(response.data.content)) {
                // Take only the last 2 posts
                const lastTwoPosts = response.data.content.slice(0, 2);
                setLatestNewsPosts(lastTwoPosts);
            }
        } catch (err) {
            console.error('Error fetching latest news posts:', err);
            setLatestNewsError('فشل في تحميل أحدث الأخبار');
        } finally {
            setLatestNewsLoading(false);
        }
    };

    /**
     * Fetches Section 1 Posts (Latest Posts - multiple for rotation)
     * Fetches 10 latest approved posts for the hero section rotation using articles/filter
     */
    const fetchSection1Posts = async () => {
        try {
            setSection1Loading(true);
            setSection1Error(null);

            // Create FormData for multipart/form-data request (same as MoreNews)
            const formData = new FormData();
            formData.append('page', '0');
            formData.append('size', '10'); // Fetch more posts for rotation
            formData.append('categoryName', ''); // Empty string to get all categories
            formData.append('status', 'approved');
            formData.append('startDate', '');
            formData.append('endDate', '');

            const response = await axios.post(`${BASE_URL}articles/filter`, formData, {
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                } : {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data && Array.isArray(response.data.content)) {
                setSection1Posts(response.data.content);

                // Initialize image loading states for all posts
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

            // Fallback to alternative endpoint if main endpoint fails
            try {
                const fallbackResponse = await axios.get(`${BASE_URL}articles/status`, {
                    params: {
                        page: 0,
                        size: 10,
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

                if (fallbackResponse.data && Array.isArray(fallbackResponse.data.content)) {
                    setSection1Posts(fallbackResponse.data.content);
                }
            } catch (fallbackErr) {
                console.error('Error fetching section 1 posts from fallback:', fallbackErr);
            }
        } finally {
            setSection1Loading(false);
        }
    };

    /**
     * Fetches Section 2 Posts (4 posts per page with pagination)
     * Used for the main news grid section using articles/filter
     */
    const fetchSection2Posts = async (page = 0) => {
        try {
            setSection2Loading(true);
            setSection2Error(null);

            // Create FormData for multipart/form-data request (same as MoreNews)
            const formData = new FormData();
            formData.append('page', page.toString());
            formData.append('size', '4'); // 4 posts per page
            formData.append('categoryName', ''); // Empty string to get all categories
            formData.append('status', 'approved');
            formData.append('startDate', '');
            formData.append('endDate', '');

            const response = await axios.post(`${BASE_URL}articles/filter`, formData, {
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                } : {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data && Array.isArray(response.data.content)) {
                setSection2Posts(response.data.content);
                setSection2TotalPages(response.data.totalPages || 1);

                // Initialize image loading states for section 2 posts
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

            // Fallback to alternative endpoint if main endpoint fails
            try {
                const fallbackResponse = await axios.get(`${BASE_URL}articles/status`, {
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

                if (fallbackResponse.data && Array.isArray(fallbackResponse.data.content)) {
                    setSection2Posts(fallbackResponse.data.content);
                    setSection2TotalPages(fallbackResponse.data.totalPages || 1);
                }
            } catch (fallbackErr) {
                console.error('Error fetching section 2 posts from fallback:', fallbackErr);
            }
        } finally {
            setSection2Loading(false);
        }
    };

    /**
     * Fetches categories from API for article creation
     * Falls back to default categories if API fails
     */
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}categories`);
            if (response.data && Array.isArray(response.data)) {
                setCategories(response.data);
                if (response.data.length > 0) {
                    setSelectedCategory(response.data[0].name); // Set first category as default
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to default categories if API fails
            setCategories([
                { name: 'الفنون', nameAr: 'الفنون', description: 'Arts', descriptionAr: 'الفنون' },
                { name: 'الرياضة', nameAr: 'الرياضة', description: 'Sports', descriptionAr: 'الرياضة' },
                { name: 'الاقتصاد', nameAr: 'الاقتصاد', description: 'Economy', descriptionAr: 'الاقتصاد' },
                { name: 'السياسة', nameAr: 'السياسة', description: 'Politics', descriptionAr: 'السياسة' },
            ]);
        }
    };

    /**
     * Fetches Section 3 Posts for the slider section
     * Gets 8 approved posts for the bottom slider using articles/filter
     */
    const fetchSection3Posts = async () => {
        try {
            setSection3Loading(true);
            setSection3Error(null);

            // Create FormData for multipart/form-data request (same as MoreNews)
            const formData = new FormData();
            formData.append('page', '0');
            formData.append('size', '8'); // Fetch 8 posts for the slider
            formData.append('categoryName', ''); // Empty string to get all categories
            formData.append('status', 'approved');
            formData.append('startDate', '');
            formData.append('endDate', '');

            const response = await axios.post(`${BASE_URL}articles/filter`, formData, {
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                } : {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data && Array.isArray(response.data.content)) {
                setSection3Posts(response.data.content);

                // Initialize image loading states for section 3
                const newLoadingStates = { ...imageLoadingStates };
                response.data.content.forEach((post) => {
                    if (post.imageUrl && !newLoadingStates[post.id]) {
                        newLoadingStates[post.id] = true;
                    }
                });
                setImageLoadingStates(newLoadingStates);
            }
        } catch (err) {
            console.error('Error fetching section 3 posts:', err);
            setSection3Error('فشل في تحميل المنشورات');

            // Fallback to alternative endpoint if main endpoint fails
            try {
                const fallbackResponse = await axios.get(`${BASE_URL}articles/status`, {
                    params: {
                        page: 0,
                        size: 8,
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

                if (fallbackResponse.data && Array.isArray(fallbackResponse.data.content)) {
                    setSection3Posts(fallbackResponse.data.content);
                }
            } catch (fallbackErr) {
                console.error('Error fetching section 3 posts from fallback:', fallbackErr);
            }
        } finally {
            setSection3Loading(false);
        }
    };

    // ============ IMAGE HANDLING FUNCTIONS ============

    /**
     * Handles image load completion
     * Updates loading state for specific post image
     */
    const handleImageLoad = (postId) => {
        setImageLoadingStates(prev => ({
            ...prev,
            [postId]: false
        }));
    };

    /**
     * Handles image load error
     * Updates loading state and hides broken images
     */
    const handleImageError = (postId) => {
        setImageLoadingStates(prev => ({
            ...prev,
            [postId]: false
        }));
    };

    // ============ UTILITY FUNCTIONS ============

    /**
     * Translates English category names to Arabic
     */
    const translateCategory = (categoryName) => {
        return categoryTranslations[categoryName] || categoryName;
    };

    /**
     * Rotates section 1 posts every 10 seconds
     * Creates automatic carousel effect for hero section
     */
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

    /**
     * Formats date to relative time (e.g., "منذ 30 دقيقة")
     * Converts ISO date string to human-readable relative time
     */
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

    /**
     * Handles pagination for Section 2 posts
     * Fetches new page when pagination controls are used
     */
    const handleSection2PageChange = (newPage) => {
        setSection2CurrentPage(newPage);
        fetchSection2Posts(newPage);
    };

    /**
     * Generates pagination buttons for Section 2
     * Shows max 3 buttons with current page in middle when possible
     */
    const getPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 3;

        if (section2TotalPages <= maxButtons) {
            // Show all pages if total pages <= 3
            for (let i = 0; i < section2TotalPages; i++) {
                buttons.push(i);
            }
        } else {
            // Show sliding window of 3 pages
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

    /**
     * Moves slider to next set of cards
     * Handles right arrow click in section 3 slider
     */
    const nextSlide = () => {
        if (currentSlide < section3Posts.length - cardsToShow) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    /**
     * Moves slider to previous set of cards
     * Handles left arrow click in section 3 slider
     */
    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    // ============ EFFECT HOOKS ============

    /**
     * Controls body scroll when modal is open
     * Prevents background scrolling while modal is active
     */
    useEffect(() => {
        document.body.style.overflow = showSection2 ? "hidden" : "auto";
    }, [showSection2]);

    /**
     * Auto-hides toast notification after 2.5 seconds
     */
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 2500);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    /**
     * Initial data fetching on component mount
     * Fetches categories and all three sections of posts
     */
    useEffect(() => {
        fetchCategories();
        fetchSection1Posts();
        fetchSection2Posts(0);
        fetchSection3Posts();
        fetchLatestNewsPosts(); // Fetch latest news for left section
    }, []);

    // ============ ARTICLE CREATION FUNCTIONS ============

    /**
     * Handles cover image upload for article
     * Creates preview URL and stores file
     */
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverImage(file);
            setImagePreview(URL.createObjectURL(file)); // Create preview URL
        }
    };

    /**
     * Handles section image upload for specific article section
     */
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

    /**
     * Updates section field values (title, content)
     */
    const handleSectionChange = (sectionId, field, value) => {
        setArticleSections(sections =>
            sections.map(section =>
                section.id === sectionId
                    ? { ...section, [field]: value }
                    : section
            )
        );
    };

    /**
     * Adds new empty section to article
     */
    const addNewSection = () => {
        const newSection = {
            id: Date.now(), // Unique ID based on timestamp
            title: '',
            content: '',
            image: null,
            imagePreview: null
        };
        setArticleSections([...articleSections, newSection]);
    };

    /**
     * Removes section from article
     * Prevents removal if only one section remains
     */
    const removeSection = (sectionId) => {
        if (articleSections.length > 1) {
            setArticleSections(sections => sections.filter(section => section.id !== sectionId));
        }
    };

    /**
     * Removes image from specific section
     */
    const removeSectionImage = (sectionId) => {
        setArticleSections(sections =>
            sections.map(section =>
                section.id === sectionId
                    ? { ...section, image: null, imagePreview: null }
                    : section
            )
        );
    };

    /**
     * Gets Arabic category name by English name
     */
    const getCategoryName = (categoryName) => {
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.nameAr || category.name : 'غير محدد';
    };

    /**
     * Submits article sections to API after main article is created
     */
    const submitArticleSections = async (articleId) => {
        if (!userToken) {
            console.error('User not authenticated');
            return false;
        }

        try {
            // Submit each section sequentially
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

    /**
     * Submits main article to API
     * Creates the article and then submits its sections
     */
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

            // Submit main article
            const response = await axios.post(`${BASE_URL}articles`, formData, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            const articleId = response.data.id;

            // Submit sections if article was created successfully
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

    /**
     * Handles form submission for all steps
     * Validates current step before proceeding
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Step 1: Basic Information Validation
        if (currentStep === 1) {
            if (!articleTitle || !coverImage || !selectedCategory) {
                return; // Prevent progression if required fields are empty
            }
            setCurrentStep(2);
        }
        // Step 2: Article Content Validation
        else if (currentStep === 2) {
            const hasValidSection = articleSections.some(section => section.title && section.content);
            if (!hasValidSection) {
                return; // Need at least one valid section
            }
            setCurrentStep(3);
        }
        // Step 3: Final Submission
        else if (currentStep === 3) {
            const success = await submitArticle();
            if (success) {
                setShowToast(true); // Show success notification
                handleClose(); // Close modal
            }
        }
    };

    /**
     * Closes modal and resets all form state
     */
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

    /**
     * Navigates to previous step in article creation
     */
    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    /**
     * Gets category image by index (cycles through available images)
     */
    const getCategoryImage = (index) => {
        return categoryImages[index % categoryImages.length];
    };

    // ============ COMPONENT RENDER ============
    return (
        <div className='bg-[linear-gradient(164deg,#004025_-0.36%,rgba(255,255,255,0.80)_34.44%,rgba(0,64,37,0.50)_101.6%)] h-auto pb-25 pt-15 lg:pt-0'>

            {/* ============ ADD POST SECTION ============ */}
            {/* Floating button to open article creation modal */}
            <section className='flex justify-center items-center pt-30 md:pt-50 px-4'>
                <div
                    onClick={() => {
                        if (!userToken) {
                            navigate('/login'); // Redirect to login if not authenticated
                        } else {
                            setShowSection2(true); // Open article creation modal
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

            {/* ============ ARTICLE CREATION MODAL ============ */}
            {showSection2 && (
                <section
                    onClick={handleClose} // Close modal when clicking backdrop
                    className='fixed inset-0 bg-black/70 flex justify-center items-start z-[9999] transition-opacity duration-300 animate-fadeIn p-4 overflow-y-auto'
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {/* Hide scrollbar styles */}
                    <style jsx="true" global="true">{`
                        section::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {/* Modal Content */}
                    <section
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
                        className='flex w-full max-w-[1024px] my-8 p-4 md:p-7 flex-col items-start gap-4 md:gap-6 rounded-[16px] bg-white shadow-lg transition-all duration-300 animate-modalIn'
                    >

                        {/* Modal Title */}
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

                        {/* ============ PROGRESS STEPS INDICATOR ============ */}
                        <div className="w-full mt-4 md:mt-10 flex items-center justify-center ">
                            {/* Step 3: Review and Publish */}
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

                            {/* Progress Line */}
                            <div className="w-[100px] md:w-[384.56px] h-1 opacity-100 transition-all duration-300 bg-[#D1D5DB]"></div>

                            {/* Step 2: Article Content */}
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

                            {/* Progress Line */}
                            <div className="w-[100px] md:w-[384.56px] h-1 opacity-100 transition-all duration-300 bg-[#D1D5DB]"></div>

                            {/* Step 1: Basic Information */}
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

                        {/* ============ FORM CONTENT ============ */}
                        <form className='w-full mt-4 md:mt-7' onSubmit={handleSubmit}>

                            {/* Step 1: Basic Information Form */}
                            {currentStep === 1 && (
                                <div className='w-full animate-slideUp'>
                                    {/* Article Title Input */}
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

                                    {/* Article Bio Input */}
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

                                    {/* Cover Image Upload */}
                                    <div className="text-right mt-6 md:mt-8 w-full">
                                        <label className="block font-Inter font-semibold text-[15px] md:text-[17px] leading-[30px] tracking-[0%] text-[#1B1D1E]">
                                            صورة الغلاف
                                        </label>
                                        <label
                                            htmlFor="dropzone-file"
                                            className="mt-3 md:mt-5 flex flex-col items-center justify-center w-full h-[120px] md:h-[143.2px] rounded-[12px] border border-dashed border-[#D1D5DB] opacity-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            {imagePreview ? (
                                                // Show image preview with remove button
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
                                                // Show upload prompt
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

                                    {/* Category Selection */}
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

                            {/* Step 2: Article Content Form */}
                            {currentStep === 2 && (
                                <div className='w-full animate-slideUp flex flex-col items-center justify-center gap-5'>
                                    {/* Dynamic Article Sections */}
                                    {articleSections.map((section, index) => (
                                        <div key={section.id} className='w-full max-w-[896px] rounded-[24px] bg-white p-[24px] gap-[16px] shadow-[0px_2px_4px_-1px_#0000001A,0px_1px_6px_-1px_#00000024] opacity-100 transition-all duration-300 hover:shadow-lg'>
                                            {/* Section Header with Controls */}
                                            <div className='flex flex-row justify-between items-center'>
                                                <div className='flex gap-2'>
                                                    {/* Remove Section Button (only show if multiple sections) */}
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
                                                {/* Drag Handle Icon */}
                                                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.07329 15.7778C1.53857 15.7778 1.08081 15.5874 0.700026 15.2067C0.319239 14.8259 0.128845 14.3681 0.128845 13.8334C0.128845 13.2987 0.319239 12.8409 0.700026 12.4601C1.08081 12.0793 1.53857 11.8889 2.07329 11.8889C2.60801 11.8889 3.06577 12.0793 3.44655 12.4601C3.82734 12.8409 4.01773 13.2987 4.01773 13.8334C4.01773 14.3681 3.82734 14.8259 3.44655 15.2067C3.06577 15.5874 2.60801 15.7778 2.07329 15.7778ZM7.90662 15.7778C7.3719 15.7778 6.91415 15.5874 6.53336 15.2067C6.15257 14.8259 5.96218 14.3681 5.96218 13.8334C5.96218 13.2987 6.15257 12.8409 6.53336 12.4601C6.91415 12.0793 7.3719 11.8889 7.90662 11.8889C8.44135 11.8889 8.8991 12.0793 9.27989 12.4601C9.66067 12.8409 9.85107 13.2987 9.85107 13.8334C9.85107 14.3681 9.66067 14.8259 9.27989 15.2067C8.8991 15.5874 8.44135 15.7778 7.90662 15.7778ZM2.07329 9.9445C1.53857 9.9445 1.08081 9.75411 0.700026 9.37332C0.319239 8.99253 0.128845 8.53478 0.128845 8.00005C0.128845 7.46533 0.319239 7.00758 0.700026 6.62679C1.08081 6.246 1.53857 6.05561 2.07329 6.05561C2.60801 6.05561 3.06577 6.246 3.44655 6.62679C3.82734 7.00758 4.01773 7.46533 4.01773 8.00005C4.01773 8.53478 3.82734 8.99253 3.44655 9.37332C3.06577 9.75411 2.60801 9.9445 2.07329 9.9445ZM7.90662 9.9445C7.3719 9.9445 6.91415 9.75411 6.53336 9.37332C6.15257 8.99253 5.96218 8.53478 5.96218 8.00005C5.96218 7.46533 6.15257 7.00758 6.53336 6.62679C6.91415 6.246 7.3719 6.05561 7.90662 6.05561C8.44135 6.05561 8.8991 6.246 9.27989 6.62679C9.66067 7.00758 9.85107 7.46533 9.85107 8.00005C9.85107 8.53478 9.66067 8.99253 9.27989 9.37332C8.8991 9.75411 8.44135 9.9445 7.90662 9.9445ZM2.07329 4.11117C1.53857 4.11117 1.08081 3.92077 0.700026 3.53998C0.319239 3.1592 0.128845 2.70144 0.128845 2.16672C0.128845 1.632 0.319239 1.17424 0.700026 0.793457C1.08081 0.41267 1.53857 0.222277 2.07329 0.222277C2.60801 0.222277 3.06577 0.41267 3.44655 0.793457C3.82734 1.17424 4.01773 1.632 4.01773 2.16672C4.01773 2.70144 3.82734 3.1592 3.44655 3.53998C3.06577 3.92077 2.60801 4.11117 2.07329 4.11117ZM7.90662 4.11117C7.3719 4.11117 6.91415 3.92077 6.53336 3.53998C6.15257 3.1592 5.96218 2.70144 5.96218 2.16672C5.96218 1.632 6.15257 1.17424 6.53336 0.793457C6.91415 0.41267 7.3719 0.222277 7.90662 0.222277C8.44135 0.222277 8.8991 0.41267 9.27989 0.793457C9.66067 1.17424 9.85107 1.632 9.85107 2.16672C9.85107 2.70144 9.66067 3.1592 9.27989 3.53998C8.8991 3.92077 8.44135 4.11117 7.90662 4.11117Z" fill="#6B7280" />
                                                </svg>
                                            </div>

                                            {/* Section Title */}
                                            <h1 className='font-poppins font-semibold text-[19px] leading-[30px] tracking-[0%] align-middle text-[#1B1D1E] text-right mt-5'>
                                                محتوى المقال {articleSections.length > 1 ? `- القسم ${index + 1}` : ''}
                                            </h1>

                                            {/* Section Form Inputs */}
                                            <div className='mt-4'>
                                                {/* Section Title Input */}
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

                                                {/* Section Content Textarea */}
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

                                                {/* Section Image Upload */}
                                                <div className='mt-5'>
                                                    <label
                                                        htmlFor={`dropzone-file-section-${section.id}`}
                                                        className="flex flex-col items-center justify-center w-full h-[120px] md:h-[143.2px] rounded-[12px] border border-dashed border-[#D1D5DB] opacity-100 cursor-pointer hover:bg-gray-50 transition-all duration-300 hover:border-[#00844B]"
                                                    >
                                                        {section.imagePreview ? (
                                                            // Show section image preview with remove button
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
                                                            // Show upload prompt for section image
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

                                    {/* Add New Section Button */}
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
                                        {/* Cover Image with Edit Button */}
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

                                        {/* Article Header Section */}
                                        <div className='w-full bg-gradient-to-t from-[#2D4639] to-[#000000] opacity-100 p-5'>
                                            {/* Title with Edit Button */}
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

                                        {/* Article Sections Review */}
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
                                                        {/* Section Header with Edit Controls */}
                                                        <div className='flex items-center justify-between mb-3 gap-5'>

                                                            <h1 className='font-poppins font-semibold text-[16px] md:text-[17px] leading-[30px] tracking-[0%] align-middle text-[#1B1D1E] text-right'>
                                                                {section.title || "عنوان محتوي المقال"}
                                                            </h1>
                                                            <div className='flex items-center gap-2'>
                                                                {/* Edit Section Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setCurrentStep(2)}
                                                                    className='w-[28px] h-[28px] rounded-[6px] bg-[#F3F4F6] text-black opacity-100 flex items-center justify-center transition-all duration-300 hover:bg-[#00844B] hover:text-white'
                                                                >
                                                                    <FontAwesomeIcon icon={faPen} className='text-[12px]' />
                                                                </button>
                                                                {/* Reorder Section Button */}
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

                            {/* ============ NAVIGATION BUTTONS ============ */}
                            <div className='mt-6 md:mt-7 flex items-center justify-between gap-3'>
                                {/* Cancel/Previous Button */}
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

                                {/* Next/Submit Button */}
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

            {/* ============ TOAST NOTIFICATION ============ */}
            {showToast && (
                <div className={`fixed top-20 md:top-26 right-4 md:right-17 flex w-[220px] md:w-[250px] h-[45px] px-4 justify-center flex-row-reverse items-center gap-2 rounded-lg bg-white shadow-md transition-all duration-500 z-[10000] animate-toastIn`}>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#00844B] text-lg" />
                    <div className='text-black text-[12px] md:text-[14px] font-[400] font-[Tajawal] not-italic leading-normal'>
                        تم ارسال المنشور للادمن
                    </div>
                </div>
            )}

            {/* ============ ANIMATION STYLES ============ */}
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

            {/* ============ POSTS SECTION 1 ============ */}
            {/* Hero section with latest news and trending topics */}
            <section className='mt-10 md:mt-20 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-15 responsive-padding'>
                {/* Left Section - Latest News & Trending Topics */}
                <section className='flex flex-col gap-4 w-full max-w-[574px]'>
                    {/* Latest News Card */}
                    <div className='h-auto md:h-[272px] w-full self-stretch rounded-[8px] flex-col p-4 flex items-end bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]'>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-black font-[tajawal] text-[24px] md:text-[28px] font-bold leading-normal'>أحدث الأخبار </h1>
                            <FontAwesomeIcon icon={faNewspaper} className='text-[24px] md:text-[28px] text-gray-500'></FontAwesomeIcon>
                        </div>

                        {latestNewsLoading ? (
                            // Loading State for Latest News
                            <>
                                <p className='text-black font-[poppins] mt-5 text-[18px] md:text-[20px] font-semibold leading-normal '>جاري التحميل...</p>

                                <div className='mt-2 flex flex-row-reverse gap-4 items-center'>
                                    <h1 className='flex justify-center items-center gap-2 px-[6px] py-[2px] rounded-[13px] bg-[#B9AF82] text-white font-[poppins] text-[16px] md:text-[20px] font-semibold leading-normal'>إقتصاد</h1>
                                    <p className='text-[#8A8A8A] font-poppins text-[12px] font-normal leading-normal'>جاري التحميل...</p>
                                </div>

                                <div className='w-full h-px bg-[rgba(0,0,0,0.15)] mt-3'></div>

                                <p className='text-black font-[poppins] text-[18px] md:text-[20px] font-semibold leading-normal mt-3'>جاري التحميل...</p>

                                <div className='mt-2 flex flex-row-reverse gap-4 items-center'>
                                    <h1 className='flex justify-center items-center gap-2 px-[10px] py-[3px] rounded-[13px] bg-[#2D4639] text-white font-[poppins] text-[16px] md:text-[20px] font-semibold leading-normal'>تقنية</h1>
                                    <p className='text-[#8A8A8A] font-poppins text-[12px] font-normal leading-normal'> جاري التحميل...</p>
                                </div>
                            </>
                        ) : latestNewsError ? (
                            // Error State for Latest News
                            <>
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
                            </>
                        ) : latestNewsPosts.length > 0 ? (
                            // Success State - Display Latest News from API with improved design
                            <>
                                {latestNewsPosts.map((post, index) => (
                                    <React.Fragment key={post.id}>
                                        <Link
                                            to={`/newsdetails/${post.id}`}
                                            className='cursor-pointer w-full'
                                        >
                                            <p className='text-black font-[poppins] mt-5 text-[18px] text-right md:text-[20px] font-semibold leading-normal hover:text-[#00844B] transition-colors'>
                                                {post.header}
                                            </p>

                                            <div className='mt-2 flex flex-row-reverse gap-3 items-center justify-start'>
                                                {/* Category Badge */}
                                                <h1 className='flex justify-center items-center gap-2 px-[6px] py-[2px] rounded-[13px] bg-[#B9AF82] text-white font-[poppins] text-[14px] md:text-[16px] font-semibold leading-normal'>
                                                    {translateCategory(post.categoryName) || 'عام'}
                                                </h1>

                                                {/* Improved Comment Display */}
                                                <div className='flex items-center gap-1 bg-[#F0F0F0] px-2 py-1 rounded-lg'>
                                                    <FontAwesomeIcon icon={faSquarePollVertical} className='text-[#00844B] text-xs' />
                                                    <span className='text-[#636262] font-poppins text-[11px] font-medium leading-normal'>
                                                        {post.commentCount || 0}
                                                    </span>
                                                </div>

                                                {/* Formatted Date */}
                                                <p className='text-[#8A8A8A] font-poppins text-[11px] font-normal leading-normal'>
                                                    {formatDate(post.createdAt)}
                                                </p>
                                            </div>
                                        </Link>

                                        {/* Separator between posts except for the last one */}
                                        {index < latestNewsPosts.length - 1 && (
                                            <div className='w-full h-px bg-[rgba(0,0,0,0.15)] mt-3'></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </>
                        ) : (
                            // Empty State for Latest News
                            <>
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
                            </>
                        )}
                    </div>

                    {/* Trending Topics Card - Keep exact same design */}
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

                {/* Right Section - Latest Post with API and Rotation - Keep same design */}
                <section className='w-full max-w-[723px] h-auto md:h-[510px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0'>
                    {section1Loading ? (
                        // Loading State
                        <div className='w-full h-full flex items-center justify-center'>
                            <p className='text-gray-500'>جاري التحميل...</p>
                        </div>
                    ) : section1Error ? (
                        // Error State
                        <div className='w-full h-full flex items-center justify-center'>
                            <p className='text-red-500'>{section1Error}</p>
                        </div>
                    ) : section1Posts.length > 0 ? (
                        // Success State - Display Rotating Post
                        <>
                            <div className="relative">
                                {/* Image Loading Overlay */}
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
                                {/* Post Meta Information */}
                                <div className='flex items-center justify-end gap-4'>
                                    <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>
                                        {formatDate(section1Posts[currentSection1Index].createdAt)}
                                    </p>
                                    <h1 className='flex w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>
                                        عاجل
                                    </h1>
                                </div>

                                {/* Post Title */}
                                <h1 className='text-black text-right font-poppins text-[18px] md:text-[20px] font-semibold leading-normal break-words overflow-hidden word-wrap break-word'>
                                    {section1Posts[currentSection1Index].header}
                                </h1>

                                {/* Post Bio/Description */}
                                <p className='text-[#636262] text-right font-tajawal text-[14px] font-normal leading-normal break-words overflow-hidden word-wrap break-word max-h-[72px] overflow-y-auto'>
                                    {section1Posts[currentSection1Index].bio || 'لا توجد نبذة متاحة'}
                                </p>

                                {/* Post Footer with Read More and Author */}
                                <div className='flex items-center justify-between flex-col-reverse md:flex-row gap-4 md:gap-0 md:ms-10'>
                                    <Link
                                        to={`/newsdetails/${section1Posts[currentSection1Index].id}`}
                                        className='flex cursor-pointer px-[10px] py-[8px] justify-center items-center gap-2.5 rounded-[25px] border border-black/13 text-black text-right font-poppins text-[12px] font-normal leading-normal'
                                    >
                                        .....إقراء المزيد
                                    </Link>
                                    <div className='flex items-center gap-4'>
                                        <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>
                                                    {section1Posts[currentSection1Index].userName || 'مجهول'}
                                        </h1>
                                                <img src={section1Posts[currentSection1Index].userImageUrl} className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Empty State
                        <div className='w-full h-full flex items-center justify-center'>
                            <p className='text-gray-500'>لا توجد منشورات متاحة</p>
                        </div>
                    )}
                </section>
            </section>

            {/* ============ LAST NEWS SECTION 2 ============ */}
            {/* Category list and paginated news posts - Keep same design */}
            <section className='mt-25 flex flex-col lg:flex-row gap-8 lg:gap-15 justify-center responsive-padding'>
                {/* Left Section - Categories */}
                <section className='flex flex-col w-full lg:w-[401px] items-end gap-[25px] lg:gap-[43px]'>
                    <div className='flex gap-2'>
                        <h1 className='text-black font-[tajawal] text-[24px] lg:text-[28px] font-bold leading-normal'>فئة المنشورات </h1>
                        <div className='w-[4px] lg:w-[5px] h-[32px] lg:h-[42px] rounded-[1px] bg-[#2D4639]'></div>
                    </div>

                    {/* Categories List */}
                    <section className='flex flex-col justify-end items-center self-stretch p-[15px_10px_16px_20px] lg:p-[21px_10px_16px_28px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
                        {/* Render categories from API */}
                        {categories.slice(0, 6).map((category, index) => (
                            <React.Fragment key={index}>
                                <div
                                    className='flex items-center gap-4 lg:gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors'
                                    onClick={() => navigate('/more-news', {
                                        state: {
                                            categoryName: category.name // Use the actual category name from API
                                        }
                                    })}
                                >
                                    <div className='flex flex-col w-[65%] lg:w-[240px] items-end gap-[12px] lg:gap-[18px]'>
                                        {/* Category Title */}
                                        <div className='flex gap-2'>
                                            <h1 className='text-black font-[tajawal] text-[12px] lg:text-[14px] font-bold leading-normal'>
                                                {category.nameAr || category.name}
                                            </h1>
                                            <div className='w-[3px] lg:w-[5px] h-[18px] lg:h-[24px] rounded-[1px] bg-[#2D4639]'></div>
                                        </div>
                                        {/* Category Description */}
                                        <p className='text-black text-right font-poppins text-[11px] lg:text-[12px] font-normal leading-normal'>
                                            {category.descriptionAr || category.description || `وصف ${category.nameAr || category.name}`}
                                        </p>
                                    </div>
                                    <div className='w-[35%] lg:w-auto'>
                                        <img
                                            src={getCategoryImage(index)}
                                            className='w-full lg:w-[136px] h-[70px] lg:h-[80px] rounded-[4px] object-cover'
                                            alt={`${category.nameAr || category.name} photo`}
                                        />
                                    </div>
                                </div>
                                {/* Separator between categories */}
                                {index < categories.slice(0, 6).length - 1 && (
                                    <div className='w-full lg:w-[316px] h-[1px] bg-black/15 mt-4 lg:mt-6 lg:mb-4'></div>
                                )}
                            </React.Fragment>
                        ))}
                    </section>
                </section>

                {/* Right Section - Latest News with Pagination */}
                <section className='flex flex-col w-full lg:w-auto'>
                    <div className='flex justify-between flex-row-reverse'>
                        <div className='flex gap-2'>
                            <h1 className='text-black font-[tajawal] text-[24px] lg:text-[28px] font-bold leading-normal'>اخر الاخبار</h1>
                            <div className='w-[4px] lg:w-[5px] h-[32px] lg:h-[42px] rounded-[1px] bg-[#2D4639]'></div>
                        </div>
                        <Link to={'/more-news'} state={{ categoryName: "" }} className='text-[#545454] font-poppins text-[16px] lg:text-[20px] font-semibold leading-normal'>...رؤيه المزيد</Link>
                    </div>

                    {/* Posts with API */}
                    {section2Loading ? (
                        // Loading State
                        <div className='flex justify-center items-center h-64 mt-10'>
                            <p className='text-gray-500 text-lg'>جاري التحميل...</p>
                        </div>
                    ) : section2Error ? (
                        // Error State
                        <div className='flex justify-center items-center h-64 mt-10'>
                            <p className='text-red-500 text-lg'>{section2Error}</p>
                        </div>
                    ) : section2Posts.length > 0 ? (
                        // Success State - Display Paginated Posts
                        <>
                            <section className='flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10 mt-6 lg:mt-11'>
                                {/* Column 2 - Last 2 posts */}
                                <div className='flex flex-col space-y-5 lg:space-y-5 w-full lg:w-[426px]'>
                                    {section2Posts.slice(2, 4).map((post) => (
                                        <div key={post.id} className="lg:w-[426px] h-[260px] md:h-[360px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
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
                                                <div className='flex items-center gap-2 w-full justify-end'>
                                                    <h1 className='text-black font-[Poppins] text-[16px] lg:text-[20px] not-italic font-semibold leading-normal break-words overflow-hidden word-wrap break-word text-right max-w-[90%]'>
                                                        {post.header}
                                                    </h1>
                                                    <span className='w-[3px] lg:w-[5px] h-[14px] lg:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)] flex-shrink-0'></span>
                                                </div>

                                                <div className='w-full'>
                                                    <p className='text-black text-right font-[Tajawal] text-[12px] lg:text-sm not-italic font-normal leading-normal break-words overflow-hidden word-wrap break-word max-h-[48px] overflow-y-auto'>
                                                        {post.bio}
                                                    </p>
                                                </div>

                                                <div className='flex justify-between w-full'>
                                                    <Link
                                                        to={`/newsdetails/${post.id}`}
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
                                {/* Column 1 - First 2 posts */}
                                <div className='flex flex-col space-y-5 lg:space-y-5 w-full lg:w-[426px]'>
                                    {section2Posts.slice(0, 2).map((post) => (
                                        <div key={post.id} className="lg:w-[426px] h-[260px] md:h-[360px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col">
                                            <div className="relative">
                                                {/* Image Loading Overlay */}
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
                                                {/* Post Title */}
                                                <div className='flex items-center gap-2 w-full justify-end'>
                                                    <h1 className='text-black font-[Poppins] text-[16px] lg:text-[20px] not-italic font-semibold leading-normal break-words overflow-hidden word-wrap break-word text-right max-w-[90%]'>
                                                        {post.header}
                                                    </h1>
                                                    <span className='w-[3px] lg:w-[5px] h-[14px] lg:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)] flex-shrink-0'></span>
                                                </div>

                                                {/* Post Bio */}
                                                <div className='w-full'>
                                                    <p className='text-black text-right font-[Tajawal] text-[12px] lg:text-sm not-italic font-normal leading-normal break-words overflow-hidden word-wrap break-word max-h-[48px] overflow-y-auto'>
                                                        {post.bio}
                                                    </p>
                                                </div>

                                                {/* Post Footer */}
                                                <div className='flex justify-between w-full'>
                                                    <Link
                                                        to={`/newsdetails/${post.id}`}
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

                            {/* Pagination Controls */}
                            {section2TotalPages > 1 && (
                                <div className='flex gap-2 items-center justify-center mt-8'>
                                    {/* Previous Page Button */}
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

                                    {/* Page Number Buttons */}
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

                                    {/* Next Page Button */}
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
                        // Empty State - Enhanced Design
                        <div className='flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10 mt-6 lg:mt-11'>
                            {/* Column 1 - Empty state for first 2 posts */}
                            <div className='flex flex-col space-y-5 lg:space-y-5 w-full lg:w-[426px]'>
                                {[1, 2].map((item) => (
                                    <div key={item} className="lg:w-[426px] h-[260px] md:h-[360px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col items-center justify-center">
                                        <div className="flex flex-col items-center justify-center text-center p-4">
                                            <FontAwesomeIcon
                                                icon={faNewspaper}
                                                className="text-4xl text-gray-400 mb-4"
                                            />
                                            <h3 className='text-gray-500 font-[Poppins] text-[18px] lg:text-[20px] not-italic font-semibold leading-normal mb-2'>
                                                لا توجد أخبار حالياً
                                            </h3>
                                            <p className='text-gray-400 font-[Tajawal] text-[14px] lg:text-sm not-italic font-normal leading-normal'>
                                                سيتم عرض آخر الأخبار هنا فور توفرها
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Column 2 - Empty state for last 2 posts */}
                            <div className='flex flex-col space-y-5 lg:space-y-5 w-full lg:w-[426px]'>
                                {[3, 4].map((item) => (
                                    <div key={item} className="lg:w-[426px] h-[260px] md:h-[360px] rounded-[8px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col items-center justify-center">
                                        <div className="flex flex-col items-center justify-center text-center p-4">
                                            <FontAwesomeIcon
                                                icon={faClock}
                                                className="text-4xl text-gray-400 mb-4"
                                            />
                                            <h3 className='text-gray-500 font-[Poppins] text-[18px] lg:text-[20px] not-italic font-semibold leading-normal mb-2'>
                                                قريباً
                                            </h3>
                                            <p className='text-gray-400 font-[Tajawal] text-[14px] lg:text-sm not-italic font-normal leading-normal'>
                                                نعمل على إضافة محتوى جديد
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </section>

            {/* ============ MORE NEWS SECTION 3 ============ */}
            {/* Slider section with horizontal scrolling news cards - Keep same design */}
            <section className='mt-20 mb-5 h-auto md:h-[440px] shrink-0 bg-[#1B1D1E] py-10'>
                {/* Section Header Separator */}
                <div className='flex justify-center'>
                    <div className='w-[90%] md:w-[1400px] h-[1px] bg-white'></div>
                </div>

                {/* Section Header with Navigation */}
                <div className='flex justify-between items-center mx-4 md:mx-15 mt-2'>
                    <div className=''>
                        <div className='inline-flex pb-3 flex-col items-end border-b border-white' >
                            <h1 className='text-white text-right font-[Tajawal] text-[14px] not-italic font-normal leading-normal'>اكتشف المزيد من أخبار سوريا</h1>
                        </div>
                    </div>
                    <div className='flex gap-5'>
                        {/* Previous Slide Button */}
                        <FontAwesomeIcon
                            className={`cursor-pointer ${currentSlide === 0 ? 'text-white/30' : 'text-white'}`}
                            icon={faAngleLeft}
                            onClick={prevSlide}
                        ></FontAwesomeIcon>
                        {/* Next Slide Button */}
                        <FontAwesomeIcon
                            className={`cursor-pointer ${currentSlide >= section3Posts.length - cardsToShow ? 'text-white/30' : 'text-white'}`}
                            icon={faAngleRight}
                            onClick={nextSlide}
                        ></FontAwesomeIcon>
                    </div>
                </div>

                {/* Slider Content */}
                <section className='mt-10 ms-4 md:ms-15 overflow-hidden relative'>
                    {section3Loading ? (
                        // Loading State
                        <div className='flex justify-center items-center h-40'>
                            <p className='text-white'>جاري التحميل...</p>
                        </div>
                    ) : section3Error ? (
                        // Error State
                        <div className='flex justify-center items-center h-40'>
                            <p className='text-red-400'>{section3Error}</p>
                        </div>
                    ) : section3Posts.length > 0 ? (
                        // Success State - Slider with API Posts
                        <div
                            ref={sliderRef}
                            className='flex gap-4 md:gap-7 transition-transform duration-300 ease-in-out'
                            style={{ transform: `translateX(-${currentSlide * cardWidth}px)` }}
                        >
                            {section3Posts.map((post, index) => (
                                <Link
                                    key={post.id}
                                    to={`/newsdetails/${post.id}`}
                                    className='flex w-[220px] md:w-[261px] h-[270px] md:h-[297px] flex-col items-end gap-2 flex-shrink-0 no-underline'
                                >
                                    <div className="relative w-full h-[140px] md:h-[160px]">
                                        {/* Image Loading Overlay */}
                                        {imageLoadingStates[post.id] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-[4px]">
                                                <p className="text-white text-sm">جاري تحميل الصورة...</p>
                                            </div>
                                        )}
                                        <img
                                            src={post.imageUrl || "morepost-1.png"}
                                            className={`h-[140px] md:h-[160px] w-full shrink-0 self-stretch rounded-[4px] object-cover ${imageLoadingStates[post.id] ? 'opacity-0' : 'opacity-100'}`}
                                            alt={post.header}
                                            onLoad={() => handleImageLoad(post.id)}
                                            onError={() => handleImageError(post.id)}
                                        />
                                    </div>
                                    {/* Post Title */}
                                    <h1 className='text-white text-right font-[Poppins] text-[16px] md:text-[20px] not-italic font-semibold leading-normal line-clamp-2'>
                                        {post.header}
                                    </h1>
                                    {/* Post Bio */}
                                    <div className="w-[90%] md:w-[80%]">
                                        <p className="text-[#8A8A8A] text-right font-[Tajawal] text-[12px] md:text-[14px] not-italic font-normal leading-4 self-stretch line-clamp-3">
                                            {post.bio || 'لا توجد نبذة متاحة'}
                                        </p>
                                    </div>

                                </Link>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className='flex justify-center items-center h-40'>
                            <p className='text-white'>لا توجد منشورات متاحة</p>
                        </div>
                    )}
                </section>
            </section>

            {/* Additional Animation Styles */}
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
                
                /* Text truncation utilities */
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                /* Responsive utilities */
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