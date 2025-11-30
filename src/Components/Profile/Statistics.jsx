import React, { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { userContext } from '../Context/userContext';
import { BASE_URL } from '../../App'

export default function Statistics() {
    const [statistics, setStatistics] = useState({
        accepted: 0,
        rejected: 0,
        pending: 0,
        total: 0
    });
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthlyLoading, setMonthlyLoading] = useState(true);
    const [error, setError] = useState(null);
    const [monthlyError, setMonthlyError] = useState(null);
    let { userToken } = useContext(userContext);

    // Month translation mapping
    const monthTranslations = {
        'JANUARY': 'يناير',
        'FEBRUARY': 'فبراير',
        'MARCH': 'مارس',
        'APRIL': 'أبريل',
        'MAY': 'مايو',
        'JUNE': 'يونيو',
        'JULY': 'يوليو',
        'AUGUST': 'أغسطس',
        'SEPTEMBER': 'سبتمبر',
        'OCTOBER': 'أكتوبر',
        'NOVEMBER': 'نوفمبر',
        'DECEMBER': 'ديسمبر'
    };

    /**
     * Fetches user article statistics from API
     */
    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${BASE_URL}users/articles/status-count`, {
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json',
                } : {
                    'Accept': 'application/json',
                }
            });

            if (response.data) {
                setStatistics({
                    accepted: response.data.accepted || 0,
                    rejected: response.data.rejected || 0,
                    pending: response.data.pending || 0,
                    total: response.data.total || 0
                });
            }
        } catch (err) {
            console.error('Error fetching statistics:', err);
            setError('فشل في تحميل الإحصائيات');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetches monthly statistics from API
     */
    const fetchMonthlyStats = async () => {
        try {
            setMonthlyLoading(true);
            setMonthlyError(null);

            const response = await axios.get(`${BASE_URL}articles/stats/monthly`, {
                headers: userToken ? {
                    'Authorization': `Bearer ${userToken}`,
                    'Accept': 'application/json',
                } : {
                    'Accept': 'application/json',
                }
            });

            if (response.data && Array.isArray(response.data)) {
                setMonthlyStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching monthly statistics:', err);
            setMonthlyError('فشل في تحميل الإحصائيات الشهرية');
        } finally {
            setMonthlyLoading(false);
        }
    };

    /**
     * Translates English month names to Arabic
     */
    const translateMonth = (monthName) => {
        return monthTranslations[monthName] || monthName;
    };

    useEffect(() => {
        fetchStatistics();
        fetchMonthlyStats();
    }, []);

    return <>
        <section className='flex w-full md:w-[804px] items-end pt-6 md:pt-8 pr-4 md:pr-[33px] pb-6 md:pb-[33px] pl-4 md:pl-[33px] flex-col gap-4 md:gap-[23px] self-stretch rounded-[10px] border border-[rgba(233,200,130,0.10)] bg-[rgba(45,70,57,0.20)]'>
            {/* title 1*/}
            <div className='flex items-end flex-col w-full'>
                <section className='relative w-full'>
                    <h1 className='text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]'>الإحصائيات</h1>
                    <div className='w-[50px] md:w-[70px] absolute start-92 md:start-166 top-9 md:top-11 h-[2px] md:h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
                </section>
            </div>

            {/* cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-6 md:gap-y-3 w-full'>

                {/* card 1 - Pending */}
                <div className='w-full sm:w-[calc(50%-12px)] lg:w-[243.33px] flex flex-col items-end gap-3 md:gap-4 h-[140px] md:h-[164px] px-4 md:px-5 py-4 md:py-6 shrink-0 rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[13px] md:text-[14.4px] not-italic font-normal leading-normal'>
                        قيد المراجعة
                    </h1>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[24px] md:text-[28.8px] not-italic font-bold leading-normal'>
                        {loading ? '...' : error ? 'فشل التحميل' : statistics.pending}
                    </h1>
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#E74C3C] font-[Cairo] text-[11px] md:text-[12.8px] not-italic font-normal leading-normal'>
                                12%
                            </span>
                            <span className='text-[#E74C3C] font-[Cairo] text-[11px] md:text-[12.8px] not-italic font-normal leading-normal'>
                                عن الشهر الماضي
                            </span>
                        </div>
                        <FontAwesomeIcon className='text-[#E74C3C] text-right text-[11px] md:text-[12.8px] not-italic font-black leading-[12.8px]' icon={faArrowDown}></FontAwesomeIcon>
                    </div>
                </div>

                {/* card 2 - Accepted */}
                <div className='w-full sm:w-[calc(50%-12px)] lg:w-[243.33px] flex flex-col items-end gap-3 md:gap-4 h-[140px] md:h-[164px] px-4 md:px-5 py-4 md:py-6 shrink-0 rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[13px] md:text-[14.4px] not-italic font-normal leading-normal'>
                        المنشورات المقبولة
                    </h1>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[24px] md:text-[28.8px] not-italic font-bold leading-normal'>
                        {loading ? '...' : error ? 'فشل التحميل' : statistics.accepted}
                    </h1>
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] font-[Cairo] text-[11px] md:text-[12.8px] not-italic font-normal leading-normal'>
                                8%
                            </span>
                            <span className='text-[#00844B] font-[Cairo] text-[11px] md:text-[12.8px] not-italic font-normal leading-normal'>
                                عن الشهر الماضي
                            </span>
                        </div>
                        <FontAwesomeIcon className='text-[#00844B] text-right text-[11px] md:text-[12.8px] not-italic font-black leading-[12.8px]' icon={faArrowUp}></FontAwesomeIcon>
                    </div>
                </div>

                {/* card 3 - Total */}
                <div className='w-full sm:w-[calc(50%-12px)] lg:w-[243.33px] flex flex-col items-end gap-3 md:gap-4 h-[140px] md:h-[164px] px-4 md:px-5 py-4 md:py-6 shrink-0 rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[13px] md:text-[14.4px] not-italic font-normal leading-normal'>
                        إجمالي المنشورات
                    </h1>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[24px] md:text-[28.8px] not-italic font-bold leading-normal'>
                        {loading ? '...' : error ? 'فشل التحميل' : statistics.total}
                    </h1>
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] font-[Cairo] text-[11px] md:text-[12.8px] not-italic font-normal leading-normal'>
                                12%
                            </span>
                            <span className='text-[#00844B] font-[Cairo] text-[11px] md:text-[12.8px] not-italic font-normal leading-normal'>
                                عن الشهر الماضي
                            </span>
                        </div>
                        <FontAwesomeIcon className='text-[#00844B] text-right text-[11px] md:text-[12.8px] not-italic font-black leading-[12.8px]' icon={faArrowUp}></FontAwesomeIcon>
                    </div>
                </div>

                {/* card 4 - Rejected */}
                <div className='w-full sm:w-[calc(50%-12px)] lg:w-[243.33px] lg:col-start-3 flex flex-col items-end gap-3 md:gap-4 h-[140px] md:h-[164px] px-4 md:px-5 py-4 md:py-6 shrink-0 rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[13px] md:text-[14.4px] not-italic font-normal leading-normal'>
                        الرفض
                    </h1>
                    <h1 className='text-[#00844B] text-right font-[Cairo] text-[24px] md:text-[28.8px] not-italic font-bold leading-normal'>
                        {loading ? '...' : error ? 'فشل التحميل' : statistics.rejected}
                    </h1>
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-row-reverse items-center gap-1'>
                            <span className='text-[#00844B] font-[Cairo] text-[11px] md:text-[12.8px] not-italic font-normal leading-normal'>
                                4%
                            </span>
                            <span className='text-[#00844B] font-[Cairo] text-[11px] md:text-[12.8px] not-italic font-normal leading-normal'>
                                عن الشهر الماضي
                            </span>
                        </div>
                        <FontAwesomeIcon className='text-[#00844B] text-right text-[11px] md:text-[12.8px] not-italic font-black leading-[12.8px]' icon={faArrowDown}></FontAwesomeIcon>
                    </div>
                </div>
            </div>

            {/* part 2 */}
            {/* title 2*/}
            <div className='flex items-end flex-col w-full mt-4'>
                <section className='relative w-full'>
                    <h1 className='text-[#E9C882] text-right font-[Cairo] text-xl md:text-2xl not-italic font-bold leading-[40.8px]'>إحصائيات شهرية</h1>
                    <div className='w-full md:w-[10%] absolute right-0 top-10 md:top-11 h-[3px] bg-gradient-to-r from-[#00844B] to-[#E9C882]'></div>
                </section>

                <div className='mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-6 md:gap-y-3 w-full'>
                    {monthlyLoading ? (
                        // Loading state for monthly statistics - Display from right to left
                        <>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className='w-full sm:w-[calc(50%-12px)] lg:w-[243.33px] flex flex-col gap-3 md:gap-4 px-4 md:px-5 pt-4 md:pt-6 pb-8 md:pb-[52px] justify-center items-center rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                                    <h1 className='text-[#00844B] text-right font-[Poppins] text-[18px] md:text-[20px] not-italic font-semibold leading-normal'>جاري التحميل...</h1>
                                    <div className='flex flex-row-reverse items-center gap-1'>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            ...
                                        </span>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            منشور
                                        </span>
                                    </div>
                                    <div className='flex flex-row-reverse items-center gap-1'>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            ...
                                        </span>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            تفاعل
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : monthlyError ? (
                        // Error state for monthly statistics - Display from right to left
                        <>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className='w-full sm:w-[calc(50%-12px)] lg:w-[243.33px] flex flex-col gap-3 md:gap-4 px-4 md:px-5 pt-4 md:pt-6 pb-8 md:pb-[52px] justify-center items-center rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)]'>
                                    <h1 className='text-[#00844B] text-right font-[Poppins] text-[18px] md:text-[20px] not-italic font-semibold leading-normal'>فشل التحميل</h1>
                                    <div className='flex flex-row-reverse items-center gap-1'>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            -
                                        </span>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            منشور
                                        </span>
                                    </div>
                                    <div className='flex flex-row-reverse items-center gap-1'>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            -
                                        </span>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            تفاعل
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : monthlyStats.length > 0 ? (
                        // Success state - Display monthly statistics from API from right to left
                        <>
                            {monthlyStats.slice(0, 3).map((stat, index) => (
                                <div
                                    key={stat.id || index}
                                    className={`w-full sm:w-[calc(50%-12px)] lg:w-[243.33px] flex flex-col gap-3 md:gap-4 px-4 md:px-5 pt-4 md:pt-6 pb-8 md:pb-[52px] justify-center items-center rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] ${
                                        // This ensures the cards flow from right to left
                                        index === 0 ? 'lg:col-start-3' :
                                            index === 1 ? 'lg:col-start-2' :
                                                'lg:col-start-1'
                                        }`}
                                >
                                    <h1 className='text-[#00844B] text-right font-[Poppins] text-[18px] md:text-[20px] not-italic font-semibold leading-normal'>
                                        {translateMonth(stat.month)}
                                    </h1>
                                    <div className='flex flex-row-reverse items-center gap-1'>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            {stat.totalPosts || 0}
                                        </span>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            منشور
                                        </span>
                                    </div>
                                    <div className='flex flex-row-reverse items-center gap-1'>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            {stat.totalComments || 0}+
                                        </span>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            تفاعل
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        // Empty state for monthly statistics - Display from right to left
                        <>
                            {[1, 2, 3].map((item, index) => (
                                <div
                                    key={item}
                                    className={`w-full sm:w-[calc(50%-12px)] lg:w-[243.33px] flex flex-col gap-3 md:gap-4 px-4 md:px-5 pt-4 md:pt-6 pb-8 md:pb-[52px] justify-center items-center rounded-[12px] border-t-[4px] border-t-[var(--bright-green-00844-b,#00844B)] bg-[rgba(255,255,255,0.80)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] ${
                                        // This ensures the cards flow from right to left
                                        index === 0 ? 'lg:col-start-3' :
                                            index === 1 ? 'lg:col-start-2' :
                                                'lg:col-start-1'
                                        }`}
                                >
                                    <h1 className='text-[#00844B] text-right font-[Poppins] text-[18px] md:text-[20px] not-italic font-semibold leading-normal'>لا توجد بيانات</h1>
                                    <div className='flex flex-row-reverse items-center gap-1'>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            0
                                        </span>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            منشور
                                        </span>
                                    </div>
                                    <div className='flex flex-row-reverse items-center gap-1'>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            0
                                        </span>
                                        <span className='text-[#00844B] text-right font-[Tajawal] text-[13px] md:text-[14px] not-italic font-normal leading-normal'>
                                            تفاعل
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </section>
    </>
}