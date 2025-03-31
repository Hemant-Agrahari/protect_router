import { useState, useEffect } from 'react'
import { FormControl, Pagination } from '@mui/material'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import { useAppSelector } from '@/redux/hooks'
import { formatDate, logError, scrollToTop } from '@/utils'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { PostMethod } from '@/services/fetchAPI'

const WithdrawTab = () => {
  const user = useAppSelector((state) => state.user.user)
  const [startDate, setStartDate] = useState(addDays(new Date(), -7))
  const [endDate, setEndDate] = useState(new Date())
  const [walletHistory, setWalletHistory] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const [pageSkip, setPageSkip] = useState(0)
  const pageLimit = 10

  const handleChange = (range: [Date, Date]) => {
    const [startDate, endDate] = range
    setStartDate(startDate)
    setEndDate(endDate)
  }
  const handleWalletHistory = async () => {
    setIsLoading(true)
    scrollToTop()
    const paraDepositReport = {
      userId: user?._id,
      startDate: formatDate(
        startDate?.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      ),
      endDate: formatDate(
        endDate?.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      ),
      skip: pageSkip,
      limit: pageLimit,
    }
    try {
      const response: any = await PostMethod('withdrawReport', {
        ...paraDepositReport,
      })
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || t('Something went wrong'))
      }
      //
      if (response.data.result && Array.isArray(response.data.result.data)) {
        setWalletHistory(response.data.result)
      } else {
        setWalletHistory(null)
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
      handleWalletHistory()
    }
  }

  useEffect(() => {
    handleWalletHistory()
  }, [pageSkip, user?._id])

  return (
    <div>
      <div className="bonus-date">
        <FormControl className="statistics-startEndDate">
          <DatePicker
            selected={startDate}
            onChange={handleChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            maxDate={new Date()}
            placeholderText={t('"Start - End Date"')}
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
          <table className="table table-border">
            <thead>
              <tr style={{ color: '#A0ABDB' }}>
                <th scope="col">{t('Transaction Id')}</th>
                <th scope="col">{t('Date')}</th>
                <th scope="col">{t('Withdrawal Value')}</th>
                <th scope="col">{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              {walletHistory?.data && walletHistory?.data?.length > 0 ? (
                walletHistory?.data?.map((user: any) => (
                  <tr key={user.transactionId} style={{ color: '#fff' }}>
                    <td>{user.transactionId ? user?.transactionId : '--'}</td>
                    <td>{`${dayjs(user?.createdAt).format('LLL')}`}</td>

                    <td>{user.withdrawValue}</td>
                    {/* <td>{user.withdrawFee}</td>
                  <td>{user.finalValue}</td>
                  <td>Comments</td> */}
                    <td>{user.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="fw-bold fs-4" colSpan={6}>
                    {t('Data Not Found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* ======= Pagination buttons for Wallet History ===== */}

      <div className="depositPagination">
        <Pagination
          className="pagination-text"
          page={pageSkip / 10 + 1}
          count={Math.ceil(
            Number(walletHistory?.count || 1) / Number(pageLimit),
          )}
          onChange={(e, v: number) => {
            setPageSkip((v - 1) * pageLimit)
          }}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  )
}

export default WithdrawTab
