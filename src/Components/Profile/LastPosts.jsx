import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet, faEye, faCheck, faXmark, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { userContext } from '../Context/userContext';
import { BASE_URL } from '../../App';



export default function LastPosts() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [filterStatus, setFilterStatus] = useState("approved");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const postsPerPage = 10;

  // Get user token from context
  const { userToken } = useContext(userContext);

  // Fetch posts from API with authentication
  const fetchPosts = async (page = 0, status = "approved") => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching posts with status:", status);
      console.log("User token available:", !!userToken);

      // Check if we have authentication token
      if (!userToken) {
        throw new Error("يجب تسجيل الدخول أولاً للوصول إلى المنشورات");
      }

      const params = {
        page: page,
        size: postsPerPage,
        status: status,
        sort: 'desc'
      };

      console.log("API Request with params:", params);

      const response = await axios.get(`${BASE_URL}articles/status`, {
        params: params,
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      console.log("API Response received:", response.data);

      if (response.data && Array.isArray(response.data.content)) {
        // Convert API status (UPPERCASE) to match our filter (lowercase)
        const apiStatusToFilterStatus = {
          'APPROVED': 'approved',
          'PENDING': 'pending',
          'REJECTED': 'rejected'
        };

        // Filter posts client-side - convert API status to lowercase for comparison
        const filteredPosts = response.data.content.filter(post => {
          const postStatusNormalized = apiStatusToFilterStatus[post.status] || post.status.toLowerCase();
          return postStatusNormalized === status;
        });

        console.log(`API returned ${response.data.content.length} posts, filtered to ${filteredPosts.length} posts with status: ${status}`);
        console.log("Filtered posts:", filteredPosts);

        setPosts(filteredPosts);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || filteredPosts.length);
      } else {
        console.error("Invalid response format - content is not an array:", response.data);
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);

      let errorMessage = "فشل في تحميل البيانات";

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        console.log("Error response data:", data);

        if (data && data.message === 'Access Denied') {
          errorMessage = "غير مصرح بالوصول - يرجى التأكد من تسجيل الدخول";
        } else if (status === 401) {
          errorMessage = "انتهت صلاحية الجلسة - يرجى تسجيل الدخول مرة أخرى";
        } else if (status === 403) {
          errorMessage = "غير مصرح بالوصول إلى هذه البيانات";
        } else if (status === 400) {
          errorMessage = "طلب غير صحيح - يرجى المحاولة مرة أخرى";
        } else if (status === 404) {
          errorMessage = "لم يتم العثور على البيانات المطلوبة";
        } else if (status === 500) {
          errorMessage = "خطأ في الخادم - يرجى المحاولة لاحقاً";
        } else {
          errorMessage = `خطأ في الخادم (${status})`;
        }

        // Add server message if available
        if (data && data.message && data.message !== 'Access Denied') {
          errorMessage += `: ${data.message}`;
        }
      } else if (err.request) {
        errorMessage = "لا يمكن الاتصال بالخادم - يرجى التحقق من اتصال الإنترنت";
      } else {
        errorMessage = err.message || "حدث خطأ غير متوقع";
      }

      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Update post status - FIXED VERSION with PUT and boolean status
  const updatePostStatus = async (postId, isApproved) => {
    try {
      console.log("Updating post status:", { postId, isApproved });

      if (!userToken) {
        throw new Error("يجب تسجيل الدخول أولاً");
      }

      // Send boolean value directly: true for approved, false for rejected
      console.log("Sending status update with boolean value:", isApproved);

      // Try PUT with boolean parameter
      const response = await axios.put(
        `${BASE_URL}articles/${postId}/review?status=${isApproved}`,
        null,
        {
          timeout: 10000,
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Accept': 'application/json',
          }
        }
      );

      console.log("Status update successful:", response.data);

      // Refresh the posts after status update
      fetchPosts(currentPage, filterStatus);

      return true;
    } catch (err) {
      console.error("Error updating post status:", err);

      let errorMessage = "فشل في تحديث الحالة";

      if (err.response) {
        errorMessage += `: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`;
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || err.message?.includes('CORS')) {
        errorMessage = "خطأ في الاتصال بالخادم - يرجى التحقق من إعدادات CORS في الخادم";
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "انتهت مهلة الطلب - يرجى المحاولة مرة أخرى";
      } else {
        errorMessage += `: ${err.message}`;
      }

      setError(errorMessage);
      return false;
    }
  };

  // Load posts when component mounts or when page/filter changes
  useEffect(() => {
    fetchPosts(currentPage, filterStatus);
  }, [currentPage, filterStatus, userToken]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const newStatus = e.target.value;
    setFilterStatus(newStatus);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date to "منذ سنة" format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffDays / 365);

      if (diffYears > 0) {
        return `منذ ${diffYears} سنة`;
      } else if (diffMonths > 0) {
        return `منذ ${diffMonths} شهر`;
      } else if (diffDays > 0) {
        return `منذ ${diffDays} يوم`;
      } else {
        return "اليوم";
      }
    } catch (error) {
      return "تاريخ غير معروف";
    }
  };

  // Calculate total interactions (comments + reactions)
  const calculateInteractions = (post) => {
    const commentsCount = post.comments ? post.comments.length : 0;
    const reactionsCount = post.reactions ? post.reactions.length : 0;
    const total = commentsCount + reactionsCount;

    if (total >= 1000) {
      return `${(total / 1000).toFixed(1)}K`;
    }
    return total.toString();
  };

  // Map API status to display status - handle both UPPERCASE and lowercase
  const getDisplayStatus = (status) => {
    const statusNormalized = status.toUpperCase();
    switch (statusNormalized) {
      case "APPROVED": return "accepted";
      case "REJECTED": return "rejected";
      case "PENDING": return "pending";
      default: return "pending";
    }
  };

  // Generate pagination numbers (3 numbers with arrows)
  const getPaginationNumbers = () => {
    const pages = [];
    const totalDisplayPages = Math.min(3, totalPages);

    if (totalPages <= 3) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage === 0) {
        pages.push(0, 1, 2);
      } else if (currentPage === totalPages - 1) {
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  };

  return (
    <>
      <style>
        {`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}
      </style>

      {/* Large Screen Version */}
      <section className="hidden lg:flex w-[804px] px-[17px] pt-8 pb-8 flex-col items-center gap-[33.2px] shrink-0 rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]">
        {/* Header with title and filter */}
        <div className="flex justify-between items-end w-full">
          {/* Filter select box */}
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="w-[180px] h-[40px] px-3 rounded-[5px] bg-[#2D4639] border border-[#E9C882] text-[#E9C882] text-right font-[Cairo] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#E9C882]"
            >
              <option value="approved">المقبولة</option>
              <option value="rejected">المرفوضة</option>
              <option value="pending">قيد المراجعة</option>
            </select>
          </div>

          {/* title */}
          <section className="relative">
            <h1 className="text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]">
              آخر المنشورات
            </h1>
            <div className="w-[50px] md:w-[70px] absolute start-92 md:start-19 top-9 md:top-12 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]"></div>
          </section>
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full p-4 rounded bg-red-900 border border-red-600">
            <p className="text-red-200 text-sm text-center mb-2">
              ⚠️ {error}
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => fetchPosts(currentPage, filterStatus)}
                className="px-3 py-1 bg-red-700 text-white text-sm rounded hover:bg-red-600"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Authentication warning */}
        {!userToken && !loading && (
          <div className="w-full p-4 rounded bg-yellow-900 border border-yellow-600">
            <p className="text-yellow-200 text-sm text-center">
              🔐 يلزم تسجيل الدخول لعرض المنشورات
            </p>
          </div>
        )}

        {/* main content */}
        <section className="w-full">
          {/* title */}
          <section className="flex w-[770px] h-[60px] justify-end items-start bg-[#2D4639] text-white">
            <h1 className="flex w-[167.41px] p-[15px] flex-col items-end shrink-0 self-stretch text-right text-white font-[Cairo] text-[16px] font-medium leading-normal">
              الإجراءات
            </h1>
            <h1 className="flex w-[91.27px] p-[15px] flex-col items-end shrink-0 self-stretch text-right text-white font-[Cairo] text-[16px] font-medium leading-normal">
              التفاعلات
            </h1>
            <h1 className="flex w-[115.06px] p-[15px] flex-col items-end shrink-0 self-stretch text-right text-white font-[Cairo] text-[16px] font-medium leading-normal">
              التاريخ
            </h1>
            <h1 className="flex w-[116.81px] p-[15px] flex-col items-end shrink-0 self-stretch text-right text-white font-[Cairo] text-[16px] font-medium leading-normal">
              الحالة
            </h1>
            <h1 className="flex w-[279.45px] p-[15px] flex-col items-end shrink-0 self-stretch text-right text-white font-[Cairo] text-[16px] font-medium leading-normal">
              عنوان المنشور
            </h1>
          </section>

          {/* Scrollable posts container */}
          <div className="hide-scrollbar w-[770px] h-[537px] overflow-y-auto overflow-x-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-[#E9C882]">جاري التحميل...</p>
              </div>
            ) : !userToken ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-[#E9C882]">يرجى تسجيل الدخول لعرض المنشورات</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-[#E9C882]">
                  {filterStatus === "approved" && "لا توجد منشورات مقبولة"}
                  {filterStatus === "rejected" && "لا توجد منشورات مرفوضة"}
                  {filterStatus === "pending" && "لا توجد منشورات قيد المراجعة"}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onStatusUpdate={updatePostStatus}
                  formatDate={formatDate}
                  calculateInteractions={calculateInteractions}
                  getDisplayStatus={getDisplayStatus}
                  currentFilter={filterStatus}
                />
              ))
            )}
          </div>
        </section>

        {/* Pagination */}
        {!loading && userToken && totalPages > 1 && (
          <div className="flex gap-2 items-center justify-center mt-4">
            {/* Left arrow */}
            <button
              onClick={() => paginate(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${currentPage === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[rgba(45,70,57,0.40)] text-[#E9C882] hover:bg-[rgba(45,70,57,0.60)]"
                }`}
            >
              ←
            </button>

            {/* Page numbers */}
            {getPaginationNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${currentPage === pageNumber
                  ? "bg-[#00844B] text-white"
                  : "bg-[rgba(45,70,57,0.40)] text-[#E9C882] hover:bg-[rgba(45,70,57,0.60)]"
                  }`}
              >
                {pageNumber + 1}
              </button>
            ))}

            {/* Right arrow */}
            <button
              onClick={() => paginate(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${currentPage === totalPages - 1
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[rgba(45,70,57,0.40)] text-[#E9C882] hover:bg-[rgba(45,70,57,0.60)]"
                }`}
            >
              →
            </button>
          </div>
        )}
      </section>

      {/* Mobile/Tablet Version */}
      <section className="lg:hidden w-full px-4 pt-6 pb-6 flex flex-col items-center gap-6 rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]">
        {/* Header with title and filter */}
        <div className="flex flex-col gap-4 w-full">
          {/* title */}
          <div className="flex items-end flex-col w-full">
            <section className="relative w-full">
              <h1 className="text-[#E9C882] text-right font-[Cairo] text-xl not-italic font-bold leading-[40.8px]">
                آخر المنشورات
              </h1>
              <div className="w-[50px] absolute start-92 top-10 h-[2px] bg-gradient-to-r from-[#00844B] to-[#E9C882]"></div>
            </section>
          </div>

          {/* Error message */}
          {error && (
            <div className="w-full p-4 rounded bg-red-900 border border-red-600">
              <p className="text-red-200 text-sm text-center mb-2">
                ⚠️ {error}
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => fetchPosts(currentPage, filterStatus)}
                  className="px-3 py-1 bg-red-700 text-white text-sm rounded hover:bg-red-600"
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          )}

          {/* Authentication warning */}
          {!userToken && !loading && (
            <div className="w-full p-4 rounded bg-yellow-900 border border-yellow-600">
              <p className="text-yellow-200 text-sm text-center">
                🔐 يلزم تسجيل الدخول لعرض المنشورات
              </p>
            </div>
          )}

          {/* Filter select box */}
          <div className="flex justify-start w-full">
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="w-[180px] h-[40px] px-3 rounded-[5px] bg-[#2D4639] border border-[#E9C882] text-[#E9C882] text-right font-[Cairo] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#E9C882]"
            >
              <option value="approved">المقبولة</option>
              <option value="rejected">المرفوضة</option>
              <option value="pending">قيد المراجعة</option>
            </select>
          </div>
        </div>

        {/* Scrollable posts container */}
        <div className="hide-scrollbar w-full h-[600px] overflow-y-auto overflow-x-hidden flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-[#E9C882]">جاري التحميل...</p>
            </div>
          ) : !userToken ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-[#E9C882]">يرجى تسجيل الدخول لعرض المنشورات</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-[#E9C882]">
                {filterStatus === "approved" && "لا توجد منشورات مقبولة"}
                {filterStatus === "rejected" && "لا توجد منشورات مرفوضة"}
                {filterStatus === "pending" && "لا توجد منشورات قيد المراجعة"}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCardMobile
                key={post.id}
                post={post}
                onStatusUpdate={updatePostStatus}
                formatDate={formatDate}
                calculateInteractions={calculateInteractions}
                getDisplayStatus={getDisplayStatus}
                currentFilter={filterStatus}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && userToken && totalPages > 1 && (
          <div className="flex gap-2 items-center justify-center flex-wrap">
            {/* Left arrow */}
            <button
              onClick={() => paginate(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`flex w-[36px] h-[36px] justify-center items-center rounded-[5px] font-[Cairo] text-[14px] font-medium transition-all ${currentPage === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[rgba(45,70,57,0.40)] text-[#E9C882] hover:bg-[rgba(45,70,57,0.60)]"
                }`}
            >
              ←
            </button>

            {/* Page numbers */}
            {getPaginationNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`flex w-[36px] h-[36px] justify-center items-center rounded-[5px] font-[Cairo] text-[14px] font-medium transition-all ${currentPage === pageNumber
                  ? "bg-[#00844B] text-white"
                  : "bg-[rgba(45,70,57,0.40)] text-[#E9C882] hover:bg-[rgba(45,70,57,0.60)]"
                  }`}
              >
                {pageNumber + 1}
              </button>
            ))}

            {/* Right arrow */}
            <button
              onClick={() => paginate(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className={`flex w-[36px] h-[36px] justify-center items-center rounded-[5px] font-[Cairo] text-[14px] font-medium transition-all ${currentPage === totalPages - 1
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[rgba(45,70,57,0.40)] text-[#E9C882] hover:bg-[rgba(45,70,57,0.60)]"
                }`}
            >
              →
            </button>
          </div>
        )}
      </section>
    </>
  );
}

