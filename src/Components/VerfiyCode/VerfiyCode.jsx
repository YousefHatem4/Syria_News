import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerfiyCode() {
    const [code, setCode] = useState(new Array(5).fill(''));
    const [timer, setTimer] = useState(60);
    const inputsRef = useRef([]);
    const navigate = useNavigate();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const joinedCode = code.join('');
        if (joinedCode.length === 5) {
            navigate('/newpass');
        } else {
            alert('يرجى إدخال الرمز بالكامل');
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
                        أدخل رمز التحقق المكون من 5 أرقام
                    </p>
                </div>

                {/* White Box */}
                <form
                    onSubmit={handleSubmit}
                    className='w-full h-auto md:h-[318px] bg-[#FFFFFF] rounded-b-2xl flex justify-center flex-col items-center text-center px-4 sm:px-6 py-5 md:py-0'
                >
                    {/* Code inputs */}
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
                            />
                        ))}
                    </div>

                    {/* Timer */}
                    <p className="text-gray-500 text-[13px] sm:text-[14px] mb-5 sm:mb-7">
                        سيتم إرسال الرمز مرة أخرى خلال{' '}
                        <span className="text-green-700 font-semibold">{timer}</span> ثانية
                    </p>

                    {/* Confirm Button */}
                    <button
                        type="submit"
                        className='w-full max-w-[321px] h-[40px] sm:h-[27px] bg-[#00844B] text-white text-[12px] rounded-sm hover:bg-[#006C3C] transition duration-300 mb-4 md:mb-15'
                    >
                        تأكيد الرمز
                    </button>

                    {/* Divider */}
                    <div className='w-full max-w-[496px] h-[0.5px] bg-gray-300'></div>

                    {/* Resend */}
                    <div className="w-full pt-4 text-center text-[13px] sm:text-[14px] text-gray-600">
                        إعادة إرسال الرمز{' '}
                        <button
                            type="button"
                            className="text-[#00844B] cursor-pointer"
                            disabled={timer !== 0}
                        >
                            لم تستلم الرمز؟
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
