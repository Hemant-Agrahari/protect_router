import { GetMethod, PostMethod } from '@/services/fetchAPI'
import { logError } from '@/utils'
import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
const PrivacyPolicy = () => {
  const router = useRouter()
  const { tab } = router.query
  const [value, setValue] = useState<number>(0)
  const [content, setContent] = useState<any>([])
  const [expanded, setExpanded] = React.useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(true)
  const { t } = useTranslation()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const fetchContant = async (contentType: string) => {
    try {
      setLoading(true)
      const res: any = await PostMethod('cmsPage', { type: contentType })

      if (res.data.status !== 'success') {
        throw new Error('Error from this endpoint')
      }

      setContent(res.data?.result)
    } catch (error) {
      logError(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFAQ = async () => {
    try {
      setLoading(true)
      const res: any = await GetMethod('faq')

      if (res.data.status !== 'success') {
        throw new Error('Error from this endpoint')
      }
      setContent(res.data?.result)
    } catch (error) {
      logError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChanges = (value: string) => {
    setExpanded((prev: string) => {
      if (value === prev) {
        return ''
      } else {
        return value
      }
    })
  }

  const contentTypes: Record<string, string> = {
    0: 'termsOfServices',
    1: 'privacyPolicy',
  }

  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    marginBottom: 'clamp(16px, 4px + 1.2vw, 32px )',
    backgroundColor: '#2B2B2B',
    borderRadius: 'clamp(10px, 4px + 1vw, 24px )',
    padding: 'clamp(8px, 4px + .5vw, 12px)',
    border: `0px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  }))

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary {...props} />
  ))(({ theme }: { theme: any }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#2B2B2B',

    flexDirection: 'row-reverse',

    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
      border: 'none',
      color: '#fff',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
      backgroundColor: '#2B2B2B',
      border: 'none',
    },
  }))

  const AccordionDetails = styled(MuiAccordionDetails)(
    ({ theme }: { theme: any }) => ({
      padding: theme.spacing(2),
      borderTop: '0px solid rgba(0, 0, 0, .125)',
      backgroundColor: '#2B2B2B',
    }),
  )

  const titles = [
    'Terms & Conditions',
    'Privacy Policy',
    'FAQ',
    'Betting Rules',
  ]

  useEffect(() => {
    setValue(Number(tab))
  }, [tab])

  useEffect(() => {
    if (value !== undefined) {
      setValue(Number(value))
    }

    if (value !== 2) {
      fetchContant(contentTypes[String(value)])
    } else {
      fetchFAQ()
    }
  }, [value])

  return (
    <div className="privacyTems-page">
      <div className="privacyPolicy-banner">
        <div className="container">
          <h1>{t(titles[value])}</h1>
        </div>
      </div>

      <div className="container pt-5 mt-md-5">
        <Box sx={{ width: '100%' }}>
          <Box className="tabs-box">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              className="tabs-boxslist"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                className="tabs-list mx-2 fs-28"
                label={t('Terms & Conditions')}
                {...a11yProps(0)}
              />
              <Tab
                className="tabs-list mx-2 fs-28"
                label={t('Privacy Policy')}
                {...a11yProps(1)}
              />
              <Tab
                className="tabs-list mx-2 fs-28"
                label={t('FAQ')}
                {...a11yProps(2)}
              />
              <Tab
                className="tabs-list mx-2 fs-28"
                label={t('Betting Rules')}
                {...a11yProps(3)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <h2 className="fs-100 fw-medium">{t('Terms & Conditions')}</h2>
            {isLoading ? (
              <div className="loader-animate-division">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="pb-md-3 pb-0">
                <p
                  dangerouslySetInnerHTML={{
                    __html: content[0]?.description,
                  }}
                ></p>
              </div>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <h2 className="fs-100 fw-medium">{t('Privacy Policy')}</h2>
            {isLoading ? (
              <div className="loader-animate-division">
                <div className="loader"></div>
              </div>
            ) : (
              <div className=" pb-md-3 pb-0">
                <p
                  dangerouslySetInnerHTML={{
                    __html: content[0]?.description,
                  }}
                ></p>
              </div>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <h2 className="fs-100 fw-medium">
              {' '}
              {t('Frequently Asked Questions')}
            </h2>
            <div className="px-lg-5 w-100 pt-md-5 pt-3">
              {isLoading ? (
                <div className="loader-animate-division">
                  <div className="loader"></div>
                </div>
              ) : (
                <div className="faq-accordian">
                  {content.length > 0 &&
                    content.map((item: any, index: any) => {
                      return (
                        <Accordion
                          expanded={expanded === index}
                          onChange={() => handleChanges(index)}
                          key={index}
                        >
                          <AccordionSummary
                            aria-controls="panel1d-content"
                            id="panel1d-header"
                          >
                            {expanded === index ? (
                              <RemoveCircleOutlineIcon
                                sx={{
                                  fontSize: '2rem',
                                  color: 'transparent',
                                }}
                              />
                            ) : (
                              <ControlPointIcon
                                sx={{
                                  fontSize: '2rem',
                                  color: 'transparent',
                                }}
                              />
                            )}

                            <Typography
                              className="ms-4"
                              sx={{
                                fontSize:
                                  'clamp(16px, 10px + 1vw, 26px) !important',
                                color: '#fff !important',
                                fontWeight: '500',
                              }}
                            >
                              {item?.question}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography
                              sx={{
                                color: '#b5b5b5 !important',
                                paddingLeft:
                                  'clamp(65px, 10px + 3.2vw, 70px) !important',
                                fontSize:
                                  'clamp(14px, 4px + 1vw, 20px) !important',
                              }}
                            >
                              {item?.answer}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      )
                    })}
                </div>
              )}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <h2 className="fs-100 fw-medium">{t('Betting Rules')}</h2>
            <div className="px-lg-5 w-100 pt-md-5 pt-3">
              <ol className="marker-40 ps-0 mb-0">
                <li className="mt-lg-5  mb-md-4 mt-3">
                  {' '}
                  <div className="row gy-2">
                    <div className="col-md-4">
                      <p className="fw-semibold fs-40 text-white">
                        {' '}
                        Withdrawal
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        1.1. To participate in any betting activities, you must
                        be at least 18 years old. By placing a bet, you confirm
                        that you meet this age To participate in any betting
                        activities, you must be at least 18 years old. By
                        placing a bet, you confirm that you meet this age
                        requirement.{' '}
                      </p>
                      <ul className="ps-4 decimal-list">
                        <li style={{ listStyle: 'decimal' }}>
                          <p>
                            To participate in any betting activities, you must
                            be at least 18 years old. By placing a bet, you
                            confirm that you meet this age To participate in any
                            betting activities, you must be at least 18 years
                            old. By placing a bet, you confirm that you meet
                            this age requirement.
                          </p>{' '}
                        </li>
                        <li style={{ listStyle: 'decimal' }}>
                          <p>
                            {' '}
                            To participate in any betting activities, you must
                            be at least 18 years old. By placing a bet, you
                            confirm that you meet this age To participate in any
                            betting activities, you must be at least 18 years
                            old. By placing a bet, you confirm that you meet
                            this age requirement.
                          </p>{' '}
                        </li>
                        <li style={{ listStyle: 'decimal' }}>
                          <p>
                            {' '}
                            To participate in any betting activities, you must
                            be at least 18 years old. By placing a bet, you
                            confirm that you meet this age To participate in any
                            betting activities, you must be at least 18 years
                            old. By placing a bet, you confirm that you meet
                            this age requirement.
                          </p>{' '}
                        </li>
                      </ul>
                      <p>
                        1.2. To participate in any betting activities, you must
                        be at least 18 years old. By placing a bet, you confirm
                        that you meet this age To participate in any betting
                        activities, you must be at least 18 years old. By
                        placing a bet, you confirm that you meet this age
                        requirement.{' '}
                      </p>
                      <p>
                        1.3. To participate in any betting activities, you must
                        be at least 18 years old. By placing a bet, you confirm
                        that you meet this age To participate in any betting
                        activities, you must be at least 18 years old. By
                        placing a bet, you confirm that you meet this age
                        requirement.{' '}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mt-lg-5 mt-md-4 mt-3">
                  {' '}
                  <div className="row gy-2">
                    <div className="col-md-4">
                      <p className="fw-semibold fs-40 text-white"> Deposit </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        To participate in any betting activities, you must be at
                        least 18 years old. By placing a bet, you confirm that
                        you meet this age{' '}
                      </p>
                      <ul className="ps-2 list-unstyled">
                        <li>
                          <p>
                            2.1. participate in any betting activities, you must
                            be at least 18
                          </p>{' '}
                        </li>
                        <li>
                          <p>
                            2.2. participate in any betting activities, you must
                            be at least 18
                          </p>{' '}
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li className="mt-lg-5 mt-md-4 mt-3">
                  {' '}
                  <div className="row gy-2">
                    <div className="col-md-4">
                      <p className="fw-semibold fs-40 text-white">
                        Player Warranties{' '}
                      </p>
                    </div>
                    <div className="col-md-8">
                      <ul className="ps-2 list-unstyled">
                        <li>
                          <p>
                            3.1. To participate in any betting activities, you
                            must be at least 18 years old. By placing a bet, you
                            confirm that you meet this age{' '}
                          </p>{' '}
                        </li>
                        <li>
                          <p>
                            3.2. To participate in any betting activities, you
                            must be at least 18 years old. By placing a bet, you
                            confirm that you meet this age requirement. This
                            policy ensures compliance with legal gambling
                            standards and promotes responsible gaming practices.
                            Protecting minors from{' '}
                          </p>{' '}
                        </li>
                        <li>
                          <p>
                            3.3. To participate in any betting activities, you
                            must be at least 18 years old. By placing a bet, you
                            confirm that you meet this age requirement. This
                            policy ensures compliance with legal gambling
                            standards and promotes responsible gaming practices.
                            Protecting minors from{' '}
                          </p>{' '}
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li className="mt-lg-5 mt-md-4 mt-3">
                  {' '}
                  <div className="row gy-2">
                    <div className="col-md-4">
                      <p className="fw-semibold fs-40 text-white">
                        {' '}
                        Hipster ipsum{' '}
                      </p>
                    </div>
                    <div className="col-md-8">
                      <ul className="ps-2 list-unstyled">
                        <li>
                          <p>
                            4.1. To participate in any betting activities, you
                            must be at least 18 years old. By placing a bet, you
                            confirm that you meet this age{' '}
                          </p>{' '}
                        </li>
                        <li>
                          <p>
                            4.2. To participate in any betting activities, you
                            must be at least 18 years old. By placing a bet, you
                            confirm that you meet this age requirement. This
                            policy ensures compliance with legal gambling
                            standards and promotes responsible gaming practices.
                            Protecting minors from{' '}
                          </p>{' '}
                        </li>
                        <li>
                          <p>
                            4.3. To participate in any betting activities, you
                            must be at least 18 years old. By placing a bet, you
                            confirm that you meet this age requirement. This
                            policy ensures compliance with legal gambling
                            standards and promotes responsible gaming practices.
                            Protecting minors from{' '}
                          </p>{' '}
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li className="mt-lg-5  mb-md-4 mt-3">
                  {' '}
                  <div className="row gy-2">
                    <div className="col-md-4">
                      <p className="fw-semibold fs-40 text-white">
                        {' '}
                        Hipster ipsum tattooed brunch I&apos;m baby.
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p>
                        To participate in any betting activities, you must be at
                        least 18 years old. By placing a bet, you confirm that
                        you meet this age To participate in any betting
                        activities, you must be at least 18 years old. By
                        placing a bet, you confirm that you meet this age
                        requirement.{' '}
                      </p>
                      <ul className="ps-4 decimal-list">
                        <li style={{ listStyle: 'decimal' }}>
                          <p>
                            To participate in any betting activities, you must
                            be at least 18 years old. By placing a bet, you
                            confirm that you meet this age To participate in any
                            betting activities, you must be at least 18 years
                            old. By placing a bet, you confirm that you meet
                            this age requirement.
                          </p>{' '}
                        </li>
                        <li style={{ listStyle: 'decimal' }}>
                          <p>
                            {' '}
                            To participate in any betting activities, you must
                            be at least 18 years old. By placing a bet, you
                            confirm that you meet this age To participate in any
                            betting activities, you must be at least 18 years
                            old. By placing a bet, you confirm that you meet
                            this age requirement.
                          </p>{' '}
                        </li>
                        <li style={{ listStyle: 'decimal' }}>
                          <p>
                            {' '}
                            To participate in any betting activities, you must
                            be at least 18 years old. By placing a bet, you
                            confirm that you meet this age To participate in any
                            betting activities, you must be at least 18 years
                            old. By placing a bet, you confirm that you meet
                            this age requirement.
                          </p>{' '}
                        </li>
                      </ul>
                      <p>
                        To participate in any betting activities, you must be at
                        least 18 years old. By placing a bet, you confirm that
                        you meet this age To participate in any betting
                        activities, you must be at least 18 years old. By
                        placing a bet, you confirm that you meet this age
                        requirement.{' '}
                      </p>
                      <p>
                        To participate in any betting activities, you must be at
                        least 18 years old. By placing a bet, you confirm that
                        you meet this age To participate in any betting
                        activities, you must be at least 18 years old. By
                        placing a bet, you confirm that you meet this age
                        requirement.{' '}
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  )
}

export default PrivacyPolicy
