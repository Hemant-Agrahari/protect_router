import { useAppSelector } from '@/redux/hooks';
import { PostMethod } from '@/services/fetchAPI';
import { logError, scrollToTop } from '@/utils';
import { FormControl, Pagination } from '@mui/material';
import { addDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@/component/common/mui-component/Loader';
import CustomMuiPagination from '@/component/common/mui-component/CustomMuiPagination';
import { CustomButton } from '@/component/common';
import CustomDatePicker from '@/component/common/mui-component/CustomDatePicker';


const Statistics = () => {
  const user = useAppSelector((state) => state.user.user)
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState(addDays(new Date(), -7))
  const [endDate, setEndDate] = useState(new Date())
  const [statisticsReport, setStatisticsReport] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageSkip, setPageSkip] = useState(0)
  const pageLimit = 10

  const handleDate = (range: [Date, Date]) => {
    const [startDate, endDate] = range
    setStartDate(startDate)
    setEndDate(endDate)
  }

  const handleStatisticsHistory = async () => {
    setIsLoading(true)
    scrollToTop()
    const paraStatisticsReport = {
      userId: user?._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      skip: pageSkip,
      limit: pageLimit,
      type: 'betCommission',
    }

    try {
      const response: any = await PostMethod(
        'bonusHistory',
        paraStatisticsReport,
      )
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || t('Something went wrong'))
      }
      //
      if (response.data.result && Array.isArray(response.data.result.data)) {
        setStatisticsReport(response.data.result)
      } else {
        setStatisticsReport(null)
        throw new Error(response.data.message || t('Something went wrong'))
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (pageSkip !== 0) {
      setPageSkip(0)
    } else {
      handleStatisticsHistory()
    }
  }

  useEffect(() => {
    handleStatisticsHistory()
  }, [pageSkip, user?._id])

  return (
    <>
      <div className="StatisticsTab">
        <div className="bonus-date">
          <FormControl className="statistics-startEndDate">
          <CustomDatePicker
            selected={startDate}
            onChange={handleDate}
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            placeholderText={t('"Start - End Date"')}
          />
          </FormControl>
          <CustomButton className="search-btn" onClick={handleSearch}>
            {t('Search')}
          </CustomButton>
        </div>

        <div className="depositTable over-flow-x-auto">
          {isLoading ? (
            <Loader />
          ) : (
            <table className="table table-border text-white table-container">
              <thead>
                <tr>
                  <th scope="col">{t('Bonus')}</th>
                  <th scope="col">{t('User')}</th>
                  <th scope="col">{t('Time')}</th>
                </tr>
              </thead>
              <tbody>
                {statisticsReport?.data && statisticsReport.data.length > 0 ? (
                  statisticsReport.data.map((item: any) => (
                    <tr key={item.transactionId}>
                      <td>{item?.bonus?.toFixed(2)}</td>
                      <td>{item.nickName}</td>
                      <td>
                        <span className="font-weight-400 mr-3">
                          {item?.date?.split('T')[0]}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="fw-bold fs-4" colSpan={3}>
                      {t('Data Not Found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {statisticsReport?.totalCount && statisticsReport?.totalCount > 0 && (
        <div className="depositPagination">
          <CustomMuiPagination
            className="pagination-text"
            pageSkip={pageSkip}
            totalCount={statisticsReport?.totalCount}
            pageLimit={pageLimit}
            onChange={(e, v: number) => {
              setPageSkip((v - 1) * pageLimit)
            }}
          />
        </div>
      )}
    </>
  )
}

export default Statistics