// Post Row Component for Large Screen
function PostRow({ post, onStatusUpdate, formatDate, calculateInteractions, getDisplayStatus, currentFilter }) {
  const [status, setStatus] = useState(getDisplayStatus(post.status));
  const [buttonState, setButtonState] = useState("initial");
  const [hasMadeDecision, setHasMadeDecision] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAccept = async () => {
    setIsUpdating(true);
    const success = await onStatusUpdate(post.id, true);
    if (success) {
      setStatus("accepted");
      setButtonState("view");
      setHasMadeDecision(true);
    }
    setIsUpdating(false);
  };

  const handleReject = async () => {
    setIsUpdating(true);
    const success = await onStatusUpdate(post.id, false);
    if (success) {
      setStatus("rejected");
      setButtonState("view");
      setHasMadeDecision(true);
    }
    setIsUpdating(false);
  };

  const handleSwap = () => {
    if (buttonState === "initial") {
      setButtonState("edit");
    } else if (buttonState === "edit") {
      setButtonState("view");
    } else {
      setButtonState("edit");
    }
    setHasMadeDecision(false);
  };

  const interactionsCount = calculateInteractions(post);

  // Show action buttons only for pending posts in the pending filter
  const showActionButtons = currentFilter === "pending" && status === "pending";

  return (
    <section className="flex w-[770px] h-[89.5px] justify-end items-center shrink-0 mt-3">
      {/* btns */}
      <div className="flex w-[167.41px] pt-[26.5px] pr-[15px] pb-[27px] pl-[15px] flex-row-reverse gap-2 items-end shrink-0 self-stretch border-b border-[#EEE]">
        <div className="flex flex-row-reverse gap-2 -me-9 z-10">
          {/* Swap button - show only for pending posts in pending filter */}
          {showActionButtons && (
            <button
              onClick={handleSwap}
              className="flex w-[40px] cursor-pointer h-[36px] px-[7.176px] pt-[6.192px] pb-[5.808px] pl-[8.824px] justify-center items-center shrink-0 rounded-[5px] bg-[#00844B]"
            >
              <FontAwesomeIcon className="text-[#FFFFFF]" icon={faRetweet} />
            </button>
          )}

          {/* For approved/rejected status - show View button */}
          {(status === "accepted" || status === "rejected") && (
            <button className="flex w-[67.89px] cursor-pointer h-[36px] pt-[6px] pr-[11.41px] pb-[6px] pl-[12px] justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal">
              عرض <FontAwesomeIcon className="text-[#FFFFFF]" icon={faEye} />
            </button>
          )}

          {/* For pending status - show Accept/Reject buttons or View button based on state */}
          {showActionButtons && (
            <>
              {/* Initial state - Accept/Reject buttons */}
              {buttonState === "initial" && !hasMadeDecision && (
                <>
                  <button
                    onClick={handleAccept}
                    disabled={isUpdating}
                    className={`flex w-[67.89px] cursor-pointer h-[36px] pt-[6px] pr-[11.41px] pb-[6px] pl-[12px] justify-center items-center gap-1 rounded-[5px] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal ${isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-[#00844B]"
                      }`}
                  >
                    {isUpdating ? "..." : "قبول"} <FontAwesomeIcon className="text-[#FFFFFF]" icon={faCheck} />
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={isUpdating}
                    className={`flex w-[63.23px] cursor-pointer h-[36px] pt-[6px] pr-[12.6px] pb-[6px] pl-[12px] justify-center items-center gap-1 shrink-0 rounded-[5px] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal ${isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-[#E74C3C]"
                      }`}
                  >
                    {isUpdating ? "..." : "رفض"} <FontAwesomeIcon className="text-[#FFFFFF]" icon={faXmark} />
                  </button>
                </>
              )}

              {/* Edit button */}
              {buttonState === "edit" && (
                <button className="flex w-[67.89px] cursor-pointer h-[36px] pt-[6px] pr-[11.41px] pb-[6px] pl-[12px] justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal">
                  تعديل <FontAwesomeIcon className="text-[#FFFFFF]" icon={faPenToSquare} />
                </button>
              )}

              {/* View button */}
              {buttonState === "view" && (
                <button className="flex w-[67.89px] cursor-pointer h-[36px] pt-[6px] pr-[11.41px] pb-[6px] pl-[12px] justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal">
                  عرض <FontAwesomeIcon className="text-[#FFFFFF]" icon={faEye} />
                </button>
              )}
            </>
          )}

          {/* For pending posts in non-pending filters, show View button */}
          {status === "pending" && currentFilter !== "pending" && (
            <button className="flex w-[67.89px] cursor-pointer h-[36px] pt-[6px] pr-[11.41px] pb-[6px] pl-[12px] justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal">
              عرض <FontAwesomeIcon className="text-[#FFFFFF]" icon={faEye} />
            </button>
          )}
        </div>
      </div>

      {/* view */}
      <div className="flex w-[91.27px] px-[15px] pt-[29.5px] pb-[30px] flex-col items-end shrink-0 self-stretch border-b border-[#EEE]">
        <h1 className="text-[#B0B3B4] text-right font-[cairo] text-base font-normal leading-normal">{interactionsCount}</h1>
      </div>

      {/* date */}
      <div className="flex w-[115.06px] px-[15px] pt-[29.5px] pb-[30px] flex-col items-end shrink-0 self-stretch border-b border-[#EEE]">
        <h1 className="text-[#B0B3B4] text-right font-[cairo] text-[16px] font-normal leading-normal">{formatDate(post.createdAt)}</h1>
      </div>

      {/* status */}
      <div className="flex w-[116.81px] px-[15px] pt-[27.5px] pb-[28px] flex-col items-end shrink-0 self-stretch border-b border-[#EEE]">
        {status === "accepted" && (
          <h1 className="flex justify-end items-start px-[10px] py-[5px] rounded-[20px] bg-[rgba(0,132,75,0.10)] text-[#00844B] text-right font-[cairo] text-[12.8px] font-medium leading-normal">
            مقبول
          </h1>
        )}
        {status === "rejected" && (
          <h1 className="flex justify-end items-start px-[10px] py-[5px] rounded-[20px] bg-[rgba(231,76,60,0.1)] text-[#E74C3C] text-right font-[cairo] text-[12.8px] font-medium leading-normal">
            مرفوض
          </h1>
        )}
        {status === "pending" && (
          <h1 className="flex justify-end w-[101%] items-start px-[10px] py-[5px] rounded-[20px] bg-[rgba(233,200,130,0.2)] text-[#B9AF82] text-right font-[cairo] text-[12.8px] font-medium leading-normal">
            قيد المراجعة
          </h1>
        )}
      </div>

      {/* caption of the post */}
      <div className="flex w-[279.45px] px-[15px] pt-[15px] pb-[16px] flex-col justify-center items-center gap-[10px] shrink-0 self-stretch border-b border-[#EEE]">
        <h1 className="text-[#B0B3B4] text-right font-[cairo] text-[16px] font-semibold leading-normal">{post.header}</h1>
        <p className="text-[#8A8A8A] text-center font-[cairo] text-[12.8px] font-normal leading-normal">{formatDate(post.createdAt)}</p>
      </div>
    </section>
  );
}

