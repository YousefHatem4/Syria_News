import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { userContext } from '../Context/userContext';
import { BASE_URL } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function UserInfo({ userProfile, refreshProfile, profileImage, clearProfileImage, updateImagePreview }) {
    const [isOpen, setIsOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bio, setBio] = useState('');
    const [countryName, setCountryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Store original values to detect changes
    const [originalValues, setOriginalValues] = useState({
        phoneNumber: '',
        bio: '',
        countryName: ''
    });

    let { userToken, userId } = useContext(userContext);

    // Country mapping - Arabic names to English codes/names
    const countryMapping = {
        'الأردن': 'Jordan',
        'الإمارات العربية المتحدة': 'United Arab Emirates',
        'البحرين': 'Bahrain',
        'الجزائر': 'Algeria',
        'السعودية': 'Saudi Arabia',
        'السودان': 'Sudan',
        'الصومال': 'Somalia',
        'العراق': 'Iraq',
        'الكويت': 'Kuwait',
        'المغرب': 'Morocco',
        'اليمن': 'Yemen',
        'تونس': 'Tunisia',
        'جزر القمر': 'Comoros',
        'جيبوتي': 'Djibouti',
        'سوريا': 'Syria',
        'عمان': 'Oman',
        'فلسطين': 'Palestine',
        'قطر': 'Qatar',
        'لبنان': 'Lebanon',
        'ليبيا': 'Libya',
        'مصر': 'Egypt',
        'موريتانيا': 'Mauritania'
    };

    // Get user ID from context or localStorage
    const getUserId = () => {
        return userId || localStorage.getItem('userId');
    };

    // Load user profile data when component mounts or userProfile changes
    useEffect(() => {
        if (userProfile) {
            const phone = userProfile.phoneNumber || '';
            const userBio = userProfile.bio || '';
            const country = userProfile.country?.countryName || userProfile.countryName || '';

            setPhoneNumber(phone);
            setBio(userBio);

            // Convert English country name back to Arabic for display
            let arabicCountryName = '';
            if (country) {
                // Find Arabic name from English name
                const entry = Object.entries(countryMapping).find(([arabic, english]) =>
                    english === country || arabic === country
                );
                arabicCountryName = entry ? entry[0] : country;
            }

            setCountryName(arabicCountryName);

            setOriginalValues({
                phoneNumber: phone,
                bio: userBio,
                countryName: arabicCountryName
            });
        }
    }, [userProfile]);

    // Show toast notification
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Check if user is new (hasn't completed profile)
    const isNewUser = () => {
        return !userProfile?.phoneNumber && !userProfile?.bio && !userProfile?.countryName;
    };

    // Check if any field has changed (including profile image)
    const hasChanges = () => {
        // If user is new and we have any data or image, allow submission
        if (isNewUser()) {
            return (
                phoneNumber !== '' ||
                bio !== '' ||
                countryName !== '' ||
                profileImage !== null
            );
        }

        // For existing users, check against original values
        return (
            phoneNumber !== originalValues.phoneNumber ||
            bio !== originalValues.bio ||
            countryName !== originalValues.countryName ||
            profileImage !== null
        );
    };

    // Convert Arabic country name to English for API
    const getEnglishCountryName = (arabicName) => {
        return countryMapping[arabicName] || arabicName;
    };

    // Handle form submission - SENDS ALL FIELDS INCLUDING IMAGE
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if there are any changes
        if (!hasChanges()) {
            setToastMessage('لا توجد تغييرات لحفظها');
            setShowToast(true);
            return;
        }

        setIsSubmitting(true);

        try {
            const userId = getUserId();
            if (!userId || !userToken) {
                console.error('User not authenticated');
                setToastMessage('خطأ في المصادقة');
                setShowToast(true);
                return;
            }

            const formData = new FormData();

            // Append profile image if it exists (from Profile component)
            if (profileImage) {
                formData.append('file', profileImage);
                console.log('Appending profile image to FormData');
            }

            // ALWAYS APPEND ALL FIELDS (not just changed ones)
            formData.append('phoneNumber', phoneNumber || '');
            formData.append('bio', bio || '');

            // Convert Arabic country name to English for API
            const englishCountryName = getEnglishCountryName(countryName);
            formData.append('countryName', englishCountryName || '');

            console.log('Submitting profile updates for userId:', userId);
            console.log('Is new user:', isNewUser());
            console.log('Phone:', phoneNumber);
            console.log('Bio:', bio);
            console.log('Country name (Arabic):', countryName);
            console.log('Country name (English):', englishCountryName);
            console.log('Has profile image:', !!profileImage);
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await axios.post(
                `${BASE_URL}users/complete-profile`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    // Handle redirects for POST requests
                    maxRedirects: 0,
                    validateStatus: function (status) {
                        return status >= 200 && status < 303;
                    }
                }
            );

            console.log('Profile updated successfully:', response.data);

            // Update original values after successful save
            setOriginalValues({
                phoneNumber,
                bio,
                countryName
            });

            // Clear profile image after successful upload
            if (profileImage && clearProfileImage) {
                clearProfileImage();
            }

            // Update image preview with the new image URL from response if available
            if (response.data.imageUrl) {
                let imageUrl = response.data.imageUrl;
                if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
                    if (imageUrl.includes('/')) {
                        imageUrl = `${BASE_URL}${imageUrl.replace(/^\//, '')}`;
                    } else {
                        imageUrl = `${BASE_URL}images/${imageUrl}`;
                    }
                }
                if (updateImagePreview) {
                    updateImagePreview(imageUrl);
                }
            }

            setToastMessage('تم حفظ التغييرات بنجاح');
            setShowToast(true);

            // Refresh parent profile data
            if (refreshProfile) {
                refreshProfile();
            }

        } catch (error) {
            console.error('Error updating profile:', error);

            // Handle specific error cases
            if (error.response) {
                const { status, data } = error.response;

                if (status === 404 && data.message?.includes('country')) {
                    setToastMessage('اسم الدولة غير صحيح. يرجى اختيار دولة من القائمة');
                    setShowToast(true);
                } else if (data.message) {
                    setToastMessage(data.message);
                    setShowToast(true);
                } else {
                    setToastMessage('حدث خطأ أثناء حفظ التغييرات');
                    setShowToast(true);
                }

                // If we got data in redirect but it's an error, don't treat it as success
                console.log('Error response:', data);
            } else {
                setToastMessage('حدث خطأ في الاتصال بالخادم');
                setShowToast(true);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return <>
        <style >{`
            #country::-webkit-scrollbar {
                display: none;
            }
            
            #country {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>

        {/* Toast Notification */}
        {showToast && (
            <div className='fixed top-20 md:top-26 right-4 md:right-17 flex w-[220px] md:w-[250px] h-[45px] px-4 justify-center flex-row-reverse items-center gap-2 rounded-lg bg-white shadow-md transition-all duration-500 z-[10000] animate-toastIn'>
                <FontAwesomeIcon icon={faCheckCircle} className="text-[#00844B] text-lg" />
                <div className='text-black text-[12px] md:text-[14px] font-[400] font-[Tajawal] not-italic leading-normal'>
                    {toastMessage}
                </div>
            </div>
        )}

        <section className='flex w-full md:w-[804px] pt-6 md:pt-8 pr-4 md:pr-[33px] pb-6 md:pb-[33px] pl-4 md:pl-[33px] flex-col items-end gap-4 md:gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
            {/* title */}
            <section className='relative w-full'>
                <h1 className='text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]'>المعلومات الشخصية</h1>
                <div className='w-[50px] md:w-[70px] absolute start-92 md:start-166 top-10 md:top-11 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
            </section>


            {/* form */}
            <form className='mt-3 w-full' onSubmit={handleSubmit}>
                {/* first input */}
                <div className='flex flex-col items-end gap-2 w-full'>
                    <label htmlFor="text" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">الاسم الكامل</label>
                    <input
                        type="text"
                        readOnly
                        id="text"
                        className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal"
                        value={userProfile?.userName || 'أحمد محمد'}
                    />
                </div>


                {/* second input */}
                <div className='flex flex-col items-end gap-2 mt-4 md:mt-6 w-full'>
                    <label htmlFor="email" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">البريد الإلكتروني</label>
                    <input
                        type="email"
                        readOnly
                        id="email"
                        className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal"
                        value={userProfile?.email || 'ahmed@example.com'}
                    />
                </div>


                {/* third input */}
                <div className='flex flex-col items-end gap-2 mt-4 md:mt-6 w-full'>
                    <label htmlFor="tel" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">رقم الهاتف</label>
                    <input
                        type="tel"
                        id="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal focus:outline-none focus:border-[#E9C882]"
                        placeholder="+963 123 456 789"
                    />
                </div>

                {/* country select input */}
                <div className='flex flex-col items-end gap-2 mt-4 md:mt-6 w-full'>
                    <label htmlFor="country" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">الدولة</label>
                    <div className="relative w-full md:w-[738px]">
                        <select
                            id="country"
                            size="1"
                            value={countryName}
                            onChange={(e) => setCountryName(e.target.value)}
                            className="text-white appearance-none flex w-full h-[48px] md:h-[50px] py-3 md:py-[13.8px] px-3 md:px-[17px] pr-12 md:pr-5 justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(233,200,130,0.30)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal transition-all duration-200 cursor-pointer focus:outline-none focus:border-[rgba(233,200,130,0.40)] focus:bg-[rgba(255,255,255,0.08)]"
                            style={{
                                backgroundImage: 'none',
                                overflow: 'hidden'
                            }}
                            onFocus={() => setIsOpen(true)}
                            onBlur={() => setIsOpen(false)}
                        >
                            <option value="" className="bg-[#2D4639] text-white ">اختر الدولة</option>
                            <option value="الأردن" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2  ">الأردن</option>
                            <option value="الإمارات العربية المتحدة" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">الإمارات العربية المتحدة</option>
                            <option value="البحرين" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">البحرين</option>
                            <option value="الجزائر" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">الجزائر</option>
                            <option value="السعودية" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">السعودية</option>
                            <option value="السودان" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">السودان</option>
                            <option value="الصومال" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">الصومال</option>
                            <option value="العراق" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">العراق</option>
                            <option value="الكويت" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">الكويت</option>
                            <option value="المغرب" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">المغرب</option>
                            <option value="اليمن" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">اليمن</option>
                            <option value="تونس" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">تونس</option>
                            <option value="جزر القمر" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">جزر القمر</option>
                            <option value="جيبوتي" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">جيبوتي</option>
                            <option value="سوريا" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">سوريا</option>
                            <option value="عمان" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">عمان</option>
                            <option value="فلسطين" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">فلسطين</option>
                            <option value="قطر" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">قطر</option>
                            <option value="لبنان" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">لبنان</option>
                            <option value="ليبيا" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">ليبيا</option>
                            <option value="مصر" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">مصر</option>
                            <option value="موريتانيا" className="bg-[#2D4639] text-white hover:bg-[#00844B] py-2">موريتانيا</option>
                        </select>

                        {/* Custom Arrow */}
                        <div className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                                className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="#E9C882"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>


                {/* fourth input */}
                <div className='flex flex-col items-end gap-2 mt-4 md:mt-6 w-full'>
                    <label htmlFor="message" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">نبذة عني</label>
                    <textarea
                        id="message"
                        rows="4"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="text-white h-[100px] md:h-[134.5px] resize-none flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal focus:outline-none focus:border-[#E9C882]"
                        placeholder="اكتب نبذة عنك..."
                    ></textarea>
                </div>

                {/* btn */}
                <button
                    type='submit'
                    disabled={isSubmitting || (!hasChanges() && !isNewUser())}
                    className={`text-[#1B1D1E] mt-5 md:mt-7 text-center font-[Cairo] text-sm md:text-base not-italic font-semibold leading-normal flex w-full md:w-[738px] py-3 md:pt-[13.8px] md:pr-6 md:pb-[12.8px] md:pl-6 flex-col justify-center items-center rounded-[5px] transition-all duration-300 ${isSubmitting || (!hasChanges() && !isNewUser())
                        ? 'bg-[#E9C882]/50 cursor-not-allowed'
                        : 'bg-[var(--light-sand-beige-e-9-c-882,#E9C882)] cursor-pointer hover:bg-[#d4b874]'
                        }`}
                >
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </form>
        </section>
    </>
}