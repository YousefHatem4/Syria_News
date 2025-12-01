import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../App';

export default function VerfiyCode() {
    const [code, setCode] = useState(new Array(4).fill(''));
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const inputsRef = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Get email and otp from location state (passed from forget password page)
    const email = location.state?.email || '';
    const receivedOtp = location.state?.otp || '';

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(countdown);
    }, []);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 4) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const joinedCode = code.join('');

        // Use either the entered OTP or the received OTP (if provided)
        const otpToVerify = receivedOtp || joinedCode;

        if (!email) {
            alert('البريد الإلكتروني غير متوفر. يرجى العودة إلى صفحة نسيان كلمة المرور');
            return;
        }

        // Check if user entered 4-digit OTP (if OTP wasn't passed from previous page)
        if (!receivedOtp && joinedCode.length !== 4) {
            alert('يرجى إدخال الرمز المكون من 4 أرقام');
            return;
        }

        try {
            setLoading(true);

            // Create FormData payload
            const formData = new FormData();
            formData.append('email', email);
            formData.append('otp', otpToVerify);

            // Send request using only FormData
            const response = await axios.post(
                `${BASE_URL}auth/reset-password/verify`,
                formData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 10000,
                }
            );

            console.log('Verification response:', response.data);

            // If verification successful, navigate to new password page
            if (response.status === 200) {
                navigate('/newpass', {
                    state: {
                        email: email,
                        token: response.data.token || null
                    }
                });
            }

        } catch (err) {
            console.error('Verification error:', err);

            // Handle specific error cases
            if (err.code === 'ERR_NETWORK') {
                alert('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
            } else if (err.response?.status === 400) {
                // More specific message for 400 error
                if (err.response.data?.message) {
                    alert(err.response.data.message);
                } else {
                    alert('الرمز غير صحيح أو منتهي الصلاحية. يرجى المحاولة مرة أخرى.');
                }
            } else if (err.response?.status === 404) {
                alert('البريد الإلكتروني غير مسجل.');
            } else if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert('فشل في التحقق. يرجى المحاولة مرة أخرى.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = () => {
        if (timer !== 0) return;

        // Reset timer
        setTimer(60);
        alert('تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني');

        // Clear OTP fields (if user entered them)
        if (!receivedOtp) {
            setCode(new Array(4).fill(''));
            inputsRef.current[0]?.focus();
        }
    };

    return (
        <div className='[background:linear-gradient(to_bottom_right,_#004025_0%,_#FFFFFFCC_80%,_transparent_100%)] min-h-[110vh] flex items-center justify-center p-4'>
            <section className='w-full max-w-[633px] h-auto md:h-[646px] -mt-25 md:mt-20'>

                {/* Green Header */}
                <div className='w-full h-[200px] md:h-[318px] bg-[linear-gradient(to_bottom,_#2D4639,_#6FAC8C)] rounded-t-2xl flex justify-center items-center flex-col p-4'>
                    <h1 className='text-[20px] md:text-[28px] text-[#FFFFFF] my-Tajawal-text leading-[100%] mb-3 md:mb-6 font-semibold text-center'>
                        التحقق من الهوية
                    </h1>
                    <p className='text-[#F2F2F2] font-medium text-[14px] md:text-xl text-center'>
                        أدخل رمز التحقق المكون من 4 أرقام
                    </p>
                </div>

                {/* White Box */}
                <form
                    onSubmit={handleSubmit}
                    className='w-full h-auto md:h-[318px] bg-[#FFFFFF] rounded-b-2xl flex justify-center flex-col items-center text-center px-4 sm:px-6 py-5 md:py-0'
                >

                    {/* Code inputs - Only show if OTP wasn't received from previous page */}
                    {!receivedOtp ? (
                        <>
                            <div className='flex gap-2 sm:gap-4 mb-4 mt-4 sm:mt-2'>
                                {code.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        ref={(el) => (inputsRef.current[idx] = el)}
                                        onChange={(e) => handleChange(e.target.value, idx)}
                                        onKeyDown={(e) => handleKeyDown(e, idx)}
                                        className="w-[45px] h-[42px] sm:w-[55px] sm:h-[46px] text-center text-[20px] sm:text-[24px] font-bold border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#2D4639]"
                                        dir="ltr"
                                        disabled={loading}
                                    />
                                ))}
                            </div>

                            {/* Timer */}
                            <p className="text-gray-500 text-[13px] sm:text-[14px] mb-5 sm:mb-7">
                                سيتم إرسال الرمز مرة أخرى خلال{' '}
                                <span className="text-green-700 font-semibold">{timer}</span> ثانية
                            </p>
                        </>
                    ) : (
                        <div className="w-full max-w-[321px] mb-4 p-3 bg-green-50 border border-green-200 rounded-sm">
                            <p className="text-green-700 text-sm">
                                ✓ تم استلام رمز التحقق. انقر على تأكيد الرمز للمتابعة.
                            </p>
                        </div>
                    )}

                    {/* Confirm Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className='w-full max-w-[321px] h-[40px] sm:h-[27px] bg-[#00844B] text-white text-[12px] rounded-sm hover:bg-[#006C3C] transition duration-300 mb-4 md:mb-15 disabled:opacity-70 disabled:cursor-not-allowed'
                    >
                        {loading ? 'جاري التحقق...' : 'تأكيد الرمز'}
                    </button>

                    {/* Divider */}
                    <div className='w-full max-w-[496px] h-[0.5px] bg-gray-300'></div>

                    {/* Resend - Only show if OTP wasn't received from previous page */}
                    {!receivedOtp && (
                        <div className="w-full pt-4 text-center text-[13px] sm:text-[14px] text-gray-600">
                            إعادة إرسال الرمز{' '}
                            <button
                                type="button"
                                className={`text-[#00844B] cursor-pointer ${timer !== 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleResendCode}
                                disabled={timer !== 0}
                            >
                                لم تستلم الرمز؟
                            </button>
                        </div>
                    )}
                </form>
            </section>
        </div>
    );
}