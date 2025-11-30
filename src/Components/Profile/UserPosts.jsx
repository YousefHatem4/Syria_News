import React, { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTrashCan, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { userContext } from '../Context/userContext';
import { BASE_URL } from '../../App'
import { Link, useNavigate } from 'react-router-dom';

export default function UserPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  let { userToken } = useContext(userContext);
  const navigate = useNavigate();

  /**
   * Fetches user articles from API with pagination
   */
  const fetchUserPosts = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}users/articles`, {
        params: {
          page: page,
          size: 6, // 6 posts per page for better layout
          sort: 'createdAt,desc'
        },
        headers: userToken ? {
          'Authorization': `Bearer ${userToken}`,
          'Accept': 'application/json',
        } : {
          'Accept': 'application/json',
        }
      });

      if (response.data && Array.isArray(response.data.content)) {
        setUserPosts(response.data.content);
        setTotalPages(response.data.totalPages || 1);

        // Initialize image loading states
        const newLoadingStates = {};
        response.data.content.forEach((post) => {
          if (post.imageUrl) {
            newLoadingStates[post.articleId] = true;
          }
        });
        setImageLoadingStates(newLoadingStates);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('فشل في تحميل المنشورات');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles image load completion
   */
  const handleImageLoad = (articleId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [articleId]: false
    }));
  };

  /**
   * Handles image load error
   */
  const handleImageError = (articleId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [articleId]: false
    }));
  };

  /**
   * Formats date to relative time (e.g., "منذ 3 أيام")
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
   * Handles pagination
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUserPosts(newPage);
  };

  /**
   * Generates pagination buttons (similar to home page)
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

  /**
   * Handles post click - navigates to newsdetails page
   */
  const handlePostClick = (articleId) => {
    navigate(`/newsdetails/${articleId}`);
  };

  /**
   * Handles delete button click (prevents navigation when clicking delete)
   */
  const handleDeleteClick = (e, articleId) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    // Add your delete logic here
    console.log('Delete post:', articleId);
    // You can add a confirmation modal and API call here
  };

  useEffect(() => {
    fetchUserPosts(0);
  }, []);

  return (
    <section className='flex w-full md:w-[804px] pt-6 md:pt-8 pr-4 md:pr-[33px] pb-6 md:pb-[33px] pl-4 md:pl-[33px] flex-col gap-4 md:gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
      {/* title */}
      <div className='flex items-end flex-col w-full'>
        <section className='relative w-full'>
          <h1 className='text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]'>منشوراتي</h1>
          <div className='w-[50px] md:w-[70px] absolute start-92 md:start-166 top-9 md:top-11 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
        </section>
      </div>

      {/* posts */}
      {loading ? (
        // Loading State
        <div className='flex items-center justify-center mt-4 md:mt-6 w-full'>
          <div className="w-full sm:w-[367px] h-auto sm:h-[355px] rounded-[8px] bg-white shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col items-center justify-center">
            <p className='text-gray-500 text-lg'>جاري التحميل...</p>
          </div>
        </div>
      ) : error ? (
        // Error State
        <div className='flex items-center justify-center mt-4 md:mt-6 w-full'>
          <div className="w-full sm:w-[367px] h-auto sm:h-[355px] rounded-[8px] bg-white shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col items-center justify-center">
            <p className='text-red-500 text-lg'>{error}</p>
          </div>
        </div>
      ) : userPosts.length > 0 ? (
        // Success State - Display User Posts with Grid Layout
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 w-full mt-4 md:mt-6'>
            {userPosts.map((post) => (
              <div
                key={post.articleId}
                className="w-full h-auto rounded-[8px] bg-white shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                onClick={() => handlePostClick(post.articleId)}
              >
                <div className="relative">
                  {/* Image Loading Overlay */}
                  {imageLoadingStates[post.articleId] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-t-[8px]">
                      <p className="text-gray-500">جاري تحميل الصورة...</p>
                    </div>
                  )}
                  <img
                    className={`w-full h-[180px] sm:h-[204px] shrink-0 rounded-t-[8px] object-cover ${imageLoadingStates[post.articleId] ? 'opacity-0' : 'opacity-100'}`}
                    src={post.imageUrl || "post_image.jpg"}
                    alt={post.header}
                    onLoad={() => handleImageLoad(post.articleId)}
                    onError={() => handleImageError(post.articleId)}
                  />
                </div>

                <div className="flex w-full px-4 py-1 flex-col items-end gap-3 mt-2 sm:mt-4">
                  {/* title of post */}
                  <div className='flex items-center gap-2 w-full justify-end'>
                    <h1 className='text-black font-[Poppins] text-[18px] md:text-[20px] not-italic font-semibold leading-normal break-words overflow-hidden word-wrap break-word text-right max-w-[90%] hover:text-[#00844B] transition-colors'>
                      {post.header}
                    </h1>
                    <span className='w-[4px] md:w-[5px] h-[16px] md:h-[19px] rounded-[1px] bg-[var(--dark-green-2-d-4639,#2D4639)] flex-shrink-0'></span>
                  </div>

                  {/* description */}
                  <div className='w-full'>
                    <p className='text-black text-right font-[Tajawal] text-[13px] md:text-sm not-italic font-normal leading-normal break-words overflow-hidden word-wrap break-word max-h-[48px] overflow-y-auto'>
                      {post.bio}
                    </p>
                  </div>

                  <div className='flex justify-between w-full'>
                    <div
                      className='text-[var(--Gray,#8A8A8A)] cursor-pointer ms-4 text-right font-[Poppins] text-[11px] md:text-xs not-italic font-normal leading-normal flex items-center gap-1 hover:text-red-500 transition-colors'
                      onClick={(e) => handleDeleteClick(e, post.articleId)}
                    >
                      <p>حذف</p>
                      <FontAwesomeIcon className='text-[#000000] hover:text-red-500 transition-colors' icon={faTrashCan} />
                    </div>

                    <div className='text-[var(--Gray,#8A8A8A)] text-right font-[Poppins] text-[11px] md:text-xs not-italic font-normal leading-normal flex items-center gap-2'>
                      <p>{formatDate(post.createdAt)}</p>
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className='flex gap-2 items-center justify-center mt-8'>
              {/* Previous Page Button */}
              <button
                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${currentPage === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#2D4639] text-white hover:bg-[#00844B]"
                  }`}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
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
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </div>
          )}
        </>
      ) : (
        // Empty State
        <div className='flex items-center justify-center mt-4 md:mt-6 w-full'>
          <div className="w-full sm:w-[367px] h-auto sm:h-[355px] rounded-[8px] bg-white shadow-[0_8px_4px_rgba(0,0,0,0.41)] flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <FontAwesomeIcon
                icon={faTrashCan}
                className="text-4xl text-gray-400 mb-4"
              />
              <h3 className='text-gray-500 font-[Poppins] text-[18px] lg:text-[20px] not-italic font-semibold leading-normal mb-2'>
                لا توجد منشورات
              </h3>
              <p className='text-gray-400 font-[Tajawal] text-[14px] lg:text-sm not-italic font-normal leading-normal'>
                لم تقم بنشر أي مقالات بعد
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}