// Post Card Component for Mobile/Tablet
function PostCardMobile({ post, onStatusUpdate, formatDate, calculateInteractions, getDisplayStatus, currentFilter }) {
  const [status, setStatus] = useState(getDisplayStatus(post.status));
  const [buttonState, setButtonState] = useState("initial");
  const [hasMadeDecision, setHasMadeDecision] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAccept = async () => {
    setIsUpdating(true);
    const success = await onStatusUpdate(post.id, true);
    if (success) {
      setStatus("accepted");
      setButtonState("view");
      setHasMadeDecision(true);
    }
    setIsUpdating(false);
  };

  const handleReject = async () => {
    setIsUpdating(true);
    const success = await onStatusUpdate(post.id, false);
    if (success) {
      setStatus("rejected");
      setButtonState("view");
      setHasMadeDecision(true);
    }
    setIsUpdating(false);
  };

  const handleSwap = () => {
    if (buttonState === "initial") {
      setButtonState("edit");
    } else if (buttonState === "edit") {
      setButtonState("view");
    } else {
      setButtonState("edit");
    }
    setHasMadeDecision(false);
  };

  const interactionsCount = calculateInteractions(post);

  // Show action buttons only for pending posts in the pending filter
  const showActionButtons = currentFilter === "pending" && status === "pending";

  return (
    <div className="w-full rounded-lg bg-[#2D4639] p-4">
      {/* post title and date */}
      <div className="flex flex-col items-end gap-1 border-b border-[#EEE] pb-3">
        <h1 className="text-[#B0B3B4] text-right font-[cairo] text-base font-semibold">{post.header}</h1>
        <p className="text-[#8A8A8A] text-right font-[cairo] text-xs">
          {formatDate(post.createdAt)}
        </p>
      </div>

      {/* status and interactions */}
      <div className="flex justify-between items-center pt-3 pb-4 border-b border-[#EEE]">
        <div className="flex items-center gap-2">
          {/* status */}
          {status === "accepted" && (
            <span className="px-3 py-1 rounded-[20px] bg-[rgba(0,132,75,0.10)] text-[#00844B] text-right font-[cairo] text-xs font-medium">
              مقبول
            </span>
          )}
          {status === "rejected" && (
            <span className="px-3 py-1 rounded-[20px] bg-[rgba(231,76,60,0.1)] text-[#E74C3C] text-right font-[cairo] text-xs font-medium">
              مرفوض
            </span>
          )}
          {status === "pending" && (
            <span className="px-3 py-1 rounded-[20px] bg-[rgba(233,200,130,0.2)] text-[#B9AF82] text-right font-[cairo] text-xs font-medium">
              قيد المراجعة
            </span>
          )}
        </div>

        {/* interactions */}
        <span className="text-[#B0B3B4] text-right font-[cairo] text-sm">التفاعلات: {interactionsCount}</span>
      </div>

      {/* actions */}
      <div className="flex flex-row-reverse justify-start items-center gap-2 pt-4">
        {/* Swap button - show only for pending posts in pending filter */}
        {showActionButtons && (
          <button
            onClick={handleSwap}
            className="flex w-10 cursor-pointer h-9 justify-center items-center rounded-[5px] bg-[#00844B]"
          >
            <FontAwesomeIcon className="text-white" icon={faRetweet} />
          </button>
        )}

        {/* For approved/rejected status - show View button */}
        {(status === "accepted" || status === "rejected") && (
          <button className="flex h-9 cursor-pointer px-3 justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-xs">
            عرض <FontAwesomeIcon className="text-white" icon={faEye} />
          </button>
        )}

        {/* For pending status - show Accept/Reject buttons or View button based on state */}
        {showActionButtons && (
          <>
            {/* Initial state - Accept/Reject buttons */}
            {buttonState === "initial" && !hasMadeDecision && (
              <>
                <button
                  onClick={handleAccept}
                  disabled={isUpdating}
                  className={`flex h-9 cursor-pointer px-3 justify-center items-center gap-1 rounded-[5px] text-white text-center font-[cairo] text-xs ${isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-[#00844B]"
                    }`}
                >
                  {isUpdating ? "..." : "قبول"} <FontAwesomeIcon className="text-white" icon={faCheck} />
                </button>

                <button
                  onClick={handleReject}
                  disabled={isUpdating}
                  className={`flex h-9 px-3 cursor-pointer justify-center items-center gap-1 rounded-[5px] text-white text-center font-[cairo] text-xs ${isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-[#E74C3C]"
                    }`}
                >
                  {isUpdating ? "..." : "رفض"} <FontAwesomeIcon className="text-white" icon={faXmark} />
                </button>
              </>
            )}

            {/* Edit button */}
            {buttonState === "edit" && (
              <button className="flex h-9 cursor-pointer px-3 justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-xs">
                تعديل <FontAwesomeIcon className="text-white" icon={faPenToSquare} />
              </button>
            )}

            {/* View button */}
            {buttonState === "view" && (
              <button className="flex h-9 cursor-pointer px-3 justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-xs">
                عرض <FontAwesomeIcon className="text-white" icon={faEye} />
              </button>
            )}
          </>
        )}

        {/* For pending posts in non-pending filters, show View button */}
        {status === "pending" && currentFilter !== "pending" && (
          <button className="flex h-9 cursor-pointer px-3 justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-xs">
            عرض <FontAwesomeIcon className="text-white" icon={faEye} />
          </button>
        )}
      </div>
    </div>
  );
}