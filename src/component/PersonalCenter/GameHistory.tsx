import { useEffect, useState } from 'react';
import { FormControl, Autocomplete, TextField, Paper } from '@mui/material';
import { addDays } from 'date-fns';
import { useAppSelector } from '@/redux/hooks';
import { logError, scrollToTop } from '@/utils';
import GameType from '@/types/game';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { CustomButton } from '@/component/common';
import { PostMethod } from '@/services/fetchAPI';
import Loader from '@/component/common/mui-component/Loader';
import CustomMuiPagination from '@/component/common/mui-component/CustomMuiPagination';
import CustomDatePicker from '@/component/common/mui-component/CustomDatePicker';

const GameHistory = () => {
  const user = useAppSelector((state) => state.user.user)
  const [gametypeSelection, setGametypeSelection] = useState('')
  const [startDate, setStartDate] = useState(addDays(new Date(), -7))
  const [endDate, setEndDate] = useState(new Date())
  const [gameHistory, setGameHistory] = useState<GameType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageSkip, setPageSkip] = useState(0)
  const pageLimit = 10
  const { t } = useTranslation()

  const handleGameHistory = async () => {
    setIsLoading(true)
    scrollToTop()
    const paraGameHistory = {
      userId: user?._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      skip: pageSkip,
      limit: pageLimit,
      gameName: gametypeSelection || '',
    }

    try {
      const response: any = await PostMethod('gameReport', paraGameHistory)
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || t('Something went wrong'))
      }
      if (
        response.data.result &&
        Array.isArray(response.data?.result?.gameHistory)
      ) {
        setGameHistory(response.data.result)
      } else {
        setGameHistory(null)
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

  const gameTypeHandle = (event: any, newValue: any) => {
    setGametypeSelection(newValue)
  }

  const handleDate = (range: [Date, Date]) => {
    const [start, end] = range
    setStartDate(start)
    setEndDate(end)
  }

  const handleSearch = () => {
    if (pageSkip !== 0) {
      setPageSkip(0)
    } else {
      handleGameHistory()
    }
  }

  useEffect(() => {
    handleGameHistory()
  }, [pageSkip, user?._id])

  return (
    <>
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
        <FormControl className="invitationBonus" fullWidth>
          <Autocomplete
            value={gametypeSelection}
            onChange={gameTypeHandle}
            options={user?.Game || []}
            getOptionLabel={(option) => option}
            noOptionsText={
              <span className="text-white">{t('No Options')}</span>
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t('Select Option')}
                InputProps={{
                  ...params.InputProps,
                  className: 'custom-autocomplete',
                }}
                className="custom-autocomplete"
              />
            )}
            PaperComponent={({ children }) => (
              <Paper className="custom-autocomplete">{children}</Paper>
            )}
          />
        </FormControl>
        <CustomButton
          className="search-btn"
          onClick={handleSearch}
          isLoading={isLoading}
        >
          {t('Search')}
        </CustomButton>
      </div>
      <div className="depositTable game-history-table over-flow-x-auto">
        {isLoading ? (
          <Loader />
        ) : (
          <table className="table table-border">
            <thead>
              <tr className="table-tr">
                <th scope="col">{t('Transaction Id')}</th>
                <th scope="col">{t('Period')}</th>
                <th scope="col">{t('Game Name')}</th>
                <th scope="col">{t('Bet Amount')}</th>
                <th scope="col">{t('Earnings')}</th>
                <th scope="col">{t('Losses')}</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory?.gameHistory &&
              gameHistory?.gameHistory?.length > 0 ? (
                gameHistory?.gameHistory
                  ?.slice()
                  ?.sort(
                    (a, b) =>
                      new Date(b?.createdAt).getTime() -
                      new Date(a?.createdAt).getTime(),
                  )
                  .map((item) => (
                    <tr className="text-white" key={item?._id}>
                      <th scope="row">{item?._id}</th>
                      <td>{`${dayjs(item?.createdAt).format('LLL')}`}</td>
                      <td>{item?.gameName}</td>
                      <td>{item?.betAmount?.toFixed(2)}</td>
                      <td>{item?.winAmount?.toFixed(2)}</td>
                      <td>
                        {typeof item?.betAmount === 'number' &&
                        typeof item?.winAmount === 'number' &&
                        item?.betAmount - item?.winAmount < 0
                          ? '0.00'
                          : (item?.betAmount - item?.winAmount).toFixed(2)}
                      </td>
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
      {gameHistory?.totalCount && gameHistory?.totalCount > 0 && (
        <div className="depositPagination">
          <CustomMuiPagination
            className="pagination-text"
            pageSkip={pageSkip}
            totalCount={gameHistory?.totalCount}
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

export default GameHistory
