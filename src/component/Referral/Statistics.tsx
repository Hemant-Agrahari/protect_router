import { useAppSelector } from '@/redux/hooks'
import { PostMethod } from '@/services/fetchAPI'
import { logError, scrollToTop } from '@/utils'
import { FormControl, Pagination } from '@mui/material'
import { addDays } from 'date-fns'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useTranslation } from 'react-i18next'

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
        // toast.error(error.message)
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
            <DatePicker
              selected={startDate}
              onChange={handleDate}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              maxDate={new Date()}
              placeholderText={t('Start - End Date')}
            />
          </FormControl>
          <button className="search-btn" onClick={handleSearch}>
            {t('Search')}
          </button>
        </div>

        <div className="depositTable" style={{ overflowX: 'auto' }}>
          {isLoading ? (
            <div className="loader-animate-division">
              <div className="loader"></div>
            </div>
          ) : (
            <table
              className="table table-border"
              style={{
                backgroundColor: 'transparent',
                color: 'white !important',
                borderCollapse: 'collapse',
              }}
            >
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
                        <span
                          style={{ fontWeight: '400', marginRight: '12px' }}
                        >
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
      <div className="depositPagination">
        <Pagination
          className="pagination-text"
          page={pageSkip / 10 + 1}
          count={Math.ceil(
            Number(statisticsReport?.totalCount || 1) / Number(pageLimit),
          )}
          onChange={(e, v: number) => {
            setPageSkip((v - 1) * pageLimit)
          }}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </>
  )
}

export default Statistics
