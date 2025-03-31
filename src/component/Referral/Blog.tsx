import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const Blog = () => {
  const { t } = useTranslation()
  return (
    <div className="referal-bloger">
      <div className="referalBloger-img">
        <Image src="/assets/images/referal-bloger.png" alt="referal bloger" width={390} height={191} />
      </div>
      <div className="referalBloger-contet">
        <p>
          {t(
            'Are you a blogger with a large audience and many followers? We offer you a partnership program with a special referral bonus. Contact our manager to discuss the terms.',
          )}
        </p>
        <p>
          <Link href="https://wa.me/message/3E5IOHH5J2BCL1" target="_blank">
            https://wa.me/message/3E5IOHH5J2BCL1
          </Link>
        </p>
        <p>
          {t(
            'Important: Only users who have passed the requirements and have been approved by their manager can participate in the program.',
          )}
        </p>
      </div>
    </div>
  )
}

export default Blog
