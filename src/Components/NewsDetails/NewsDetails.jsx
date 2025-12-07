import React, { useState, useEffect, useContext } from 'react'
import style from './NewsDetails.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCheckCircle, faUser, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faEye, faCalendar, faComment, faClock } from '@fortawesome/free-regular-svg-icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userContext } from '../Context/userContext';
import { BASE_URL } from '../../App';
import { useUserInfo } from '../hooks/useUserInfo';

export default function NewsDetails() {
    let { id } = useParams();
    // State management for comment section
    const [isLiked, setIsLiked] = useState(() => {
        // Initialize from localStorage
        const savedLikes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
        return savedLikes[id] || false;
    });
    const [showAllComments, setShowAllComments] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    let { userToken } = useContext(userContext);
    const navigate = useNavigate();

    // Get user info from custom hook
    const { userImage, userName, isAuthenticated, role } = useUserInfo();

    // API States
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsCurrentPage, setCommentsCurrentPage] = useState(0);
    const [commentsTotalPages, setCommentsTotalPages] = useState(0);
    const [commentsTotalElements, setCommentsTotalElements] = useState(0);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Delete comment state
    const [isDeletingComment, setIsDeletingComment] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    // Related posts states
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [relatedCurrentPage, setRelatedCurrentPage] = useState(0);
    const [relatedTotalPages, setRelatedTotalPages] = useState(0);

    // Check if user is admin
    const isAdmin = role === 'ROLE_ADMIN';

    // Function to fix corrupted Arabic text (Mojibake issue)
    const fixArabicText = (text) => {
        if (!text || typeof text !== 'string') return text || '';

        console.log('Original text to fix:', text);
        console.log('Text char codes:', Array.from(text).map(c => c.charCodeAt(0).toString(16)));

        // If text already looks like proper Arabic, return it as is
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        if (arabicRegex.test(text)) {
            console.log('Text is already proper Arabic');
            return text;
        }

        // Check if text is Mojibake (corrupted encoding) - UTF-8 misinterpreted as ISO-8859-1
        const mojibakePattern = /[ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/;

        if (mojibakePattern.test(text)) {
            console.log('Detected Mojibake text, attempting to fix...');

            try {
                // Try to decode as if UTF-8 was misinterpreted as ISO-8859-1
                const fixedText = decodeURIComponent(escape(text));
                console.log('Fixed text after decodeURIComponent(escape()):', fixedText);

                if (arabicRegex.test(fixedText)) {
                    return fixedText;
                }
            } catch (e) {
                console.log('Failed to fix with decodeURIComponent:', e);
            }

            // Alternative fix: Try to manually fix common Mojibake patterns
            const fixMap = {
                'Ø': 'ا', 'Ù': 'ب', 'Ú': 'ت', 'Û': 'ث', 'Ü': 'ج',
                'Ý': 'ح', 'Þ': 'خ', 'ß': 'د', 'à': 'ذ', 'á': 'ر',
                'â': 'ز', 'ã': 'س', 'ä': 'ش', 'å': 'ص', 'æ': 'ض',
                'ç': 'ط', 'è': 'ظ', 'é': 'ع', 'ê': 'غ', 'ë': 'ـ',
                'ì': 'ف', 'í': 'ق', 'î': 'ك', 'ï': 'ل', 'ð': 'م',
                'ñ': 'ن', 'ò': 'ه', 'ó': 'و', 'ô': 'ى', 'õ': 'ي',
                'ö': 'ً', '÷': 'ٌ', 'ø': 'ٍ', 'ù': 'َ', 'ú': 'ُ',
                'û': 'ِ', 'ü': 'ّ', 'ý': 'ْ', 'þ': 'ٰ', 'ÿ': '‎'
            };

            let fixedText = text;
            for (const [bad, good] of Object.entries(fixMap)) {
                fixedText = fixedText.replace(new RegExp(bad, 'g'), good);
            }

            console.log('Fixed text after manual replacement:', fixedText);
            return fixedText;
        }

        // If no fix worked, return original
        return text;
    };

    // Function to properly format and fix Arabic user names
    const getFixedUserName = (userName) => {
        if (!userName) return 'مستخدم';

        const fixedName = fixArabicText(userName);

        // Ensure proper Arabic text rendering with RTL support
        return fixedName;
    };

    // Function to properly render user name in HTML
    const renderUserName = (userName) => {
        const fixedName = getFixedUserName(userName);

        return (
            <span
                dir="rtl"
                style={{
                    unicodeBidi: 'plaintext',
                    wordBreak: 'keep-all',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '120px',
                    display: 'inline-block',
                    direction: 'rtl',
                    fontFamily: "'Tajawal', 'Cairo', sans-serif"
                }}
            >
                {fixedName}
            </span>
        );
    };

    // Function to save like state to localStorage
    const saveLikeToLocalStorage = (articleId, likedState) => {
        const savedLikes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
        savedLikes[articleId] = likedState;
        localStorage.setItem('articleLikes', JSON.stringify(savedLikes));
    };

    // Function to get like state from localStorage
    const getLikeFromLocalStorage = (articleId) => {
        const savedLikes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
        return savedLikes[articleId] || false;
    };

    // Function to check authentication
    const checkAuthentication = () => {
        return userToken && localStorage.getItem('userToken');
    };

    // Function to redirect to login with return URL
    const redirectToLogin = () => {
        // Store the current article URL and comment text in localStorage
        const returnUrl = `/newsdetails/${id}`;
        localStorage.setItem('returnUrl', returnUrl);
        localStorage.setItem('pendingComment', commentText);

        setToastMessage('يجب تسجيل الدخول أولاً');
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            navigate('/login', {
                state: {
                    from: 'comment',
                    articleId: id,
                    commentText: commentText
                }
            });
        }, 1500);
    };

    // Function to check for pending comment after login
    const checkForPendingComment = () => {
        const pendingComment = localStorage.getItem('pendingComment');
        const returnUrl = localStorage.getItem('returnUrl');

        if (pendingComment && returnUrl && returnUrl.includes(`/newsdetails/${id}`)) {
            // Set the comment text and show input
            setCommentText(pendingComment);
            setShowCommentInput(true);

            // Clear the stored data
            localStorage.removeItem('pendingComment');
            localStorage.removeItem('returnUrl');

            // Scroll to comment section
            setTimeout(() => {
                const commentsSection = document.getElementById('comments-section');
                if (commentsSection) {
                    commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        }
    };

    // Function to handle image error
    const handleImageError = (e, isUser = true) => {
        e.target.onerror = null;
        if (isUser) {
            // Hide the image and show user icon with gray background
            e.target.style.display = 'none';
            const parentDiv = e.target.parentElement;
            if (parentDiv) {
                // Create or show the fallback icon
                let fallbackDiv = parentDiv.querySelector('.user-fallback');
                if (!fallbackDiv) {
                    fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'user-fallback w-full h-full flex items-center justify-center bg-gray-300 rounded-full';
                    const icon = document.createElement('div');
                    icon.innerHTML = '<svg class="w-1/2 h-1/2 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                    fallbackDiv.appendChild(icon);
                    parentDiv.appendChild(fallbackDiv);
                } else {
                    fallbackDiv.style.display = 'flex';
                }
            }
        } else {
            // For article images, use a placeholder
            e.target.src = "placeholder.jpg";
        }
    };

    // Function to render user avatar with fallback
    const renderUserAvatar = (imageUrl, userName, size = "35px") => {
        const hasImage = imageUrl && imageUrl !== "profile.jpg" && imageUrl !== "guest.jpg";

        if (hasImage) {
            return (
                <div className="relative">
                    <img
                        src={imageUrl}
                        className={`w-[${size}] h-[${size}] rounded-full object-cover`}
                        alt={getFixedUserName(userName) || "صورة المستخدم"}
                        onError={(e) => handleImageError(e, true)}
                    />
                </div>
            );
        } else {
            // Show gray background with user icon
            return (
                <div className={`w-[${size}] h-[${size}] rounded-full bg-gray-300 flex items-center justify-center`}>
                    <FontAwesomeIcon
                        icon={faUser}
                        className="text-gray-600 text-lg"
                    />
                </div>
            );
        }
    };

    // Function to render comment user avatar
    const renderCommentUserAvatar = (user, size = "35px") => {
        const imageUrl = user?.imageUrl;
        const userName = user?.userName || 'مستخدم';
        const hasImage = imageUrl && imageUrl !== "profile.jpg";

        if (hasImage) {
            return (
                <div className="relative">
                    <img
                        src={imageUrl}
                        className={`w-[${size}] h-[${size}] rounded-full object-cover`}
                        alt={getFixedUserName(userName)}
                        onError={(e) => handleImageError(e, true)}
                    />
                </div>
            );
        } else {
            // Show gray background with user icon
            return (
                <div className={`w-[${size}] h-[${size}] rounded-full bg-gray-300 flex items-center justify-center`}>
                    <FontAwesomeIcon
                        icon={faUser}
                        className="text-gray-600 text-sm"
                    />
                </div>
            );
        }
    };

    // UUID validation function
    const isValidUUID = (uuid) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    };

    // Pagination helper function
    const getPaginationButtons = (currentPage, totalPages) => {
        const buttons = [];
        const maxButtons = 3;

        if (totalPages <= maxButtons) {
            for (let i = 0; i < totalPages; i++) {
                buttons.push(i);
            }
        } else {
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

    // Fetch article details
    const fetchArticleDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate UUID first
            if (!isValidUUID(id)) {
                setError('معرف المقال غير صحيح');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${BASE_URL}articles/${id}`, {
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json; charset=utf-8',
                } : {
                    'Accept': 'application/json; charset=utf-8',
                },
                responseType: 'json',
                responseEncoding: 'utf-8'
            });

            // Fix any Arabic text in the article data
            const fixedArticleData = {
                ...response.data,
                header: fixArabicText(response.data.header),
                bio: fixArabicText(response.data.bio),
                userName: response.data.userName ? getFixedUserName(response.data.userName) : response.data.userName
            };

            setArticle(fixedArticleData);

            // Check if the current user has liked this article from localStorage
            const savedLikeState = getLikeFromLocalStorage(id);
            setIsLiked(savedLikeState);

            // Fetch related posts after getting article
            if (response.data.category?.name) {
                fetchRelatedPosts(response.data.category.name, 0);
            }

        } catch (err) {
            console.error('Error fetching article:', err);
            setError('فشل في تحميل المقال');
        } finally {
            setLoading(false);
        }
    };

    // Fetch comments with pagination
    const fetchComments = async (page = 0) => {
        try {
            setCommentsLoading(true);

            // Validate UUID first
            if (!isValidUUID(id)) {
                console.error('Invalid UUID for comments:', id);
                return;
            }

            const response = await axios.get(`${BASE_URL}articles/comments/${id}`, {
                params: {
                    page: page,
                    size: 10
                },
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json; charset=utf-8',
                } : {
                    'Accept': 'application/json; charset=utf-8',
                },
                responseType: 'json',
                responseEncoding: 'utf-8'
            });

            if (response.data && Array.isArray(response.data.content)) {
                // Fix Arabic text in comments
                const fixedComments = response.data.content.map(comment => ({
                    ...comment,
                    commentContent: fixArabicText(comment.commentContent),
                    user: comment.user ? {
                        ...comment.user,
                        userName: getFixedUserName(comment.user.userName)
                    } : comment.user
                }));

                setComments(fixedComments);
                setCommentsTotalPages(response.data.totalPages || 1);
                setCommentsCurrentPage(page);
                setCommentsTotalElements(response.data.totalElements || response.data.content.length);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
            if (err.response?.status === 404) {
                console.log('No comments found for this article');
                setComments([]);
            }
        } finally {
            setCommentsLoading(false);
        }
    };

    // Post new comment
    const postComment = async () => {
        // Check authentication before proceeding
        if (!checkAuthentication()) {
            redirectToLogin();
            return false;
        }

        // Validate UUID
        if (!isValidUUID(id)) {
            console.error('Invalid UUID for posting comment:', id);
            setToastMessage('معرف المقال غير صحيح');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return false;
        }

        if (!commentText.trim()) {
            setToastMessage('يرجى كتابة تعليق');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return false;
        }

        try {
            const formData = new FormData();
            formData.append('commentContent', commentText);

            const response = await axios.post(`${BASE_URL}articles/comments/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) {
                // Refresh comments after posting
                fetchComments(0);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error posting comment:', error);

            // Handle authentication errors
            if (error.response?.status === 401) {
                redirectToLogin();
            } else {
                setToastMessage('فشل في إضافة التعليق');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
            return false;
        }
    };

    // Handle delete comment functionality
    const handleDeleteComment = async (commentId) => {
        if (!isAdmin) {
            setToastMessage('غير مصرح لك بحذف التعليقات');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        const isConfirmed = window.confirm('هل أنت متأكد من رغبتك في حذف هذا التعليق؟');

        if (!isConfirmed) {
            return;
        }

        setIsDeletingComment(true);
        setDeletingCommentId(commentId);

        try {
            const response = await axios.delete(`${BASE_URL}articles/comments/${commentId}`, {
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json',
                } : {
                    'Accept': 'application/json',
                }
            });

            if (response.status === 200 || response.status === 204) {
                // Show success message
                setToastMessage('تم حذف التعليق بنجاح');
                setShowToast(true);

                // Remove deleted comment from local state
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));

                // Update total elements count
                setCommentsTotalElements(prev => Math.max(0, prev - 1));
            } else {
                throw new Error('فشل في حذف التعليق');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);

            let errorMessage = 'فشل في حذف التعليق';

            if (error.response?.status === 401) {
                errorMessage = 'غير مصرح لك بحذف هذا التعليق';
            } else if (error.response?.status === 403) {
                errorMessage = 'ليس لديك صلاحية لحذف هذا التعليق';
            } else if (error.response?.status === 404) {
                errorMessage = 'التعليق غير موجود';
            } else if (error.response?.status === 500) {
                errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً';
            }

            setToastMessage(errorMessage);
            setShowToast(true);
        } finally {
            setIsDeletingComment(false);
            setDeletingCommentId(null);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    // Handle like functionality - Using separate APIs for like and unlike
    const handleLikeToggle = async () => {
        // Check authentication before proceeding
        if (!checkAuthentication()) {
            redirectToLogin();
            return;
        }

        // Validate UUID
        if (!isValidUUID(id)) {
            console.error('Invalid UUID for like:', id);
            setToastMessage('معرف المقال غير صحيح');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        try {
            if (isLiked) {
                // User has already liked, so unlike using POST /unlike
                const response = await axios.post(`${BASE_URL}articles/${id}/unlike`, {}, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Accept': 'application/json',
                    }
                });

                if (response.status === 200 || response.status === 201 || response.status === 204) {
                    // Update like state to false
                    setIsLiked(false);

                    // Save to localStorage
                    saveLikeToLocalStorage(id, false);

                    // Update the article reacts count
                    if (article) {
                        setArticle(prevArticle => ({
                            ...prevArticle,
                            reacts: Math.max(0, (prevArticle.reacts || 1) - 1)
                        }));
                    }

                    // Show success message
                    setToastMessage('تم إلغاء الإعجاب');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                }
            } else {
                // User hasn't liked yet, so like using POST /likes
                const response = await axios.post(`${BASE_URL}articles/${id}/likes`, {}, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Accept': 'application/json',
                    }
                });

                if (response.status === 200 || response.status === 201) {
                    // Update like state to true
                    setIsLiked(true);

                    // Save to localStorage
                    saveLikeToLocalStorage(id, true);

                    // Update the article reacts count
                    if (article) {
                        setArticle(prevArticle => ({
                            ...prevArticle,
                            reacts: (prevArticle.reacts || 0) + 1
                        }));
                    }

                    // Show success message
                    setToastMessage('تم الإعجاب بالمقال');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);

            // Handle specific error cases
            if (error.response?.status === 401) {
                redirectToLogin();
            } else if (error.response?.status === 404) {
                setToastMessage('المقال غير موجود');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else if (error.response?.status === 409) {
                // If API returns 409 for conflict (already liked/unliked), sync with localStorage
                const savedLikeState = getLikeFromLocalStorage(id);
                setIsLiked(savedLikeState);
                setToastMessage(savedLikeState ? 'تم الإعجاب بالمقال مسبقاً' : 'لم يتم الإعجاب بالمقال مسبقاً');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                setToastMessage('فشل في تحديث الإعجاب');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        }
    };

    // Fetch related posts by category
    const fetchRelatedPosts = async (categoryName, page = 0) => {
        try {
            setRelatedLoading(true);

            const formData = new FormData();
            formData.append('categoryName', categoryName);
            formData.append('status', 'approved');
            formData.append('page', page);
            formData.append('size', 10);

            const response = await axios.post(`${BASE_URL}articles/filter`, formData, {
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data'
                } : {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.content) {
                // Filter out the current article using the UUID and fix Arabic text
                const filteredPosts = response.data.content
                    .filter(post => post.id !== id)
                    .map(post => ({
                        ...post,
                        header: fixArabicText(post.header),
                        bio: fixArabicText(post.bio),
                        userName: post.userName ? getFixedUserName(post.userName) : post.userName
                    }));

                setRelatedPosts(filteredPosts);
                setRelatedTotalPages(response.data.totalPages || 1);
                setRelatedCurrentPage(page);
            }

        } catch (err) {
            console.error('Error fetching related posts:', err);
            setRelatedPosts([]);
        } finally {
            setRelatedLoading(false);
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffHours < 24) {
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

    // Pagination handlers for comments
    const handleCommentsPageChange = (newPage) => {
        setCommentsCurrentPage(newPage);
        fetchComments(newPage);
        // Scroll to comments section
        setTimeout(() => {
            const commentsSection = document.getElementById('comments-section');
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    // Handle comment submission
    const handleCommentSubmit = async () => {
        // Check authentication first
        if (!checkAuthentication()) {
            redirectToLogin();
            return;
        }

        if (commentText.trim() !== '') {
            setIsSubmittingComment(true);
            const success = await postComment();
            if (success) {
                setCommentText('');
                setShowCommentInput(false);

                setToastMessage('تم إضافة تعليقك بنجاح');
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
            }
            setIsSubmittingComment(false);
        }
    };

    // Pagination handlers for related posts
    const handleRelatedPageChange = (newPage) => {
        setRelatedCurrentPage(newPage);
        if (article?.category?.name) {
            fetchRelatedPosts(article.category.name, newPage);
        }
    };

    const getRelatedPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 3;

        if (relatedTotalPages <= maxButtons) {
            for (let i = 0; i < relatedTotalPages; i++) {
                buttons.push(i);
            }
        } else {
            if (relatedCurrentPage === 0) {
                buttons.push(0, 1, 2);
            } else if (relatedCurrentPage === relatedTotalPages - 1) {
                buttons.push(relatedTotalPages - 3, relatedTotalPages - 2, relatedTotalPages - 1);
            } else {
                buttons.push(relatedCurrentPage - 1, relatedCurrentPage, relatedCurrentPage + 1);
            }
        }

        return buttons;
    };

    // Toggle show all comments
    const handleShowAllComments = () => {
        setShowAllComments(!showAllComments);
    };

    // Toggle comment input - UPDATED WITH AUTH CHECK
    const handleCommentInputToggle = () => {
        // Check if user is authenticated
        if (!checkAuthentication()) {
            // Store that user was trying to add comment
            localStorage.setItem('wasAddingComment', 'true');
            redirectToLogin();
            return;
        }
        setShowCommentInput(!showCommentInput);
    };

    // Handle Enter key press in comment input - UPDATED
    const handleCommentKeyPress = (e) => {
        if (e.key === 'Enter') {
            // Check authentication before handling Enter key
            if (!checkAuthentication()) {
                // Store that user was trying to add comment
                localStorage.setItem('wasAddingComment', 'true');
                redirectToLogin();
                return;
            }
            handleCommentSubmit();
        }
    };

    // Calculate comments count
    const getCommentsCount = () => {
        if (!article?.comments) return '0';
        return article.comments.length.toString();
    };

    // Check for pending comment when component mounts
    useEffect(() => {
        if (id) {
            fetchArticleDetails();
            fetchComments(0);

            // Check if user just returned from login
            const wasAddingComment = localStorage.getItem('wasAddingComment');
            const returnUrl = localStorage.getItem('returnUrl');

            if (wasAddingComment === 'true' && returnUrl && returnUrl.includes(`/newsdetails/${id}`)) {
                // Clear the flag
                localStorage.removeItem('wasAddingComment');

                // Show comment input automatically
                setShowCommentInput(true);

                // Scroll to comment section
                setTimeout(() => {
                    const commentsSection = document.getElementById('comments-section');
                    if (commentsSection) {
                        commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 500);

                // Check for saved comment text
                const savedComment = localStorage.getItem('pendingComment');
                if (savedComment) {
                    setCommentText(savedComment);
                    localStorage.removeItem('pendingComment');
                }
            }
        }
    }, [id]);

    // Check for pending comment when user becomes authenticated
    useEffect(() => {
        if (checkAuthentication() && id) {
            checkForPendingComment();
        }
    }, [userToken, id]);

    // Initialize like state from localStorage when component mounts
    useEffect(() => {
        if (id) {
            const savedLikeState = getLikeFromLocalStorage(id);
            setIsLiked(savedLikeState);
        }
    }, [id]);

    if (loading) {
        return (
            <div className='bg-[linear-gradient(164deg,#004025_-0.36%,rgba(255,255,255,0.80)_34.44%,rgba(0,64,37,0.50)_101.6%)] h-screen flex items-center justify-center'>
                <p className='text-white text-2xl'>جاري التحميل...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className='bg-[linear-gradient(164deg,#004025_-0.36%,rgba(255,255,255,0.80)_34.44%,rgba(0,64,37,0.50)_101.6%)] h-screen flex items-center justify-center'>
                <p className='text-red-500 text-2xl'>{error || 'المقال غير موجود'}</p>
            </div>
        );
    }

    return (
        <>
            {/* Enhanced Toast Notification */}
            {showToast && (
                <div
                    className={`fixed top-20 md:top-10 right-4 md:right-19 flex w-[220px] md:w-[250px] h-[45px] px-4 justify-center flex-row-reverse items-center gap-2 rounded-lg bg-white shadow-md transition-all duration-500 z-[10000] animate-toastIn`}
                >
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#00844B] text-lg" />
                    <div className='text-black text-[12px] md:text-[14px] font-[400] font-[Tajawal] not-italic leading-normal'>
                        {toastMessage}
                    </div>
                </div>
            )}

            <section className='bg-[linear-gradient(164deg,#004025_-0.36%,rgba(255,255,255,0.80)_34.44%,rgba(0,64,37,0.50)_101.6%)] h-auto relative flex items-center flex-col pb-10 pt-30 md:pt-0'>
                {/* breadcrumb navigation */}
                <section className='flex items-center gap-2 sm:gap-3 absolute top-50 sm:top-24 md:top-28 lg:top-32 xl:top-35 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-15'>
                    <Link to={'/'} className='font-poppins text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-normal text-white'>الصفحه الرئيسه </Link>
                    <FontAwesomeIcon icon={faAngleRight} className='text-white text-xs sm:text-sm md:text-base'></FontAwesomeIcon>
                    <h1 className='font-poppins text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-normal text-[#00341E]'>تفاصيل الخبر </h1>
                </section>

                {/* main section */}
                <div className='w-[90%] sm:w-[85%] md:w-[90%] lg:w-[95%] xl:w-[1377px] max-w-[1377px] pb-[20px] sm:pb-[25px] md:pb-[31px] rounded-[15px] sm:rounded-[20px] 
    bg-[linear-gradient(151deg,#2D4639_-1.74%,#1B1D1E_105.33%)] 
    shadow-[0_25px_50px_0_rgba(0,132,75,0.25),0_0_0_0_rgba(233,200,130,0.25)] 
    backdrop-blur-[5px] mt-32 sm:mt-40 md:mt-48 lg:mt-52 xl:mt-55'>
                    <img src={article.imageUrl || "post_image_2.jpg"} className='h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[372px] w-full self-stretch rounded-t-[15px] sm:rounded-t-[20px] object-cover ' alt={article.header} />

                    {/* content section 1*/}
                    <div className='p-4 sm:p-5 md:p-6 lg:p-5 flex flex-col items-end gap-4 sm:gap-5 md:gap-6 lg:gap-7'>
                        {/* title badge */}
                        <div className='w-[70px] sm:w-[75px] md:w-[81px] flex items-center justify-center h-[35px] sm:h-[38px] md:h-[41px] rounded-[30px] px-[18px] sm:px-[20px] md:px-[24px] py-[6px] sm:py-[7px] md:py-[8px] bg-[#00844B] opacity-100 shadow-[0px_4px_15px_0px_#004025]'>
                            <h1 className='font-cairo font-bold text-[12px] sm:text-[13px] md:text-[14.4px] leading-[20px] sm:leading-[22px] md:leading-[24.48px] tracking-[0%] text-right align-middle text-white'>
                                {'عاجل'}
                            </h1>
                        </div>

                        <h1 className='font-poppins font-bold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] xl:text-[48px] leading-[100%] tracking-[0%] text-right align-middle text-white '>
                            {article.header}
                        </h1>

                        {/* reacts */}
                        <div className='flex flex-wrap items-center gap-3 sm:gap-4 md:gap-4'>
                            <div className="w-auto flex flex-row-reverse justify-between gap-1 items-center font-cairo font-normal text-[12px] sm:text-[13px] md:text-[14.4px] leading-[20px] sm:leading-[22px] md:leading-[24.48px] text-[#E9C882]">
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                <span>{article.views}+</span>
                                <span>مشاهدة</span>
                            </div>

                            <div className="w-auto flex flex-row-reverse justify-between gap-1 items-center font-cairo font-normal text-[12px] sm:text-[13px] md:text-[14.4px] leading-[20px] sm:leading-[22px] md:leading-[24.48px] text-[#E9C882]">
                                <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                                <span>{article.reacts || 0}</span>
                                <span>تفاعلات</span>
                            </div>

                            <div className="w-auto flex flex-row-reverse justify-between gap-1 items-center font-cairo font-normal text-[12px] sm:text-[13px] md:text-[14.4px] leading-[20px] sm:leading-[22px] md:leading-[24.48px] text-[#E9C882]">
                                <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>
                                <span>{formatDate(article.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* content section 2 */}
                    <div className='flex flex-col gap-4 sm:gap-5 md:gap-6 items-center justify-center mt-4 sm:mt-5 md:mt-6 px-4 sm:px-6 md:px-8 lg:px-0'>
                        {article.bio && (
                            <p className='w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[930px] font-poppins font-semibold text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[150%] text-right align-middle text-white opacity-100'>
                                {article.bio}
                            </p>
                        )}

                        {/* Article Sections */}
                        {article.sections && article.sections.map((section, index) => (
                            <React.Fragment key={section.id}>
                                {section.content && (
                                    <div className='w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[802px] min-h-[120px] sm:min-h-[130px] md:min-h-[140px] lg:min-h-[154.33px] rounded-[12px] sm:rounded-[15px] border-l-[3px] sm:border-l-[4px] border-[#00844B] bg-[rgba(255,255,255,0.09)] flex p-[20px] sm:p-[24px] md:p-[28px] lg:p-[32px_32px_32px_36px] flex-col items-start gap-2 border-r-[3px] sm:border-r-[4px]'>

                                        <h1 className='text-white text-right font-poppins text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] not-italic font-semibold leading-normal'>
                                            {fixArabicText(section.content)}
                                        </h1>
                                    </div>
                                )}

                                {section.imageUrl && (
                                    <div className='w-full sm:w-[95%] md:w-[70%] lg:w-[60%] xl:w-[479px] h-[120px] sm:h-[130px] md:h-[140px] lg:h-[143.33px] rounded-[12px] sm:rounded-[15px] border-l-[3px] sm:border-l-[4px] border-[#00844B] border-r-[3px] sm:border-r-[4px] flex flex-col items-center justify-center gap-2'>
                                        <img
                                            src={section.imageUrl}
                                            className='w-full h-full object-cover rounded-[12px] sm:rounded-[15px]'
                                            alt={section.header}
                                            onError={(e) => handleImageError(e, false)}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Comments section */}
                        <div id="comments-section" className='flex flex-col gap-1 w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[809px]'>
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
                                            disabled={isSubmittingComment}
                                            className='px-3 sm:px-4 h-[34px] rounded-[12px] bg-[#00844B] text-white font-poppins text-[11px] sm:text-[12px] hover:bg-[#00a05d] transition-all duration-300 disabled:opacity-50'>
                                            {isSubmittingComment ? 'جاري الإرسال...' : 'إرسال'}
                                        </button>
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyPress={handleCommentKeyPress}
                                            className='flex-1 h-[34px] p-[8px] gap-2 rounded-[12px] border border-[#8A8A8A] bg-transparent font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF] focus:border-[#00844B] focus:outline-none transition-all duration-300'
                                            placeholder='....اكتب تعليقك'
                                            disabled={!checkAuthentication()}
                                            autoFocus={showCommentInput && checkAuthentication()}
                                        />
                                    </div>
                                )}

                                <div className='flex items-center gap-3 mt-2 sm:mt-0'>
                                    <h1
                                        className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF]'
                                        dir="rtl"
                                        style={{
                                            unicodeBidi: 'plaintext',
                                            wordBreak: 'keep-all',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '120px'
                                        }}
                                    >
                                        {checkAuthentication() ? getFixedUserName(userName) || 'أنت' : 'زائر'}
                                    </h1>
                                    <div className="relative">
                                        {checkAuthentication() ? (
                                            renderUserAvatar(userImage, userName, "35px")
                                        ) : (
                                            <div className="w-[35px] h-[35px] sm:w-[41px] sm:h-[41px] rounded-full bg-gray-300 flex items-center justify-center">
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                    className="text-gray-600 text-sm sm:text-base"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Display comments */}
                            {commentsLoading ? (
                                <div className='w-full min-h-[67px] border-t border-t-[#000000] p-[13px] gap-2 bg-[#2D4639] opacity-100 flex items-center justify-center'>
                                    <p className='text-white'>جاري تحميل التعليقات...</p>
                                </div>
                            ) : comments.length > 0 ? (
                                <>
                                    {/* Display first comment (always visible) */}
                                    <div className='w-full min-h-[67px] border-t border-t-[#000000] p-[13px] gap-2 bg-[#2D4639] opacity-100 flex flex-col sm:flex-row items-start sm:items-center justify-between'>
                                        {/* Left side - Delete button for admin only */}
                                        <div className='flex items-center gap-3 self-start sm:self-auto mb-2 sm:mb-0'>
                                            {isAdmin && (
                                                <div
                                                    className={`text-[#FFFFFFAD] cursor-pointer text-right font-[Poppins] text-[10px] sm:text-[11px] not-italic font-normal leading-normal flex items-center gap-1 hover:text-red-500 transition-colors ${isDeletingComment && deletingCommentId === comments[0].id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={() => !(isDeletingComment && deletingCommentId === comments[0].id) && handleDeleteComment(comments[0].id)}
                                                >
                                                    <p>{isDeletingComment && deletingCommentId === comments[0].id ? 'جاري الحذف...' : 'حذف'}</p>
                                                    <FontAwesomeIcon
                                                        className={`${isDeletingComment && deletingCommentId === comments[0].id ? 'text-gray-400' : 'text-[#FFFFFFAD]'} hover:text-red-500 transition-colors`}
                                                        icon={faTrashCan}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Middle - Comment content */}
                                        <h1 className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[150%] sm:leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF] flex-1 mb-2 sm:mb-0 px-2'>
                                            {comments[0].commentContent}
                                        </h1>

                                        {/* Right side - User info */}
                                        <div className='flex items-center gap-3 self-end sm:self-auto'>
                                            <div
                                                className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF]'
                                                dir="rtl"
                                                style={{
                                                    unicodeBidi: 'plaintext',
                                                    wordBreak: 'keep-all',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '120px'
                                                }}
                                            >
                                                {renderUserName(comments[0].user?.userName)}
                                            </div>
                                            {renderCommentUserAvatar(comments[0].user, "35px")}
                                        </div>
                                    </div>

                                    {/* Display all other comments when toggled */}
                                    {showAllComments && comments.slice(1).map((comment) => (
                                        <div key={comment.id} className='w-full min-h-[67px] border-t border-t-[#000000] p-[13px] gap-2 bg-[#2D4639] opacity-100 flex flex-col sm:flex-row items-start sm:items-center justify-between'>
                                            {/* Left side - Delete button for admin only */}
                                            <div className='flex items-center gap-3 self-start sm:self-auto mb-2 sm:mb-0'>
                                                {isAdmin && (
                                                    <div
                                                        className={`text-[#FFFFFFAD] cursor-pointer text-right font-[Poppins] text-[10px] sm:text-[11px] not-italic font-normal leading-normal flex items-center gap-1 hover:text-red-500 transition-colors ${isDeletingComment && deletingCommentId === comment.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        onClick={() => !(isDeletingComment && deletingCommentId === comment.id) && handleDeleteComment(comment.id)}
                                                    >
                                                        <p>{isDeletingComment && deletingCommentId === comment.id ? 'جاري الحذف...' : 'حذف'}</p>
                                                        <FontAwesomeIcon
                                                            className={`${isDeletingComment && deletingCommentId === comment.id ? 'text-gray-400' : 'text-[#FFFFFFAD]'} hover:text-red-500 transition-colors`}
                                                            icon={faTrashCan}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Middle - Comment content */}
                                            <h1 className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[150%] sm:leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF] flex-1 mb-2 sm:mb-0 px-2'>
                                                {comment.commentContent}
                                            </h1>

                                            {/* Right side - User info */}
                                            <div className='flex items-center gap-3 self-end sm:self-auto'>
                                                <div
                                                    className='font-poppins font-normal text-[11px] sm:text-[12px] leading-[100%] tracking-[0%] text-right align-middle text-[#FFFFFF]'
                                                    dir="rtl"
                                                    style={{
                                                        unicodeBidi: 'plaintext',
                                                        wordBreak: 'keep-all',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        maxWidth: '120px'
                                                    }}
                                                >
                                                    {renderUserName(comment.user?.userName)}
                                                </div>
                                                {renderCommentUserAvatar(comment.user, "35px")}
                                            </div>
                                        </div>
                                    ))}
                                    {/* Comments Pagination */}
                                    {commentsTotalPages > 1 && (
                                        <div className='flex gap-2 items-center justify-center mt-4 p-4 bg-[#2D4639]'>
                                            <button
                                                onClick={() => handleCommentsPageChange(Math.max(0, commentsCurrentPage - 1))}
                                                disabled={commentsCurrentPage === 0}
                                                className={`flex w-[30px] h-[30px] justify-center items-center rounded-[5px] font-[Cairo] text-[14px] font-medium transition-all ${commentsCurrentPage === 0
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-[#2D4639] text-white hover:bg-[#00844B] border border-white"
                                                    }`}
                                            >
                                                ←
                                            </button>

                                            {getPaginationButtons(commentsCurrentPage, commentsTotalPages).map((pageNumber) => (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => handleCommentsPageChange(pageNumber)}
                                                    className={`flex w-[30px] h-[30px] justify-center items-center rounded-[5px] font-[Cairo] text-[14px] font-medium transition-all ${commentsCurrentPage === pageNumber
                                                        ? "bg-[#00844B] text-white"
                                                        : "bg-[#2D4639] text-white hover:bg-[#00844B] border border-white"
                                                        }`}
                                                >
                                                    {pageNumber + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handleCommentsPageChange(Math.min(commentsTotalPages - 1, commentsCurrentPage + 1))}
                                                disabled={commentsCurrentPage === commentsTotalPages - 1}
                                                className={`flex w-[30px] h-[30px] justify-center items-center rounded-[5px] font-[Cairo] text-[14px] font-medium transition-all ${commentsCurrentPage === commentsTotalPages - 1
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-[#2D4639] text-white hover:bg-[#00844B] border border-white"
                                                    }`}
                                            >
                                                →
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className='w-full min-h-[67px] border-t border-t-[#000000] p-[13px] gap-2 bg-[#2D4639] opacity-100 flex items-center justify-center'>
                                    <p className='text-white'>لا توجد تعليقات بعد</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <section className='px-4 sm:px-6 md:px-8 lg:px-10 mt-8 sm:mt-9 md:mt-10'>
                        {/* title */}
                        <div className='flex flex-col items-end'>
                            <h1 className='font-Tajawal font-bold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] leading-[100%] tracking-[0%] text-right align-middle text-[#E9C882]'>أخبار ذات صلة</h1>
                            <div className='w-[140px] sm:w-[150px] md:w-[160px] lg:w-[165px] h-[3px] rounded-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882] opacity-100 mt-3 sm:mt-4'></div>
                        </div>

                        {/* other posts */}
                        {relatedLoading ? (
                            <div className='flex justify-center items-center h-64 mt-10'>
                                <p className='text-white text-lg'>جاري التحميل...</p>
                            </div>
                        ) : relatedPosts.length > 0 ? (
                            <>
                                <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-7 mt-6 sm:mt-8 md:mt-10'>
                                    {relatedPosts.map((post) => (
                                        <Link to={`/newsdetails/${post.id}`} key={post.id} className='w-full max-w-[500px] md:max-w-[423px] h-auto md:h-[400px] rounded-[8px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mx-auto flex flex-col'>
                                            {/* Image container with fixed height */}
                                            <div className='w-full h-[150px] md:h-[180px] flex-shrink-0'>
                                                <img
                                                    src={post.imageUrl || "post.jpg"}
                                                    className='w-full h-full rounded-t-[8px] object-cover'
                                                    alt={post.header || "صورة الخبر"}
                                                    onError={(e) => handleImageError(e, false)}
                                                />
                                            </div>

                                            {/* Content container with reduced padding and optimized spacing */}
                                            <div className='flex flex-col flex-1 p-3 sm:p-4 gap-3 sm:gap-4'>
                                                <div className='flex items-center justify-end gap-3'>
                                                    <p className='text-[#8A8A8A] text-right font-[poppins] text-[11px] sm:text-[12px] font-normal leading-normal'>
                                                        {formatDate(post.createdAt)}
                                                    </p>
                                                    <h1 className='flex w-[70px] sm:w-[87px] px-[6px] py-[2px] justify-center items-center gap-2 rounded-[28px] bg-[#00844B] text-white text-[12px] sm:text-[14px] font-[tajawal] font-bold leading-normal text-right'>
                                                        {'عاجل'}
                                                    </h1>
                                                </div>

                                                <h1 className='text-black text-right font-poppins text-[15px] sm:text-[16px] md:text-[17px] font-semibold leading-[1.4] line-clamp-2 min-h-[44px]'>
                                                    {post.header}
                                                </h1>

                                                <p className='text-[#636262] text-right font-tajawal text-[12px] sm:text-[13px] font-normal leading-[1.5] line-clamp-3 flex-1'>
                                                    {post.bio || 'لا توجد نبذة متاحة'}
                                                </p>

                                                <div className='flex items-center justify-end flex-col-reverse sm:flex-row gap-3 sm:gap-0 mt-auto pt-2'>
                                                    <div className='flex items-center gap-3'>
                                                        <div
                                                            className='text-black text-right font-poppins  text-[11px] sm:text-[12px] font-normal leading-normal'
                                                            dir="rtl"
                                                            style={{
                                                                unicodeBidi: 'plaintext',
                                                                wordBreak: 'keep-all',
                                                                whiteSpace: 'nowrap',
                                                                textOverflow: 'ellipsis',
                                                                maxWidth: '100px'
                                                            }}
                                                        >
                                                            {renderUserName(post.userName)}
                                                        </div>
                                                        <div className="relative">
                                                            {post.userImageUrl ? (
                                                                <img
                                                                    src={post.userImageUrl}
                                                                    className='w-[35px] h-[35px]  sm:w-[41px] sm:h-[41px] rounded-full object-cover'
                                                                    alt={renderUserName(post.userName) || "صورة الناشر"}
                                                                    onError={(e) => handleImageError(e, true)}
                                                                />
                                                            ) : (
                                                                <div className="w-[35px] h-[35px]  sm:w-[41px] sm:h-[41px] rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <FontAwesomeIcon
                                                                        icon={faUser}
                                                                        className="text-gray-600 text-sm "
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </section>

                                {/* Related Posts Pagination */}
                                {relatedTotalPages > 1 && (
                                    <div className='flex gap-2 items-center justify-center mt-8'>
                                        {/* Left arrow */}
                                        <button
                                            onClick={() => handleRelatedPageChange(Math.max(0, relatedCurrentPage - 1))}
                                            disabled={relatedCurrentPage === 0}
                                            className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${relatedCurrentPage === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-[#2D4639] text-white hover:bg-[#00844B]"
                                                }`}
                                        >
                                            ←
                                        </button>

                                        {/* Page numbers */}
                                        {getRelatedPaginationButtons().map((pageNumber) => (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handleRelatedPageChange(pageNumber)}
                                                className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${relatedCurrentPage === pageNumber
                                                    ? "bg-[#00844B] text-white"
                                                    : "bg-[#2D4639] text-white hover:bg-[#00844B]"
                                                    }`}
                                            >
                                                {pageNumber + 1}
                                            </button>
                                        ))}

                                        {/* Right arrow */}
                                        <button
                                            onClick={() => handleRelatedPageChange(Math.min(relatedTotalPages - 1, relatedCurrentPage + 1))}
                                            disabled={relatedCurrentPage === relatedTotalPages - 1}
                                            className={`flex w-[40px] h-[40px] justify-center items-center rounded-[5px] font-[Cairo] text-[16px] font-medium transition-all ${relatedCurrentPage === relatedTotalPages - 1
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
                                <p className='text-white text-lg'>لا توجد أخبار ذات صلة</p>
                            </div>
                        )}
                    </section>
                </div>
            </section>

            {/* Animation styles */}
            <style jsx="true" global="true">{`
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
                
                .animate-toastIn {
                    animation: toastIn 0.3s ease-out forwards;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                /* Custom styles for user avatars */
                .user-avatar-container {
                    position: relative;
                    display: inline-block;
                }
                
                .user-fallback {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }
                
                .gray-avatar {
                    background-color: #e5e7eb; /* gray-300 */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .gray-avatar svg {
                    color: #4b5563; /* gray-600 */
                }
            `}</style>
        </>
    );
}