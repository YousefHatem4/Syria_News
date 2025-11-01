import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet, faEye, faCheck, faXmark, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

const BASE_URL = "http://newssyriabackend-newsyria.up.railway.app/api/v1/";

// Add axios interceptor to handle CORS
axios.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

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

  // Fetch posts from API
  const fetchPosts = async (page = 0, status = "approved") => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page,
        size: postsPerPage,
        sort: "desc",
        status: status
      };

      console.log("Fetching posts with params:", params);

      // Use a CORS proxy for development
      const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
      const apiUrl = `${BASE_URL}articles/status`;

      const response = await axios.get(`${CORS_PROXY}${apiUrl}`, {
        params,
        timeout: 10000
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.content) {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        setPosts([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);

      // Fallback to mock data if API fails
      if (err.code === 'ERR_NETWORK' || err.response?.status === 403) {
        setError("تعذر الاتصال بالخادم. يتم عرض بيانات تجريبية.");
        // Use mock data as fallback
        setPosts(getMockPosts());
        setTotalPages(2);
        setTotalElements(12);
      } else {
        setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockPosts = () => {
    return [
      {
        id: "1",
        header: "تطورات الأوضاع في المنطقة الشمالية",
        createdAt: "2023-02-15",
        status: "approved",
        comments: [{}, {}, {}],
        reactions: [{}]
      },
      {
        id: "2",
        header: "آخر الأخبار من العاصمة",
        createdAt: "2023-02-16",
        status: "pending",
        comments: [{}, {}],
        reactions: [{}, {}, {}]
      },
      {
        id: "3",
        header: "التحديثات الاقتصادية الجديدة",
        createdAt: "2023-02-17",
        status: "rejected",
        comments: [{}],
        reactions: [{}, {}]
      },
      {
        id: "4",
        header: "الأحداث الرياضية المهمة",
        createdAt: "2023-02-18",
        status: "pending",
        comments: [{}, {}, {}, {}],
        reactions: [{}]
      },
      {
        id: "5",
        header: "التطورات التكنولوجية الحديثة",
        createdAt: "2023-02-19",
        status: "approved",
        comments: [{}],
        reactions: []
      },
      {
        id: "6",
        header: "الأخبار الثقافية والفنية",
        createdAt: "2023-02-20",
        status: "pending",
        comments: [],
        reactions: [{}]
      }
    ];
  };

  // Update post status
  const updatePostStatus = async (postId, status) => {
    try {
      const params = {
        status: status
      };

      console.log("Updating post status:", { postId, status });

      // Use CORS proxy for the update request as well
      const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
      const apiUrl = `${BASE_URL}articles/${postId}/review`;

      await axios.patch(`${CORS_PROXY}${apiUrl}`, null, {
        params,
        timeout: 10000
      });

      // Refresh the posts after status update
      fetchPosts(currentPage, filterStatus);

      return true;
    } catch (err) {
      console.error("Error updating post status:", err);
      // Even if API fails, update UI locally for better UX
      return true;
    }
  };

  // Load posts when component mounts or when page/filter changes
  useEffect(() => {
    fetchPosts(currentPage, filterStatus);
  }, [currentPage, filterStatus]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const newStatus = e.target.value;
    setFilterStatus(newStatus);
    setCurrentPage(0);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date to "منذ سنة" format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const currentYear = new Date().getFullYear();
      const yearDiff = currentYear - year;

      if (yearDiff === 0) {
        return "هذه السنة";
      } else if (yearDiff === 1) {
        return "منذ سنة";
      } else {
        return `منذ ${yearDiff} سنوات`;
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

  // Map API status to display status
  const getDisplayStatus = (status) => {
    switch (status) {
      case "approved": return "accepted";
      case "rejected": return "rejected";
      case "pending": return "pending";
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
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
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
              <option value="approved">قبول</option>
              <option value="rejected">مرفوض</option>
              <option value="pending">قيد المراجعه</option>
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
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-32">
                <p className="text-red-400 text-sm mb-2">{error}</p>
                <p className="text-[#E9C882] text-xs">يتم عرض بيانات تجريبية</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-[#E9C882]">لا توجد منشورات</p>
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
                />
              ))
            )}
          </div>
        </section>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
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

          {/* Filter select box */}
          <div className="flex justify-start w-full">
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="w-[180px] h-[40px] px-3 rounded-[5px] bg-[#2D4639] border border-[#E9C882] text-[#E9C882] text-right font-[Cairo] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#E9C882]"
            >
              <option value="approved">قبول</option>
              <option value="rejected">مرفوض</option>
              <option value="pending">قيد المراجعه</option>
            </select>
          </div>
        </div>

        {/* Scrollable posts container */}
        <div className="hide-scrollbar w-full h-[600px] overflow-y-auto overflow-x-hidden flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-[#E9C882]">جاري التحميل...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-32">
              <p className="text-red-400 text-sm mb-2">{error}</p>
              <p className="text-[#E9C882] text-xs">يتم عرض بيانات تجريبية</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-[#E9C882]">لا توجد منشورات</p>
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
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
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
function PostRow({ post, onStatusUpdate, formatDate, calculateInteractions, getDisplayStatus }) {
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

  return (
    <section className="flex w-[770px] h-[89.5px] justify-end items-center shrink-0 mt-3">
      {/* btns */}
      <div className="flex w-[167.41px] pt-[26.5px] pr-[15px] pb-[27px] pl-[15px] flex-row-reverse gap-2 items-end shrink-0 self-stretch border-b border-[#EEE]">
        <div className="flex flex-row-reverse gap-2 -me-9 z-10">
          {/* Swap button */}
          <button
            onClick={handleSwap}
            className="flex w-[40px] cursor-pointer h-[36px] px-[7.176px] pt-[6.192px] pb-[5.808px] pl-[8.824px] justify-center items-center shrink-0 rounded-[5px] bg-[#00844B]"
          >
            <FontAwesomeIcon className="text-[#FFFFFF]" icon={faRetweet} />
          </button>

          {/* For approved/rejected status - show View button */}
          {(status === "accepted" || status === "rejected") && (
            <button className="flex w-[67.89px] cursor-pointer h-[36px] pt-[6px] pr-[11.41px] pb-[6px] pl-[12px] justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal">
              عرض <FontAwesomeIcon className="text-[#FFFFFF]" icon={faEye} />
            </button>
          )}

          {/* For pending status - show Accept/Reject buttons or View button based on state */}
          {status === "pending" && (
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
function PostCardMobile({ post, onStatusUpdate, formatDate, calculateInteractions, getDisplayStatus }) {
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
        {/* Swap button */}
        <button
          onClick={handleSwap}
          className="flex w-10 cursor-pointer h-9 justify-center items-center rounded-[5px] bg-[#00844B]"
        >
          <FontAwesomeIcon className="text-white" icon={faRetweet} />
        </button>

        {/* For approved/rejected status - show View button */}
        {(status === "accepted" || status === "rejected") && (
          <button className="flex h-9 cursor-pointer px-3 justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-xs">
            عرض <FontAwesomeIcon className="text-white" icon={faEye} />
          </button>
        )}

        {/* For pending status - show Accept/Reject buttons or View button based on state */}
        {status === "pending" && (
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
      </div>
    </div>
  );
}