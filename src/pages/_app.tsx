import Layout from '@/layout/Layout'
import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { Toaster } from '@/component/common'
import { SessionProvider } from 'next-auth/react'
import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // import locale
import { Kanit } from 'next/font/google'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

const kanit = Kanit({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
function App({ Component, pageProps }: AppProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registration successful with scope:',
            registration.scope,
          )
        })
        .catch((error) => {
          console.log('Service Worker registration failed: ', error)
        })
    }
  }, [])

  useEffect(() => {
    if (searchQuery !== '') handleSearch('')
  }, [router.pathname, router.query])

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        {/* Other meta tags or links */}
      </Head>
      <style jsx global>{`
        html {
          font-family: ${kanit.style.fontFamily};
        }
      `}</style>
      {/* // APP // */}
      <Provider store={store}>
        <SessionProvider session={pageProps.session}>
          <Layout handleSearch={handleSearch} searchQuery={searchQuery}>
            <Component
              {...pageProps}
              searchQuery={searchQuery}
              handleSearch={handleSearch}
            />
          </Layout>
        </SessionProvider>
        <Toaster />
      </Provider>
    </>
  )
}

export default appWithTranslation(App)
