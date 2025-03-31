import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
} from '@mui/material'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Logo from '../../public/assets/images/logo.png'
import Image from 'next/image'
import LoginForm from '@/component/Login'
import { AffiliateModal } from '@/component/Affiliate'
import { logError } from '@/utils'
import { PostMethod } from '@/services/fetchAPI'
import { useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const Footer = ({ active }: any) => {
  const [expanded, setExpanded] = useState('')
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const handleCloseLoginModal = () => setOpenLoginModal(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [footer, setFooter] = useState<any>()
  const base_url = process.env.NEXT_PUBLIC_IMAGE_URL
  const user = useAppSelector((state) => state.user.user)
  const { t } = useTranslation()
  const router = useRouter()

  const handleChange = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false)
  }

  useEffect(() => {
    const params = {
      type: 'footer',
    }

    PostMethod('cmsPage', params)
      .then((res: any) => {
        if (res.data.status !== 'success') {
          throw new Error('footer cms api not working')
        }
        setFooter(res?.data?.result[0])
      })
      .catch((err: any) => {
        logError(err)
      })
  }, [])

  return (
    <>
      <footer
        className={`${active ? 'sideBarOpen' : ''}`}
        style={router.pathname === '/sport-bet' ? { marginTop: '0px' } : {}}
      >
        <div className="container">
          <div className="foo-linkSocial">
            <div className="fooLink-desktop">
              <div style={{ borderRight: '1px solid #4d4d4d' }}>
                <div className="fooSocial">
                  <div className="w-25">
                    <Link href="/">
                      <Image
                        src={`${base_url}/${footer?.image}` || Logo}
                        width={247}
                        height={138}
                        alt={t('Picture of the author')}
                        style={{ marginBottom: '10px' }}
                      />
                    </Link>
                  </div>
                  <div className="w-75">
                    <p
                      className="fooText"
                      dangerouslySetInnerHTML={{ __html: footer?.description }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="footer_links w-100"
                style={{ borderRight: '1px solid #4d4d4d' }}
              >
                <div className="fooLink-col">
                  <div className="linkTitle">CASINO BET</div>
                  <ul>
                    <li>
                      <Link href="/promotion-center">{t('Promotions')}</Link>
                    </li>
                    <li>
                      <Link href="/ranking-vip#cashBack">{t('Cashback')}</Link>
                    </li>
                    <li>
                      <Link href="/referral">{t('Referral')}</Link>
                    </li>
                    <li>
                      <Link href="">{t('Responsible Gambling')}</Link>
                    </li>
                    <li>
                      <Link href="/contact-us">{t('Contact Us')}</Link>
                    </li>
                  </ul>
                  <div className="linkTitle">{t('Legal')}</div>
                  <ul>
                    <li>
                      <Link href="/privacy-policy?tab=1">
                        {t('Privacy Policy')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy-policy?tab=0">
                        {t('Terms & Conditions')}
                      </Link>{' '}
                    </li>
                    <li>
                      <Link href="/privacy-policy?tab=3">
                        {t('Betting Rules')}
                      </Link>{' '}
                    </li>
                    {user ? (
                      <li>
                        <AffiliateModal fullTitle={true} footer={true} />
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>

              <div className="social_icons_wrapper">
                <div className="social_icons_contain_wrapper">
                  <div className="social_icons_contain">
                    <h6 className="social_icons_title">{t('Social Media')}</h6>
                    <div className="social_icons_media">
                      <Link href="/">
                        <Image
                          src={'/assets/images/facebook-icon.png'}
                          alt={t('Facebook')}
                          width={32}
                          height={32}
                        />
                      </Link>
                      <Link href="/">
                        <Image
                          src={'/assets/images/instagram-icon.png'}
                          width={32}
                          height={32}
                          alt={t('Instagram')}
                        />
                      </Link>
                    </div>
                  </div>

                  <div className="social_icons_contain">
                    <h6 className="social_icons_title">
                      {t('Payment Gateway')}
                    </h6>
                    <div className="social_icons_media">
                      <Link href="/">
                        <Image
                          src={'/assets/images/payment_gateway-icon.png'}
                          width={32}
                          height={32}
                          alt={t('payment Gateway')}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* mobile accordian */}
          <div className=" d-block d-md-none">
            <div className="fooLink-mobile">
              <Accordion
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div className="title">CASINO BET</div>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    <li>
                      <Link href="/promotion-center">{t('Promotions')}</Link>
                    </li>
                    <li>
                      <Link href="/ranking-vip#cashBack">{t('Cashback')}</Link>
                    </li>
                    <li>
                      <Link href="/referral">{t('Referral')}</Link>
                    </li>
                    <li>
                      <Link href="">{t('Responsible Gambling')}</Link>
                    </li>
                    <li>
                      <Link href="/contact-us">{t('Contact Us')}</Link>
                    </li>{' '}
                  </ul>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === 'panel5'}
                onChange={handleChange('panel5')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel5-content"
                  id="panel5-header"
                >
                  <div className="title">{t('Legal')}</div>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    <li>
                      <Link href="/privacy-policy?tab=1">
                        {' '}
                        {t('Privacy Policy')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy-policy?tab=0">
                        {t('Terms and Conditions')}
                      </Link>{' '}
                    </li>
                    <li>
                      <Link href="/privacy-policy?tab=3">
                        {t('Betting Rules')}
                      </Link>{' '}
                    </li>
                    {user ? (
                      <li>
                        <AffiliateModal fullTitle={true} footer={true} />
                      </li>
                    ) : null}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>

          {/* mobile social section */}
          <div className=" d-block d-md-none">
            <div className="social_icons_wrapper_mobile">
              <div className="social_icons_contain">
                <h6 className="social_icons_title">{t('Social Media')}</h6>
                <div className="social_icons_media">
                  <Link href="/">
                    <Image
                      src={'/assets/images/facebook-icon.png'}
                      alt={t('Facebook')}
                      width={32}
                      height={32}
                    />
                  </Link>
                  <Link href="/">
                    <Image
                      src={'/assets/images/instagram-icon.png'}
                      width={32}
                      height={32}
                      alt={t('Instagram')}
                    />
                  </Link>
                </div>
              </div>
              <div className="social_icons_contain">
                <h6 className="social_icons_title">{t('Payment Gateway')}</h6>
                <div className="social_icons_media">
                  <Link href="/">
                    <Image
                      src={'/assets/images/payment_gateway-icon.png'}
                      width={32}
                      height={32}
                      alt={t('payment Gateway')}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* mobile logo */}
          <div className=" d-block d-md-none">
            <div className="fooSocial social">
              <Link href="/">
                <Image
                  src={`${base_url}/${footer?.image}` || Logo}
                  width={147}
                  height={98}
                  alt={t('Picture of the author')}
                  style={{ marginBottom: '10px' }}
                />
              </Link>

              <p
                className="fooText"
                dangerouslySetInnerHTML={{ __html: footer?.description }}
              />
            </div>
          </div>
          <div className="copyRight">
            {t('Copyright')} © {new Date().getFullYear()} CASINO BET{' '}
            {t('All rights reserved')}.
          </div>
        </div>
      </footer>

      <Dialog
        className="signUpModaluniversal"
        open={openLoginModal}
        onClose={handleCloseLoginModal}
        scroll="body"
      >
        <LoginForm
          handleCloseLoginModal={handleCloseLoginModal}
          setOpenLoginModal={setOpenLoginModal}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
        />
      </Dialog>
    </>
  )
}

export default Footer
