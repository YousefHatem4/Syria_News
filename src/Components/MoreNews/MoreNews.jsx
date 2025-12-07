import React, { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faClock } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../App'

/**
 * MoreNews Component - Displays a comprehensive news listing page with pagination and filtering
 * Features:
 * - Paginated news posts from API with category filtering
 * - Responsive grid layout for news cards
 * - Slider section for featured posts
 * - Breadcrumb navigation
 * - Image loading states and error handling
 * - Arabic language support with right-to-left layout
 */
export default function MoreNews() {
  // ============ API POSTS STATE MANAGEMENT ============
  const [posts, setPosts] = useState([]); // Array of news posts from API
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for API failures
  const [currentPage, setCurrentPage] = useState(0); // Current pagination page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages available
  const [imageLoadingStates, setImageLoadingStates] = useState({}); // Tracks loading state for each post image
  const [categories, setCategories] = useState([]); // Available categories for filtering

  // ============ SLIDER STATE MANAGEMENT ============
  const [currentSlide, setCurrentSlide] = useState(0); // Current slide index for featured posts slider
  const sliderRef = useRef(null); // Reference for slider container
  const cardWidth = 261; // Fixed width for each card in pixels
  const cardsToShow = 5; // Number of cards to show at once in slider

  // Get location to access passed state (for category filtering)
  const location = useLocation();

  // ============ API FUNCTIONS ============

  /**
   * Fetches categories from API for display and filtering
   * Falls back to default categories if API fails
   */
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}categories`);
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { name: 'Arts', nameAr: 'الفنون' },
        { name: 'Sports', nameAr: 'الرياضة' },
        { name: 'Economy', nameAr: 'الاقتصاد' },
        { name: 'Politics', nameAr: 'السياسة' },
      ]);
    }
  };

  /**
   * Fetches posts from /articles/filter API with form-data
   * Supports category filtering passed via location state
   */
  const fetchPosts = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      // Get category from location state or use empty string (all categories)
      const categoryName = location.state?.categoryName || "";

      console.log('Fetching posts with category:', categoryName);

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('page', page.toString());
      formData.append('size', '10'); // 6 posts per page
      formData.append('categoryName', categoryName);
      formData.append('status', 'approved'); // Only show approved posts
      formData.append('startDate', ''); // No date filter
      formData.append('endDate', ''); // No date filter

      console.log('Fetching posts with form-data:');
      for (let [key, value] of formData.entries()) {
        console.log(key + ': ' + value);
      }

      const response = await axios.post(`${BASE_URL}articles/filter`, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // 10 second timeout
        withCredentials: false
      });

      if (response.data && Array.isArray(response.data.content)) {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages || 1);

        // Initialize image loading states for all posts
        const newLoadingStates = {};
        response.data.content.forEach((post) => {
          if (post.imageUrl) {
            newLoadingStates[post.id] = true;
          }
        });
        setImageLoadingStates(newLoadingStates);

        console.log('Successfully fetched posts:', response.data.content.length);
        console.log('Posts category filter:', categoryName);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);

      // More specific error handling with user-friendly messages
      if (err.code === 'ERR_NETWORK') {
        setError('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      } else if (err.response?.status === 400) {
        setError('طلب غير صالح. يرجى المحاولة مرة أخرى.');
      } else if (err.response?.status === 404) {
        setError('لم يتم العثور على البيانات المطلوبة.');
      } else {
        setError('فشل في تحميل المنشورات. يرجى المحاولة مرة أخرى لاحقاً.');
      }

      setPosts([]); // Clear posts on error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Alternative: Try using the /articles/status endpoint if /filter doesn't work
   * Fallback method for better reliability
   */
  const fetchPostsAlternative = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}articles/status`, {
        params: {
          page: page,
          size: 10, // 10 posts per page for alternative endpoint
          status: 'approved',
          sort: 'desc' // Newest first
        }
      });

      if (response.data && Array.isArray(response.data.content)) {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages || 1);

        // Initialize image loading states for alternative posts
        const newLoadingStates = { ...imageLoadingStates };
        response.data.content.forEach((post) => {
          if (post.imageUrl && !newLoadingStates[post.id]) {
            newLoadingStates[post.id] = true;
          }
        });
        setImageLoadingStates(newLoadingStates);

        console.log('Successfully fetched posts from alternative endpoint:', response.data.content.length);
      }
    } catch (err) {
      console.error('Error fetching posts from alternative endpoint:', err);
      setError('فشل في تحميل المنشورات. يرجى المحاولة مرة أخرى لاحقاً.');
      setPosts([]);
    } finally {
      setLoading(false);
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
   * Formats date to relative time (e.g., "منذ 30 دقيقة")
   * Converts ISO date string to human-readable relative time in Arabic
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
        return date.toLocaleDateString('ar-EG'); // Arabic locale for older dates
      }
    } catch (error) {
      return 'تاريخ غير معروف'; // Fallback for invalid dates
    }
  };

  /**
   * Gets Arabic category name by English name
   * Used for displaying category badges in Arabic
   */
  const getCategoryNameAr = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.nameAr || category.name : categoryName || 'أخبار';
  };

  /**
   * Handles pagination navigation
   * Fetches new page when pagination controls are used
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchPosts(newPage);
  };

  /**
   * Generates pagination buttons (similar to Home page logic)
   * Shows max 3 buttons with current page in middle when possible
   */
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 3;

    if (totalPages <= maxButtons) {
      // Show all pages if total pages <= 3
      for (let i = 0; i < totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Show sliding window of 3 pages
      if (currentPage === 0) {
        buttons.push(0, 1, 2);
      } else if (currentPage === totalPages - 1) {
        buttons.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        buttons.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return buttons;
  };

  // ============ SLIDER FUNCTIONS ============

  /**
   * Moves slider to next set of cards
   * Handles right arrow click in featured posts slider
   */
  const nextSlide = () => {
    if (currentSlide < posts.length - cardsToShow) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  /**
   * Moves slider to previous set of cards
   * Handles left arrow click in featured posts slider
   */
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // ============ EFFECT HOOKS ============

  /**
   * Fetch categories on component mount
   * Needed for displaying category names in Arabic
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetch posts when component mounts or location changes
   * Uses main endpoint first, falls back to alternative if it fails
   * Re-fetches when location changes (for category filtering)
   */
  useEffect(() => {
    // Try the main endpoint first, fallback to alternative if it fails
    fetchPosts(0).catch(() => {
      console.log('Main endpoint failed, trying alternative...');
      fetchPostsAlternative(0);
    });
  }, [location]); // Re-fetch when location changes (category filter)

  // ============ RENDER FUNCTIONS ============

  /**
   * Renders a single news card component
   * Displays image, title, description, category, and metadata
   */
  const renderNewsCard = (post, index) => (
    <section key={post.id || index} className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-0 lg:mt-0'>
      {/* Image with loading state */}
      <div className="relative">
        {imageLoadingStates[post.id] && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-t-[8px]">
            <p className="text-gray-500">جاري تحميل الصورة...</p>
          </div>
        )}
        <img
          src={post.imageUrl || "post.jpg"}
          className={`w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover ${imageLoadingStates[post.id] ? 'opacity-0' : 'opacity-100'}`}
          alt="post_Photo"
          onLoad={() => handleImageLoad(post.id)}
          onError={() => handleImageError(post.id)}
        />
      </div>

      {/* Card content */}
      <Link to={`/newsdetails/${post.id}`} className='flex-col p-4 flex gap-4 sm:gap-5 md:gap-6'>
        {/* Meta information - date and category */}
        <div className='flex items-center justify-end gap-4'>
          <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>
            {formatDate(post.createdAt)}
          </p>
          {/* Category badge */}
          <h1 className='flex w-auto px-[10px] py-[4px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>
            {getCategoryNameAr(post.categoryName)}
          </h1>
        </div>

        {/* Post title */}
        <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal break-words'>
          {post.header}
        </h1>

        {/* Post description/bio */}
        <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal break-words max-h-[72px] overflow-y-auto'>
          {post.bio || 'لا توجد نبذة متاحة'}
        </p>

        {/* Footer with read more link and author info */}
        <div className='flex items-center justify-end flex-col-reverse md:flex-row gap-4 md:gap-0 '>

          <div className='flex items-center gap-4'>
            <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>
              {post.userName || 'مجهول'}
            </h1>
            <img src={post.userImageUrl || "profile.jpg"} className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
          </div>
        </div>
      </Link>
    </section>
  );

  /**
   * Renders empty state when no posts are available
   * Shows a placeholder card with message
   */
  const renderEmptyState = () => (
    <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-0 lg:mt-0 flex items-center justify-center'>
      <p className='text-gray-500 text-center'>لا يوجد منشورات حالياً</p>
    </section>
  );

  return (
    <>
      {/* ============ MAIN CONTAINER ============ */}
      <section className='bg-[linear-gradient(164deg,#004025_-0.36%,rgba(255,255,255,0.80)_34.44%,rgba(0,64,37,0.50)_101.6%)] h-auto pb-10 relative flex flex-col'>

        {/* ============ BREADCRUMB NAVIGATION ============ */}
        {/* Shows current page location with responsive positioning */}
        <section className='flex items-center gap-3 absolute top-47 sm:top-20 md:top-28 lg:top-35 left-4 sm:left-8 md:left-12 lg:left-15'>
          <Link to={'/'} className='font-poppins text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-normal text-white'> الصفحه الرئيسه </Link>
          <FontAwesomeIcon icon={faAngleRight} className='text-white text-sm md:text-base'></FontAwesomeIcon>
          <h1 className='font-poppins text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-normal text-[#00341E]'>جميع الأخبار </h1>
        </section>

        {/* ============ HERO SECTION - TWO MAIN POSTS ============ */}
        {/* First two posts displayed prominently at the top */}
        <section className=' flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-15 px-4 sm:px-6 md:px-8 lg:px-0  mt-60 sm:mt-32 md:mt-36 lg:mt-50'>

          {/* ============ LEFT POST CARD ============ */}
          {loading ? (
            // Loading state for left card
            <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0 flex items-center justify-center'>
              <p className='text-gray-500'>جاري التحميل...</p>
            </section>
          ) : error ? (
            // Error state for left card
            <section className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0 flex items-center justify-center'>
              <p className='text-red-500 text-center text-sm'>{error}</p>
            </section>
          ) : posts.length > 0 ? (
            // Success state - render first post
            renderNewsCard(posts[0], 0)
          ) : (
            // Empty state
            renderEmptyState()
          )}

          {/* ============ RIGHT POST CARD ============ */}
          {loading ? (
            // Loading state for right card
            <section className='w-full max-w-[869px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0 flex items-center justify-center'>
              <p className='text-gray-500'>جاري التحميل...</p>
            </section>
          ) : error ? (
            // Error state for right card
            <section className='w-full max-w-[869px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0 flex items-center justify-center'>
              <p className='text-red-500 text-center text-sm'>{error}</p>
            </section>
          ) : posts.length > 1 ? (
            // Success state - render second post with larger layout
            <section className='w-full max-w-[869px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0'>
              <div className="relative">
                {imageLoadingStates[posts[1].id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-t-[8px]">
                    <p className="text-gray-500">جاري تحميل الصورة...</p>
                  </div>
                )}
                <img
                  src={posts[1].imageUrl || "post.jpg"}
                  className={`w-full h-[180px] md:h-[228px] flex-shrink-0 rounded-t-[8px] rounded-b-[0px] object-cover ${imageLoadingStates[posts[1].id] ? 'opacity-0' : 'opacity-100'}`}
                  alt="post_Photo"
                  onLoad={() => handleImageLoad(posts[1].id)}
                  onError={() => handleImageError(posts[1].id)}
                />
              </div>

              {/* Card content for second post */}
              <Link to={`/newsdetails/${posts[1].id}`} className='flex-col p-4 flex gap-4  sm:gap-5 md:gap-6 lg:gap-8'>
                <div className='flex items-center justify-end gap-4'>
                  <p className='text-[#8A8A8A] text-right font-[poppins] text-[12px] font-normal leading-normal'>
                    {formatDate(posts[1].createdAt)}
                  </p>
                  <h1 className='flex w-auto px-[10px] py-[4px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[14px] md:text-[16px] font-[tajawal] font-bold leading-normal text-right'>
                    {getCategoryNameAr(posts[1].categoryName)}
                  </h1>
                </div>

                <h1 className='text-black text-right font-poppins text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-normal break-words'>
                  {posts[1].header}
                </h1>

                <p className='text-[#636262] text-right font-tajawal text-[13px] sm:text-[13.5px] md:text-[14px] font-normal leading-normal break-words'>
                  {posts[1].bio || 'لا توجد نبذة متاحة'}
                </p>

                <div className='flex items-center justify-end flex-col-reverse md:flex-row gap-4 md:gap-0 '>

                  <div className='flex items-center gap-4'>
                    <h1 className='text-black text-right font-poppins text-[12px] font-normal leading-normal'>
                      {posts[1].userName || 'مجهول'}
                    </h1>
                    <img src={posts[1].userImageUrl || "profile.jpg"} className='w-[41px] h-[41px] rounded-[41px] object-cover' alt="" />
                  </div>
                </div>
              </Link>
            </section>
          ) : posts.length === 1 ? (
            // If only one post exists, show empty state for right section
            <section className='w-full max-w-[869px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-8 lg:mt-0 flex items-center justify-center'>
              <p className='text-gray-500 text-center'>لا يوجد منشورات حالياً</p>
            </section>
          ) : (
            renderEmptyState()
          )}
        </section>

        {/* ============ POSTS GRID SECTION ============ */}
        {/* Additional posts displayed in a responsive grid layout */}
        <section className='p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col gap-6 sm:gap-8 lg:gap-10'>
          {loading ? (
            // Loading state for posts grid - show skeleton cards
            <div className='flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10'>
              {[1, 2, 3].map((item) => (
                <section key={item} className='w-full max-w-[423px] h-auto md:h-[550px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-0 lg:mt-0 flex items-center justify-center'>
                  <p className='text-gray-500'>جاري التحميل...</p>
                </section>
              ))}
            </div>
          ) : error ? (
            // Error state for posts grid
            <div className='flex justify-center items-center'>
              <p className='text-red-500 text-center'>{error}</p>
            </div>
          ) : posts.length > 2 ? (
            // Success state with API data - render posts in rows
            <>
              {/* First row of posts (posts 3-5) - FIXED WIDTH CARDS */}
              <div className='flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10'>
                {posts.slice(2, 5).map((post, index) => (
                  <div key={post.id || index} className={`${index === 2 ? 'hidden xl:block' : ''} w-full max-w-[423px]`}>
                    {renderNewsCard(post, index)}
                  </div>
                ))}
              </div>

              {/* Second row of posts (posts 6-8) - only show if enough posts - FIXED WIDTH CARDS */}
              <div className='flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10'>
                {posts.slice(5, 8).map((post, index) => (
                  <div key={post.id || index} className={`${index === 2 ? 'hidden xl:block' : ''} w-full max-w-[423px]`}>
                    {renderNewsCard(post, index)}
                  </div>
                ))}
              </div>
            </>
          ) : posts.length > 0 ? (
            // Not enough posts for grid layout - show empty message
            <div className='flex justify-center items-center'>
              <p className='text-gray-500'>لا يوجد منشورات حالياً</p>
            </div>
          ) : (
            // No posts at all
            <div className='flex justify-center items-center'>
              <p className='text-gray-500'>لا يوجد منشورات حالياً</p>
            </div>
          )}
        </section>

        {/* ============ PAGINATION CONTROLS ============ */}
        {/* Only show if we have API data and multiple pages */}
        {!loading && posts.length > 0 && totalPages > 1 && (
          <div className='flex gap-2 items-center justify-center mt-8 mb-8'>
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${currentPage === 0
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
                onClick={() => handlePageChange(pageNumber)}
                className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${currentPage === pageNumber
                  ? "bg-[#00844B] text-white"
                  : "bg-[#2D4639] text-white hover:bg-[#00844B]"
                  }`}
              >
                {pageNumber + 1}
              </button>
            ))}

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${currentPage === totalPages - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#2D4639] text-white hover:bg-[#00844B]"
                }`}
            >
              →
            </button>
          </div>
        )}

        {/* ============ FEATURED POSTS SLIDER SECTION ============ */}
        {/* Horizontal slider with featured posts - Only show if we have enough posts */}
        {!loading && posts.length >= cardsToShow && (
          <section className='mt-3 mb-5 h-auto md:h-[440px] shrink-0 bg-[#1B1D1E] py-8 sm:py-9 md:py-10'>
            <div className='flex justify-center'>
              <div className='w-[90%] md:w-[95%] lg:w-[1400px] h-[1px] bg-white'></div>
            </div>

            {/* Slider header with navigation */}
            <div className='flex justify-between items-center mx-4 sm:mx-6 md:mx-10 lg:mx-15 mt-4 sm:mt-3 md:mt-2'>
              <div className=''>
                <div className='inline-flex pb-3 flex-col items-end border-b border-white' >
                  <h1 className='text-white text-right font-[Tajawal] text-[12px] sm:text-[13px] md:text-[14px] not-italic font-normal leading-normal'>اكتشف المزيد من أخبار سوريا</h1>
                </div>
              </div>
              {/* Slider navigation arrows */}
              <div className='flex gap-3 sm:gap-4 md:gap-5'>
                <FontAwesomeIcon
                  className={`cursor-pointer text-base sm:text-lg md:text-xl ${currentSlide === 0 ? 'text-white/30' : 'text-white'}`}
                  icon={faAngleLeft}
                  onClick={prevSlide}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                  className={`cursor-pointer text-base sm:text-lg md:text-xl ${currentSlide >= posts.length - cardsToShow ? 'text-white/30' : 'text-white'}`}
                  icon={faAngleRight}
                  onClick={nextSlide}
                ></FontAwesomeIcon>
              </div>
            </div>

            {/* Slider content with horizontal scroll */}
            <section className='mt-6 sm:mt-8 md:mt-10 ms-4 sm:ms-6 md:ms-10 lg:ms-15 overflow-hidden relative'>
              <div
                ref={sliderRef}
                className='flex gap-4 sm:gap-5 md:gap-6 lg:gap-7 transition-transform duration-300 ease-in-out'
                style={{ transform: `translateX(-${currentSlide * cardWidth}px)` }}
              >
                {posts.slice(0, 8).map((post) => (
                  <div key={post.id} className='flex w-[200px] sm:w-[220px] md:w-[240px] lg:w-[261px] h-[260px] sm:h-[270px] md:h-[285px] lg:h-[297px] flex-col items-end gap-2 flex-shrink-0'>
                    <img
                      src={post.imageUrl || "post.jpg"}
                      className='h-[130px] sm:h-[140px] md:h-[150px] lg:h-[160px] shrink-0 self-stretch rounded-[4px] object-cover'
                      alt={post.header}
                    />
                    <h1 className='text-white text-right font-[Poppins] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] not-italic font-semibold leading-normal'>{post.header}</h1>
                    <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%]">
                      <p className="text-[#8A8A8A] text-right font-[Tajawal] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] not-italic font-normal leading-4 self-stretch">
                        {post.bio || 'لا توجد نبذة متاحة'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}

        {/* ============ EMPTY STATE MESSAGE ============ */}
        {/* Show empty message if no posts at all and not loading */}
        {!loading && posts.length === 0 && !error && (
          <section className='flex justify-center items-center mt-10 mb-10'>
            <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
              <p className='text-gray-500 text-lg font-tajawal'>لا يوجد منشورات حالياً</p>
            </div>
          </section>
        )}

      </section>
    </>
  )
}