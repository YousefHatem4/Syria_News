import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet, faEye, faCheck, faXmark, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function LastPosts() {
  const [status, setStatus] = useState("pending"); // "pending" | "accepted" | "rejected"
  const [buttonState, setButtonState] = useState("initial"); // "initial" | "edit" | "view"
  const [hasMadeDecision, setHasMadeDecision] = useState(false); // track if user has made a decision

  const handleAccept = () => {
    setStatus("accepted");
    setButtonState("view");
    setHasMadeDecision(true);
  };

  const handleReject = () => {
    setStatus("rejected");
    setButtonState("view");
    setHasMadeDecision(true);
  };

  const handleSwap = () => {
    if (buttonState === "initial") {
      setButtonState("edit");
    } else if (buttonState === "edit") {
      setButtonState("view");
    } else {
      setButtonState("edit");
    }
    // setStatus("pending");
    setHasMadeDecision(false);
  };

  return (
    <>
      {/* Large Screen Version */}
      <section className="hidden lg:flex w-[804px] px-[17px] pt-8 pb-[444.8px] flex-col items-center gap-[33.2px] shrink-0 rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]">
        {/* title 1*/}
        <div className="flex items-end flex-col w-full">
          <section className="relative w-full">
            <h1 className="text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]">
              آخر المنشورات
            </h1>
            <div className="w-[50px] md:w-[70px] absolute start-92 md:start-174 top-9 md:top-12 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]"></div>
          </section>
        </div>

        {/* main content */}
        <section className="mt-4">
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

          {/* posts */}
          <section className="flex w-[770px] h-[89.5px] justify-end items-center shrink-0 mt-3">
            {/* btns */}
            <div className="flex w-[167.41px] pt-[26.5px] pr-[15px] pb-[27px] pl-[15px] flex-row-reverse gap-2 items-end shrink-0 self-stretch border-b border-[#EEE] ">
              <div className="flex flex-row-reverse gap-2 -me-9 z-10 ">
                {/* Swap button */}
                <button
                  onClick={handleSwap}
                  className="flex w-[40px] cursor-pointer h-[36px] px-[7.176px] pt-[6.192px] pb-[5.808px] pl-[8.824px] justify-center items-center shrink-0 rounded-[5px] bg-[#00844B]"
                >
                  <FontAwesomeIcon className="text-[#FFFFFF]" icon={faRetweet} />
                </button>

                {/* Initial state - Accept/Reject buttons (only show if no decision made) */}
                {buttonState === "initial" && !hasMadeDecision && (
                  <>
                    <button
                      onClick={handleAccept}
                      className="flex w-[67.89px] cursor-pointer h-[36px] pt-[6px] pr-[11.41px] pb-[6px] pl-[12px] justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal "
                    >
                      قبول <FontAwesomeIcon className="text-[#FFFFFF]" icon={faCheck} />
                    </button>

                    <button
                      onClick={handleReject}
                      className="flex w-[63.23px] cursor-pointer h-[36px] pt-[6px] pr-[12.6px] pb-[6px] pl-[12px] justify-center items-center gap-1 shrink-0 rounded-[5px] bg-[#E74C3C] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal"
                    >
                      رفض <FontAwesomeIcon className="text-[#FFFFFF]" icon={faXmark} />
                    </button>
                  </>
                )}

                {/* Edit button */}
                {buttonState === "edit" && (
                  <button className="flex w-[67.89px] cursor-pointer h-[36px] pt-[6px] pr-[11.41px] pb-[6px] pl-[12px] justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal ">
                    تعديل <FontAwesomeIcon className="text-[#FFFFFF]" icon={faPenToSquare} />
                  </button>
                )}

                {/* View button */}
                {buttonState === "view" && (
                  <button className="flex w-[67.89px] cursor-pointer h-[36px] pt-[6px] pr-[11.41px] pb-[6px] pl-[12px] justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-[12.8px] font-normal leading-normal ">
                    عرض <FontAwesomeIcon className="text-[#FFFFFF]" icon={faEye} />
                  </button>
                )}
              </div>
            </div>

            {/* view */}
            <div className="flex w-[91.27px] px-[15px] pt-[29.5px] pb-[30px] flex-col items-end shrink-0 self-stretch border-b border-[#EEE]">
              <h1 className="text-[#B0B3B4] text-right font-[cairo] text-base font-normal leading-normal">1.2K</h1>
            </div>

            {/* date */}
            <div className="flex w-[115.06px] px-[15px] pt-[29.5px] pb-[30px] flex-col items-end shrink-0 self-stretch border-b border-[#EEE]">
              <h1 className="text-[#B0B3B4] text-right font-[cairo] text-[16px] font-normal leading-normal">
                15/02/2023
              </h1>
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
              <h1 className="text-[#B0B3B4] text-right font-[cairo] text-[16px] font-semibold leading-normal">
                تطورات الأوضاع في المنطقة الشمالية
              </h1>
              <p className="text-[#8A8A8A] text-center font-[cairo] text-[12.8px] font-normal leading-normal">
                منذ 2023
              </p>
            </div>
          </section>
        </section>
      </section>

      {/* Mobile/Tablet Version */}
      <section className="lg:hidden w-full px-4 pt-6 pb-8 flex flex-col items-center gap-6 rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]">
        {/* title */}
        <div className="flex items-end flex-col w-full">
          <section className="relative w-full">
            <h1 className="text-[#E9C882] text-right font-[Cairo] text-xl not-italic font-bold leading-[40.8px]">
              آخر المنشورات
            </h1>
            <div className="w-[50px] absolute start-92 top-10 h-[2px] bg-gradient-to-r from-[#00844B] to-[#E9C882]"></div>
          </section>
        </div>

        {/* post card */}
        <div className="w-full rounded-lg bg-[#2D4639] p-4">
          {/* post title and date */}
          <div className="flex flex-col items-end gap-1 border-b border-[#EEE] pb-3">
            <h1 className="text-[#B0B3B4] text-right font-[cairo] text-base font-semibold">
              تطورات الأوضاع في المنطقة الشمالية
            </h1>
            <p className="text-[#8A8A8A] text-right font-[cairo] text-xs">
              منذ 2023 • 15/02/2023
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
            <span className="text-[#B0B3B4] text-right font-[cairo] text-sm">
              التفاعلات: 1.2K
            </span>
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

            {/* Initial state - Accept/Reject buttons (only show if no decision made) */}
            {buttonState === "initial" && !hasMadeDecision && (
              <>
                <button
                  onClick={handleAccept}
                  className="flex h-9 cursor-pointer px-3 justify-center items-center gap-1 rounded-[5px] bg-[#00844B] text-white text-center font-[cairo] text-xs"
                >
                  قبول <FontAwesomeIcon className="text-white" icon={faCheck} />
                </button>

                <button
                  onClick={handleReject}
                  className="flex h-9 px-3 cursor-pointer justify-center items-center gap-1 rounded-[5px] bg-[#E74C3C] text-white text-center font-[cairo] text-xs"
                >
                  رفض <FontAwesomeIcon className="text-white" icon={faXmark} />
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
          </div>
        </div>
      </section>
    </>
  );
}