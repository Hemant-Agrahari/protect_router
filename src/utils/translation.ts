import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function commonStaticProps(locale: string) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
