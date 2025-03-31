import { useEffect, useState } from 'react'
import {
  FormControl,
  Pagination,
  Autocomplete,
  TextField,
  Paper,
} from '@mui/material'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import { useAppSelector } from '@/redux/hooks'
import { logError, scrollToTop } from '@/utils'
import GameType from '@/types/game'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { Button } from '../common'
import { PostMethod } from '@/services/fetchAPI'

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
      //
      if (
        response.data.result &&
        Array.isArray(response.data.result.gameHistory)
      ) {
        setGameHistory(response.data.result)
      } else {
        setGameHistory(null)
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
        {/* <FormControl className="invitationBonus">
          <Select
            value={gametypeSelection}
            onChange={gameTypeHandle}
            autoWidth
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            IconComponent={KeyboardArrowDownIcon}
          >
            <MenuItem value="" disabled>
              <em>Select Option</em>
            </MenuItem>
            <MenuItem value="">All</MenuItem>
            {user?.Game?.map((item: string, key: number) => (
              <MenuItem value={item} key={key}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
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
                  sx: {
                    color: 'white', // Set the text color to white
                    '& .MuiAutocomplete-input': {
                      color: 'white', // Ensure the input text color is white
                    },
                    backgroundColor: 'var(--gray-400)', // Set the background color
                  },
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'white', // Set the text color to white
                    opacity: 1,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white', // Set the border color to white
                    },
                    '&:hover fieldset': {
                      borderColor: 'white', // Set the border color to white on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white', // Set the border color to white when focused
                    },
                    backgroundColor: 'var(--gray-400)', // Set the background color
                  },
                  '& .MuiFormLabel-root': {
                    color: 'white', // Set the label color to white
                  },
                }}
              />
            )}
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  backgroundColor: 'var(--gray-400)',
                  '& .MuiAutocomplete-option': {
                    color: 'white', // Option text color
                    '&:hover': {
                      backgroundColor: 'var(--blue) !important', // Hover background color for options
                    },
                  },
                }}
              >
                {children}
              </Paper>
            )}
          />
        </FormControl>

        <Button
          className="search-btn"
          onClick={handleSearch}
          isLoading={isLoading}
        >
          {t('Search')}
        </Button>
      </div>
      <div
        className="depositTable game-history-table"
        style={{ overflowX: 'auto' }}
      >
        {isLoading ? (
          <div className="loader-animate-division">
            <div className="loader"></div>
          </div>
        ) : (
          <table className="table table-border">
            <thead>
              <tr style={{ color: '#A0ABDB' }}>
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
                    <tr style={{ color: '#fff' }} key={item?._id}>
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
        {/* ======= Pagination buttons for Game History ===== */}

        {/* <div className="depositPagination">
          <button
            className="btn paginationButton m-1"
            onClick={() => setPageSkip(pageSkip - 10)}
            disabled={isMutating || (pageSkip === 0 && pageLimit === 10)}
          >
            <ArrowBackIosNew className="fs-6" />
          </button>
          <button
            className="btn paginationButton2 m-1"
            onClick={() => setPageSkip(0)}
            disabled={isMutating || (pageSkip === 0 && pageLimit === 10)}
          >
            First
          </button>
          <button
            className="btn paginationButton2 m-1"
            onClick={() => setPageSkip(Math.round(totalPages * pageLimit) - 10)}
            disabled={isMutating || gameHistory?.length < pageLimit}
          >
            Last
          </button>
          <button
            className="btn paginationButton m-1"
            onClick={() => setPageSkip(pageSkip + 10)}
            disabled={isMutating || gameHistory?.length < pageLimit}
          >
            <ArrowForwardIos className="fs-6" />
          </button>
        </div> */}
      </div>
      <div className="depositPagination">
        <Pagination
          className="pagination-text"
          page={pageSkip / 10 + 1}
          count={Math.ceil(
            Number(gameHistory?.totalCount || 1) / Number(pageLimit),
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

export default GameHistory
