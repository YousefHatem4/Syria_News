import React, { useState, useEffect, useContext } from 'react'
import style from './Profile.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as faUserRegular, faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faUser as faUserSolid, faLock, faChartLine, faBars, faTimes, faRectangleList } from '@fortawesome/free-solid-svg-icons';
import UserInfo from './UserInfo';
import ChangePass from './ChangePass';
import UserPosts from './UserPosts';
import Statistics from './Statistics';
import LastPosts from './LastPosts';
import axios from 'axios';
import { userContext } from '../Context/userContext';
import { BASE_URL } from '../../App';
import { useUserInfo } from '../hooks/useUserInfo'; // Add this import

export default function Profile() {
    const [info, setInfo] = useState(true);
    const [changePass, setChangePass] = useState(false);
    const [posts, setPosts] = useState(false);
    const [statistics, setStatistics] = useState(false);
    const [lastPosts, setLastPosts] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [userRole, setUserRole] = useState('USER');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let { userToken, userId } = useContext(userContext);

    // Use the useUserInfo hook to get numOfArticles from JWT token
    const { userImage, userName, email, numOfArticles } = useUserInfo();

    // Get user ID from context or localStorage
    const getUserId = () => {
        return userId || localStorage.getItem('userId');
    };

    // Get user role from localStorage
    const getUserRole = () => {
        const role = localStorage.getItem('userRole');
        return role || 'USER';
    };

    // Get numOfArticles from JWT token (via useUserInfo) or localStorage
    const getNumOfArticles = () => {
        // First try from useUserInfo hook (from JWT token)
        if (numOfArticles && numOfArticles !== "0") {
            return numOfArticles;
        }

        // Then try from localStorage
        const storedNumOfArticles = localStorage.getItem('userNumOfArticles');
        if (storedNumOfArticles) {
            return storedNumOfArticles;
        }

        // Then try from userProfile API response
        if (userProfile?.postsCount) {
            return userProfile.postsCount;
        }

        // Default fallback
        return "0";
    };

    // Function to fix corrupted Arabic text
    const fixArabicText = (text) => {
        if (!text || typeof text !== 'string') return text || '';

        console.log('Original text:', text);
        console.log('Text char codes:', Array.from(text).map(c => c.charCodeAt(0).toString(16)));

        // If text already looks like proper Arabic, return it as is
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        if (arabicRegex.test(text)) {
            console.log('Text is already proper Arabic');
            return text;
        }

        // Check if text is Mojibake (corrupted encoding)
        // Common pattern for UTF-8 misinterpreted as ISO-8859-1
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

    // Function to safely extract and format user name
    const getUserNameDisplay = () => {
        // Priority 1: From userProfile API response (fix corrupted text)
        if (userProfile?.userName) {
            const fixedName = fixArabicText(userProfile.userName);
            console.log('API userName fixed:', userProfile.userName, '→', fixedName);
            localStorage.setItem('userName', fixedName);
            return fixedName;
        }

        // Priority 2: From JWT token via useUserInfo hook
        if (userName) {
            const fixedName = fixArabicText(userName);
            console.log('JWT userName fixed:', userName, '→', fixedName);
            return fixedName;
        }

        // Priority 3: From localStorage as fallback
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            const fixedName = fixArabicText(storedName);
            console.log('LocalStorage userName fixed:', storedName, '→', fixedName);
            return fixedName;
        }

        // Default fallback
        return fixArabicText('أحمد محمد');
    };

    // Function to safely extract and format email
    const getEmailDisplay = () => {
        // Priority 1: From userProfile API response
        if (userProfile?.email) {
            localStorage.setItem('userEmail', userProfile.email);
            return userProfile.email;
        }

        // Priority 2: From JWT token via useUserInfo hook
        if (email) {
            return email;
        }

        // Priority 3: From localStorage as fallback
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            return storedEmail;
        }

        // Default fallback
        return 'ahmed@example.com';
    };

    // Fetch user profile data
    const fetchUserProfile = async () => {
        try {
            const userId = getUserId();
            if (!userId || !userToken) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            console.log('Fetching profile for userId:', userId);

            const response = await axios.get(`${BASE_URL}users`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json; charset=utf-8', // Explicit charset
                    'Accept': 'application/json; charset=utf-8'
                },
                responseType: 'json',
                responseEncoding: 'utf-8',
                // Handle redirects properly
                maxRedirects: 0,
                validateStatus: function (status) {
                    return status >= 200 && status < 303; // Accept 302 as valid
                }
            });

            console.log('User profile fetched:', response.data);
            console.log('Raw userName from API:', response.data.userName);
            console.log('Type of userName:', typeof response.data.userName);

            // The API is returning data even with 302 status
            setUserProfile(response.data);
            setError(null);

            // Set user role from API response
            if (response.data.role) {
                setUserRole(response.data.role);
                localStorage.setItem('userRole', response.data.role);
            }

            // Fix and store user name
            if (response.data.userName) {
                const fixedUserName = fixArabicText(response.data.userName);
                console.log('Fixed userName for storage:', fixedUserName);
                localStorage.setItem('userName', fixedUserName);
            }

            if (response.data.email) {
                localStorage.setItem('userEmail', response.data.email);
            }

            // Set profile image if exists - fix image URL
            if (response.data.imageUrl) {
                // Check if the URL is relative and needs BASE_URL prepended
                let imageUrl = response.data.imageUrl;
                if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
                    // If it's a UUID or path, construct the full URL
                    if (imageUrl.includes('/')) {
                        imageUrl = `${BASE_URL}${imageUrl.replace(/^\//, '')}`;
                    } else {
                        // Assume it's an image ID
                        imageUrl = `${BASE_URL}images/${imageUrl}`;
                    }
                }
                setProfileImagePreview(imageUrl);
            } else if (userImage) {
                // Use image from JWT token if API doesn't return one
                setProfileImagePreview(userImage);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);

            // If it's a redirect but we got data, use it
            if (error.response && error.response.data) {
                console.log('Redirect but got data:', error.response.data);
                console.log('Raw userName from redirect:', error.response.data.userName);

                setUserProfile(error.response.data);
                setError(null);

                if (error.response.data.role) {
                    setUserRole(error.response.data.role);
                    localStorage.setItem('userRole', error.response.data.role);
                }

                // Fix and store user name
                if (error.response.data.userName) {
                    const fixedUserName = fixArabicText(error.response.data.userName);
                    console.log('Fixed userName from redirect:', fixedUserName);
                    localStorage.setItem('userName', fixedUserName);
                }

                if (error.response.data.email) {
                    localStorage.setItem('userEmail', error.response.data.email);
                }

                if (error.response.data.imageUrl) {
                    let imageUrl = error.response.data.imageUrl;
                    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
                        if (imageUrl.includes('/')) {
                            imageUrl = `${BASE_URL}${imageUrl.replace(/^\//, '')}`;
                        } else {
                            imageUrl = `${BASE_URL}images/${imageUrl}`;
                        }
                    }
                    setProfileImagePreview(imageUrl);
                } else if (userImage) {
                    // Use image from JWT token if API doesn't return one
                    setProfileImagePreview(userImage);
                }
            } else {
                setError('فشل في تحميل بيانات الملف الشخصي');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userToken) {
            // Get role from localStorage first
            const role = getUserRole();
            setUserRole(role);

            // Fetch profile data
            fetchUserProfile();
        } else {
            setLoading(false);
            setError('يرجى تسجيل الدخول أولاً');
        }
    }, [userToken]);

    // Handle profile image upload - now just sets the image locally, doesn't upload immediately
    const handleProfileImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);

            // Create and set the preview URL
            const previewUrl = URL.createObjectURL(file);
            setProfileImagePreview(previewUrl);

            console.log('Profile image selected:', file);
            console.log('Preview URL created:', previewUrl);
        }
    };

    // Function to get the current profile image (for UserInfo component)
    const getProfileImage = () => {
        return profileImage;
    };

    // Function to clear profile image after successful upload (for UserInfo component)
    const clearProfileImage = () => {
        setProfileImage(null);
        // Don't clear the preview - keep the new image displayed
    };

    // Function to update the image preview after successful upload
    const updateImagePreview = (newImageUrl) => {
        if (newImageUrl) {
            setProfileImagePreview(newImageUrl);
        }
    };

    // Check if user is admin
    const isAdmin = userRole === 'ADMIN';

    // Get the number of articles
    const userNumOfArticles = getNumOfArticles();

    // Get user name and email for display
    const displayName = getUserNameDisplay();
    const displayEmail = getEmailDisplay();

    if (loading) {
        return (
            <div className='bg-[linear-gradient(167deg,#2D4639_0%,#1B1D1E_88.4%)] min-h-screen flex justify-center items-center'>
                <div className="text-white text-xl">جاري التحميل...</div>
            </div>
        );
    }

    if (error && !userProfile) {
        return (
            <div className='bg-[linear-gradient(167deg,#2D4639_0%,#1B1D1E_88.4%)] min-h-screen flex justify-center items-center'>
                <div className="text-red-400 text-xl text-center">
                    {error}
                    <br />
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="mt-4 bg-[#00844B] text-white px-4 py-2 rounded"
                    >
                        العودة لتسجيل الدخول
                    </button>
                </div>
            </div>
        );
    }

    return <>
        <section className='bg-[linear-gradient(167deg,#2D4639_0%,#1B1D1E_88.4%)] min-h-[150vh] pt-45 pb-20 '>

            <section className='flex flex-col items-center '>
                {/* Add Picture Profile */}
                <section className='relative'>
                    <div className='flex w-[120px] h-[120px] md:w-[150px] md:h-[150px] flex-col justify-center items-center shrink-0 rounded-[75px] flex-[1_0_0] border-[3px] border-[#E9C882] shadow-[0_5px_15px_0_rgba(0,0,0,0.30)] overflow-hidden bg-[#2D4639]'>
                        {profileImagePreview ? (
                            <img
                                src={profileImagePreview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // If image fails to load, fall back to default icon
                                    console.error('Image failed to load:', profileImagePreview);
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <FontAwesomeIcon icon={faUserRegular} className="text-[#E9C882] text-3xl" />
                        )}
                    </div>
                    <label htmlFor="profile-image-upload" className='flex w-[30px] h-[30px] md:w-[40px] md:h-[40px] justify-center items-center absolute top-20 md:top-26 left-3 md:left-3 rounded-[20px] bg-[#00844B] cursor-pointer hover:bg-[#006D3D] transition-colors'>
                        <FontAwesomeIcon icon={faCamera} className="text-white text-right font-[Font_Awesome_5_Free] text-[12px] md:text-[16px] not-italic font-black leading-[16px]" />
                    </label>
                    <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageUpload}
                    />
                </section>

                {/* info of user */}
                <h1
                    className='text-[#E9C882] text-right font-[Tajawal] text-[24px] md:text-[28px] not-italic font-bold leading-normal mt-6'
                    dir="rtl" // Ensure RTL direction for Arabic text
                    style={{
                        unicodeBidi: 'plaintext', // Use plaintext for proper Arabic rendering
                        wordBreak: 'keep-all', // Prevent unwanted line breaks in Arabic words
                        whiteSpace: 'nowrap', // Keep Arabic names on one line
                        overflow: 'hidden', // Handle overflow gracefully
                        textOverflow: 'ellipsis', // Add ellipsis if text is too long
                        maxWidth: '90%', // Limit width for very long names
                        fontFeatureSettings: '"calt" 1, "liga" 1' // Enable Arabic ligatures
                    }}
                >
                    {displayName}
                </h1>
                <p
                    className='text-[#8A8A8A] text-right font-[Cairo] text-[14px] md:text-[16px] not-italic font-normal leading-[27.2px] mt-3'
                    dir="ltr" // Email should be LTR even in Arabic interface
                >
                    {displayEmail}
                </p>

                {/* Number of posts section - Updated to use numOfArticles from JWT token */}
                <h1 className='text-[#E9C882] text-center font-[Poppins] text-[18px] md:text-[20px] not-italic font-semibold leading-normal mt-7'>
                    {userNumOfArticles}
                </h1>
                <p className='text-[#8A8A8A] text-center font-[Tajawal] text-[12px] md:text-[14px] not-italic font-normal leading-normal -mt-2'>منشور</p>
                <div className='w-[90%] md:w-[75.5%] h-[1px] bg-[rgba(233,200,130,0.45)] my-8 md:my-12'></div>
            </section>

            {/* Mobile menu button */}
            <div className='md:hidden flex justify-center mb-6'>
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className='text-[#E9C882] text-2xl cursor-pointer'
                >
                    <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} />
                </button>
            </div>

            {/* main part */}
            <section className='flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10 mt-4 px-4 md:px-0'>
                {/* Mobile sidebar */}
                {showMobileMenu && (
                    <div className='md:hidden w-full p-5 flex flex-col items-end gap-4 rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
                        <div className='relative w-full'>
                            <h1 className='text-[#E9C882] text-right font-[Cairo] text-[18px] not-italic font-bold leading-[35.36px]'>إعدادات الحساب</h1>
                            <div className='w-[50px] h-[2px] absolute left-90 top-10 bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
                        </div>

                        <div className='mt-3 flex flex-col gap-5 w-full items-end'>
                            {/* Always show these 3 items for all users */}
                            <div
                                onClick={() => {
                                    setInfo(true);
                                    setChangePass(false);
                                    setPosts(false);
                                    setStatistics(false);
                                    setLastPosts(false);
                                    setShowMobileMenu(false);
                                }}
                                className={`text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex cursor-pointer items-center gap-2 w-full justify-end p-3 rounded ${info ? 'text-[#E9C882] bg-[rgba(233,200,130,0.10)]' : 'text-white'}`}
                            >
                                <h1>المعلومات الشخصية</h1>
                                <FontAwesomeIcon icon={faUserSolid} />
                            </div>

                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(true);
                                    setPosts(false);
                                    setStatistics(false);
                                    setShowMobileMenu(false);
                                    setLastPosts(false);
                                }}
                                className={`text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex  cursor-pointer items-center gap-2 w-full justify-end p-3 rounded ${changePass ? 'text-[#E9C882] bg-[rgba(233,200,130,0.10)]' : 'text-white'}`}
                            >
                                <h1>تغيير كلمة السر</h1>
                                <FontAwesomeIcon icon={faLock} />
                            </div>

                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(false);
                                    setLastPosts(false);
                                    setPosts(true);
                                    setStatistics(false);
                                    setShowMobileMenu(false);
                                }}
                                className={`text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex  cursor-pointer items-center gap-2 w-full justify-end p-3 rounded ${posts ? 'text-[#E9C882] bg-[rgba(233,200,130,0.10)]' : 'text-white'}`}
                            >
                                <h1>منشوراتي</h1>
                                <FontAwesomeIcon icon={faAddressCard} />
                            </div>

                            {/* Only show these items for ADMIN users */}
                            {isAdmin && (
                                <>
                                    <div
                                        onClick={() => {
                                            setInfo(false);
                                            setChangePass(false);
                                            setPosts(false);
                                            setStatistics(true);
                                            setLastPosts(false);
                                            setShowMobileMenu(false);
                                        }}
                                        className={`text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex   cursor-pointer items-center gap-2 w-full justify-end p-3 rounded ${statistics ? 'text-[#E9C882] bg-[rgba(233,200,130,0.10)]' : 'text-white'}`}
                                    >
                                        <h1>الإحصائيات</h1>
                                        <FontAwesomeIcon icon={faChartLine} />
                                    </div>

                                    <div
                                        onClick={() => {
                                            setInfo(false);
                                            setChangePass(false);
                                            setPosts(false);
                                            setStatistics(false);
                                            setLastPosts(true);
                                            setShowMobileMenu(false);
                                        }}
                                        className={`text-right font-[Cairo] text-base not-italic font-normal leading-[27.2px] flex cursor-pointer items-center gap-2 w-full justify-end p-3 rounded ${lastPosts ? 'text-[#E9C882] bg-[rgba(233,200,130,0.10)]' : 'text-white'}`}
                                    >
                                        <h1>آخر المنشورات</h1>
                                        <FontAwesomeIcon icon={faRectangleList} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {/* Content section */}
                <div className='w-full md:w-auto'>
                    {info && <UserInfo
                        userProfile={userProfile}
                        refreshProfile={fetchUserProfile}
                        profileImage={getProfileImage()}
                        clearProfileImage={clearProfileImage}
                        updateImagePreview={updateImagePreview}
                    />}
                    {changePass && <ChangePass />}
                    {posts && <UserPosts />}
                    {statistics && isAdmin && <Statistics />}
                    {lastPosts && isAdmin && <LastPosts />}
                </div>

                {/* sidebar - desktop */}
                <div className={`hidden md:flex w-[250px] lg:w-[300px] p-[20px] lg:p-[25px] pb-[30px] lg:pb-[37.79px] flex-col items-end gap-[20px] lg:gap-[24.01px] rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]`}>
                    {/* title of sidebar */}
                    <div className='relative'>
                        <h1 className='text-[#E9C882] text-right font-[Cairo] text-[18px] lg:text-[20.8px] not-italic font-bold leading-[35.36px]'>إعدادات الحساب</h1>
                        <div className='w-[40px] lg:w-[50px] h-[2px] absolute left-20 lg:left-24 top-10 bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
                    </div>

                    {/* sidebar items */}
                    <div className='mt-3 flex flex-col gap-5 lg:gap-7 items-end'>
                        {/* Always show these 3 items for all users */}
                        {/* item 1 - المعلومات الشخصية */}
                        {info ? (
                            <div className='flex pl-[50px] lg:pl-[74.28px] pr-[10px] lg:pr-[12.79px] pt-[10px] lg:pt-[11.79px] pb-[10px] lg:pb-[12.8px] items-center gap-[10px] lg:gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[#E9C882] text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-1 -me-1'>
                                    <h1>المعلومات الشخصية</h1>
                                    <FontAwesomeIcon icon={faUserSolid} />
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    setInfo(true);
                                    setChangePass(false);
                                    setPosts(false);
                                    setStatistics(false);
                                    setLastPosts(false);
                                }}
                                className='text-white cursor-pointer text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2 me-1'
                            >
                                <h1>المعلومات الشخصية</h1>
                                <FontAwesomeIcon icon={faUserSolid} />
                            </div>
                        )}

                        {/* item 2 - تغيير كلمة السر */}
                        {changePass ? (
                            <div className='flex pl-[90px] lg:pl-[120px] pr-[10px] lg:pr-[12.79px] pt-[10px] lg:pt-[11.79px] pb-[10px] lg:pb-[12.8px] items-center gap-[10px] lg:gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[#E9C882] text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-1 -me-2'>
                                    <h1>تغيير كلمة السر</h1>
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(true);
                                    setPosts(false);
                                    setStatistics(false);
                                    setLastPosts(false);
                                }}
                                className='text-white cursor-pointer text-right me-1 font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2'
                            >
                                <h1>تغيير كلمة السر</h1>
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                        )}

                        {/* item 3 - منشوراتي */}
                        {posts ? (
                            <div className='flex pl-[120px] lg:pl-[150px] pr-[10px] lg:pr-[12.79px] pt-[10px] lg:pt-[11.79px] pb-[10px] lg:pb-[12.8px] items-center gap-[10px] lg:gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                <div className='text-[#E9C882] text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2 -me-2'>
                                    <h1>منشوراتي</h1>
                                    <FontAwesomeIcon icon={faAddressCard} />
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    setInfo(false);
                                    setChangePass(false);
                                    setPosts(true);
                                    setStatistics(false);
                                    setLastPosts(false);
                                }}
                                className='text-white cursor-pointer text-right me-1 font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2'
                            >
                                <h1>منشوراتي</h1>
                                <FontAwesomeIcon icon={faAddressCard} />
                            </div>
                        )}

                        {/* Only show these items for ADMIN users */}
                        {isAdmin && (
                            <>
                                {/* item 4 - الإحصائيات */}
                                {statistics ? (
                                    <div className='flex pl-[120px] lg:pl-[150px] pr-[10px] lg:pr-[12.79px] pt-[10px] lg:pt-[11.79px] pb-[10px] lg:pb-[12.8px] items-center gap-[10px] lg:gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                        <div className='text-[#E9C882] text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2 -me-2'>
                                            <h1>الإحصائيات</h1>
                                            <FontAwesomeIcon icon={faChartLine} />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => {
                                            setInfo(false);
                                            setChangePass(false);
                                            setPosts(false);
                                            setLastPosts(false);
                                            setStatistics(true);
                                        }}
                                        className='text-white cursor-pointer text-right me-1 font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2'
                                    >
                                        <h1>الإحصائيات</h1>
                                        <FontAwesomeIcon icon={faChartLine} />
                                    </div>
                                )}

                                {/* item 5 - آخر المنشورات */}
                                {lastPosts ? (
                                    <div className='flex pl-[120px] lg:pl-[130px] pr-[10px] lg:pr-[12.79px] pt-[10px] lg:pt-[11.79px] pb-[10px] lg:pb-[12.8px] items-center gap-[10px] lg:gap-[12.8px] self-stretch rounded-[5px] bg-[rgba(233,200,130,0.10)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
                                        <div className='text-[#E9C882] whitespace-nowrap text-right font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2 -me-2'>
                                            <h1 className='inline'>آخر المنشورات</h1>
                                            <FontAwesomeIcon icon={faRectangleList} />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => {
                                            setInfo(false);
                                            setChangePass(false);
                                            setPosts(false);
                                            setStatistics(false);
                                            setLastPosts(true);
                                        }}
                                        className='text-white cursor-pointer text-right me-1 font-[Cairo] text-[14px] lg:text-base not-italic font-normal leading-[27.2px] flex items-center gap-2'
                                    >
                                        <h1>آخر المنشورات</h1>
                                        <FontAwesomeIcon icon={faRectangleList} />
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </section>
        </section>
    </>
}