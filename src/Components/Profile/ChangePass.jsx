import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { BASE_URL } from '../../App';
import toast, { Toaster } from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa';

export default function ChangePass() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get the token from localStorage (from login)
    const userToken = localStorage.getItem('userToken');

    // Get the saved password from localStorage (from login)
    const savedPassword = localStorage.getItem('userPassword');

    if (userToken) {
      setToken(userToken);
    } else {
      console.warn('No token found in localStorage');
    }

    if (savedPassword) {
      setCurrentPassword(savedPassword);
    } else {
      console.warn('No saved password found in localStorage');
    }
  }, []);

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!currentPassword) {
      alert('الرجاء إدخال كلمة المرور الحالية');
      return;
    }

    if (!newPassword) {
      alert('الرجاء إدخال كلمة المرور الجديدة');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    if (newPassword.length < 6) {
      alert('كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف');
      return;
    }

    if (newPassword === currentPassword) {
      alert('كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية');
      return;
    }

    try {
      setLoading(true);

      // Create FormData payload for change password endpoint
      const formData = new FormData();
      formData.append('oldPassword', currentPassword);
      formData.append('newPassword', newPassword);

      // Create axios instance with proper configuration
      const axiosInstance = axios.create({
        baseURL: BASE_URL.replace(/\/+$/, ''), // Remove trailing slashes
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      // Send request to change password endpoint
      const response = await axiosInstance.post('/auth/reset-password', formData);

      console.log('Change password response:', response.data);

      if (response.status === 200 || response.status === 201) {
        // Update the saved password in localStorage
        localStorage.setItem('userPassword', newPassword);
        setCurrentPassword(newPassword);

        // Show success toast
        toast.custom(
          (t) => (
            <div
              className={`flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 ${t.visible ? 'animate-enter' : 'animate-leave'
                }`}
              dir="rtl"
            >
              <FaCheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-gray-800">
                تم تغيير كلمة المرور بنجاح
              </span>
            </div>
          ),
          { duration: 2000 }
        );

        // Clear new password fields
        setNewPassword('');
        setConfirmPassword('');
      }

    } catch (err) {
      console.error('Change password error:', err);

      // Handle specific error cases
      if (err.code === 'ERR_NETWORK') {
        alert('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
      } else if (err.response?.status === 400) {
        if (err.response.data?.message?.toLowerCase().includes('old password')) {
          alert('كلمة المرور الحالية غير صحيحة');
        } else {
          alert('طلب غير صالح. يرجى المحاولة مرة أخرى.');
        }
      } else if (err.response?.status === 401) {
        alert('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.');
      } else if (err.response?.status === 404) {
        alert('الرابط غير صالح أو منتهي الصلاحية.');
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('فشل في تغيير كلمة المرور. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast container */}
      <Toaster />

      <section className='flex w-full md:w-[804px] pt-6 md:pt-8 pr-4 md:pr-[33px] pb-6 md:pb-[33px] pl-4 md:pl-[33px] flex-col items-end gap-4 md:gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
        {/* title */}
        <section className='relative w-full'>
          <h1 className='text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]'>تغيير كلمة السر</h1>
          <div className='w-[50px] md:w-[70px] absolute start-92 md:start-166 top-10 md:top-11 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
        </section>

        {/* form */}
        <form className='mt-3 w-full' onSubmit={handleSubmit}>
          {/* current password */}
          <div className='flex flex-col items-end gap-2 relative w-full'>
            <label htmlFor="current-password" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">كلمه السر الحاليه</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="current-password"
              value={currentPassword}
              readOnly
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal"
              placeholder="أدخل كلمة المرور الحالية"
              disabled={loading}
            />
            <FontAwesomeIcon
              icon={showCurrentPassword ? faEye : faEyeSlash}
              onClick={toggleCurrentPasswordVisibility}
              className="absolute left-3 top-[42px] md:top-[52px] cursor-pointer text-[#8A8A8A] text-lg md:text-xl"
            />
          </div>

          {/* new password */}
          <div className='flex flex-col items-end gap-2 mt-4 md:mt-6 relative w-full'>
            <label htmlFor="new-password" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">كلمة السر الجديدة</label>
            <input
              type={showPassword ? "text" : "password"}
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal"
              placeholder="أدخل كلمة المرور الجديدة"
              disabled={loading}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={togglePasswordVisibility}
              className="absolute left-3 top-[42px] md:top-[52px] cursor-pointer text-[#8A8A8A] text-lg md:text-xl"
            />
          </div>

          {/* confirm password */}
          <div className='flex flex-col items-end gap-2 mt-4 md:mt-6 relative w-full'>
            <label htmlFor="confirm-password" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">تأكيد كلمة السر الجديدة</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal"
              placeholder="أعد إدخال كلمة المرور الجديدة"
              disabled={loading}
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEye : faEyeSlash}
              onClick={toggleConfirmPasswordVisibility}
              className="absolute left-3 top-[42px] md:top-[52px] cursor-pointer text-[#8A8A8A] text-lg md:text-xl"
            />
          </div>

          {/* btn */}
          <button
            type='submit'
            disabled={loading}
            className='text-[#1B1D1E] mt-5 md:mt-7 cursor-pointer text-center font-[Cairo] text-sm md:text-base not-italic font-semibold leading-normal flex w-full md:w-[738px] py-3 md:pt-[13.8px] md:pr-6 md:pb-[12.8px] md:pl-6 flex-col justify-center items-center rounded-[5px] bg-[var(--light-sand-beige-e-9-c-882,#E9C882)] disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {loading ? 'جاري حفظ التغييرات...' : 'حفظ التغييرات'}
          </button>
        </form>
      </section>
    </>
  );
}