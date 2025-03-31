import { useState, useEffect } from 'react';
import { FormControl } from '@mui/material';
import { addDays } from 'date-fns';
import { useAppSelector } from '@/redux/hooks';
import { formatDate, logError, scrollToTop } from '@/utils';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { PostMethod } from '@/services/fetchAPI';
import Loader from '@/component/common/mui-component/Loader';
import CustomMuiPagination from '@/component/common/mui-component/CustomMuiPagination';
import { CustomButton } from '@/component/common';
import CustomDatePicker from '@/component/common/mui-component/CustomDatePicker';

const WithdrawTab = () => {
  const user = useAppSelector((state) => state.user.user)
  const [startDate, setStartDate] = useState(addDays(new Date(), -7))
  const [endDate, setEndDate] = useState(new Date())
  const [walletHistory, setWalletHistory] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const [pageSkip, setPageSkip] = useState(0)
  const pageLimit = 10

  const handleDate = (range: [Date, Date]) => {
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
      if (response.data.result && Array.isArray(response.data.result.data)) {
        setWalletHistory(response.data.result)
      } else {
        setWalletHistory(null)
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
      <div className="depositTable deposit-table-content">
        {isLoading ? (
          <Loader />
        ) : (
          <table className="table table-border">
            <thead>
              <tr className="table-tr">
                <th scope="col">{t('Transaction Id')}</th>
                <th scope="col">{t('Date')}</th>
                <th scope="col">{t('Withdrawal Value')}</th>
                <th scope="col">{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              {walletHistory?.data && walletHistory?.data?.length > 0 ? (
                walletHistory?.data?.map((user: any) => (
                  <tr key={user.transactionId} className="text-white">
                    <td>{user.transactionId ? user?.transactionId : '--'}</td>
                    <td>{`${dayjs(user?.createdAt).format('LLL')}`}</td>

                    <td>{user.withdrawValue}</td>
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
      {walletHistory?.totalCount && walletHistory?.totalCount > 0 && (
        <div className="depositPagination">
          <CustomMuiPagination
            className="pagination-text"
            pageSkip={pageSkip}
            totalCount={walletHistory?.totalCount}
            pageLimit={pageLimit}
            onChange={(e, v: number) => {
              setPageSkip((v - 1) * pageLimit)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default WithdrawTab
