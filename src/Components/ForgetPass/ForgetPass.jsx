import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { BASE_URL } from '../../App';

export default function ForgetPass() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('الرجاء إدخال البريد الإلكتروني');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('الرجاء إدخال بريد إلكتروني صحيح');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            console.log('Sending reset password request for email:', email);

            // Create FormData like verifycode.jsx
            const formData = new FormData();
            formData.append('email', email);

            // Send request using FormData with same headers as verifycode.jsx
            const response = await axios.post(
                `${BASE_URL}auth/reset-password/request`,
                formData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 10000, // Added timeout like verifycode.jsx
                }
            );

            console.log('Reset password response:', response.data);

            if (response.status === 200 || response.status === 201) {
                setSuccess(true);

                // Navigate to verify code page with email
                setTimeout(() => {
                    navigate('/verfiycode', {
                        state: {
                            email: email,
                            // Only pass OTP if it's in the response
                            ...(response.data.otp && { otp: response.data.otp })
                        }
                    });
                }, 1500);
            }
        } catch (err) {
            console.error('Error sending reset password request:', err);

            // Improved error handling similar to verifycode.jsx
            if (err.code === 'ERR_NETWORK') {
                setError('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
            } else if (err.response) {
                // Server responded with error status
                switch (err.response.status) {
                    case 400:
                        if (err.response.data?.message) {
                            setError(err.response.data.message);
                        } else {
                            setError('بيانات غير صحيحة. الرجاء التأكد من البريد الإلكتروني');
                        }
                        break;
                    case 404:
                        setError('البريد الإلكتروني غير مسجل في النظام');
                        break;
                    case 429:
                        setError('لقد تجاوزت عدد المحاولات المسموح بها. الرجاء المحاولة لاحقاً');
                        break;
                    case 500:
                        setError('خطأ في الخادم. الرجاء المحاولة لاحقاً');
                        break;
                    default:
                        // Try to get error message from response like verifycode.jsx
                        if (err.response.data?.message) {
                            setError(err.response.data.message);
                        } else {
                            setError(`حدث خطأ (${err.response.status}). الرجاء المحاولة مرة أخرى`);
                        }
                }
            } else if (err.request) {
                // Request was made but no response
                setError('لا يمكن الاتصال بالخادم. الرجاء التحقق من اتصال الإنترنت');
            } else {
                // Other errors
                setError('حدث خطأ. الرجاء المحاولة مرة أخرى');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Clear error when user starts typing
        if (error) setError('');
        if (success) setSuccess(false);
    };

    // Simplified version - removed all alternative approaches since we're using FormData consistently
    return (
        <>
            <div className='[background:linear-gradient(to_bottom_right,_#004025_0%,_#FFFFFFCC_80%,_transparent_100%)] min-h-[110vh] flex items-center justify-center p-4'>
                <section className='w-full max-w-[633px] h-auto md:h-[646px] -mt-20 md:mt-20'>
                    <div className='w-full h-[200px] md:h-[318px] bg-[linear-gradient(to_bottom,_#2D4639,_#6FAC8C)] rounded-t-2xl flex justify-center items-center flex-col p-4'>
                        <h1 className='text-[24px] md:text-[28px] text-[#FFFFFF] my-Tajawal-text leading-[100%] mb-4 md:mb-6 font-semibold text-center'>
                            نسيت كلمة المرور؟
                        </h1>
                        <p className='text-[#F2F2F2] font-medium text-[16px] md:text-xl text-center'>
                            أدخل بريدك الإلكتروني لاستعادة حسابك
                        </p>
                    </div>
                    <div className='w-full h-auto md:h-[318px] bg-[#FFFFFF] rounded-b-2xl flex justify-center flex-col items-center text-center pb-10 md:pb-20 p-4'>
                        <form onSubmit={handleSubmit} className='w-full'>
                            <div className='relative w-full max-w-[425px] mb-6 md:ms-21'>
                                <label htmlFor="email" className='block mb-2 text-[16px] md:text-[20px] font-medium text-[#000000] text-end my-Poppins-text'>
                                    أدخل بريدك الإلكتروني
                                </label>
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className='absolute right-3 top-[55px] md:top-[60px] transform -translate-y-1/2 text-[#8A8A8A] pointer-events-none'
                                />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="إدخل بريدك الإلكتروني"
                                    required
                                    dir="rtl"
                                    className={`bg-gray-50 border ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'} focus:outline-none focus:border-[#00844B] text-[#000000] text-sm rounded-lg block w-full h-[40px] pr-10 pl-2.5 shadow-[inset_0px_2px_3.6px_#00000020]`}
                                    disabled={loading}
                                />

                                {/* Error Message */}
                                {error && (
                                    <div className='text-red-500 text-xs md:text-sm text-right mt-2 animate-fadeIn'>
                                        {error}
                                    </div>
                                )}

                                {/* Success Message */}
                                {success && (
                                    <div className='text-green-600 text-xs md:text-sm text-right mt-2 animate-fadeIn'>
                                        تم إرسال رمز التحقق إلى بريدك الإلكتروني. يتم التوجيه...
                                    </div>
                                )}
                            </div>

                            <div className='flex justify-center'>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full max-w-[321px] cursor-pointer h-[40px] md:h-[27px] bg-[#00844B] text-white text-[12px] rounded-sm hover:bg-[#006C3C] transition duration-300 mb-4 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                            جاري الإرسال...
                                        </>
                                    ) : (
                                        'إرسال'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>

            {/* Add CSS animation */}
            <style jsx="true" global="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
}