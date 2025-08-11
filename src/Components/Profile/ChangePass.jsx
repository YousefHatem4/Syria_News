import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function ChangePass() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <section className='flex w-full md:w-[804px] pt-6 md:pt-8 pr-4 md:pr-[33px] pb-6 md:pb-[33px] pl-4 md:pl-[33px] flex-col items-end gap-4 md:gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
        {/* title */}
        <section className='relative w-full'>
          <h1 className='text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]'>تغيير كلمة السر</h1>
          <div className='w-[50px] md:w-[70px] absolute start-92 md:start-166 top-10 md:top-11 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
        </section>

        {/* form */}
        <form className='mt-3 w-full'>
          {/* current password */}
          <div className='flex flex-col items-end gap-2 relative w-full'>
            <label htmlFor="current-password" className="text-[#E9C882] font-[Cairo] text-sm md:text-base not-italic font-normal leading-[27.2px]">كلمه السر الحاليه</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="current-password"
              className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal"
              defaultValue="أحمد محمد"
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
              className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal"
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
              className="text-white flex w-full md:w-[738px] py-3 md:py-[13.8px] px-3 md:px-[17px] justify-center items-start rounded-[5px] border border-[rgba(233,200,130,0.20)] bg-[rgba(255,255,255,0.05)] text-right font-[Cairo] text-sm md:text-base not-italic font-normal leading-normal"
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
            className='text-[#1B1D1E] mt-5 md:mt-7 cursor-pointer text-center font-[Cairo] text-sm md:text-base not-italic font-semibold leading-normal flex w-full md:w-[738px] py-3 md:pt-[13.8px] md:pr-6 md:pb-[12.8px] md:pl-6 flex-col justify-center items-center rounded-[5px] bg-[var(--light-sand-beige-e-9-c-882,#E9C882)]'
          >
            حفظ التغييرات
          </button>
        </form>
      </section>
    </>
  );
}