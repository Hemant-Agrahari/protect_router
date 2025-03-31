import Image from 'next/image'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { PostMethod } from '@/services/fetchAPI'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}
function ContactUs() {
  const { t } = useTranslation()
  const validationSchema = yup.object({
    name: yup.string().required(t('Please enter your name.')),
    email: yup
      .string()
      .required(t('Please enter your email address.'))
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        t('Please enter a valid email address (e.g., name@example.com).'),
      ),
    mobileNumber: yup
      .number()
      .typeError(t('Please enter a valid phone number.'))
      .positive(t('A phone number cannot start with a negative sign.'))
      .integer(t('A phone number cannot contain decimals.'))
      .required(t('Please enter your phone number.')),
    subject: yup.string().required(t('Please select a subject.')),
    message: yup
      .string()
      .min(3, 'Message should have at least 3 characters')
      .max(400, 'Message should not exceed 250 characters')
      .required('Message is required'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobileNumber: '',
      subject: '',
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res: any = await PostMethod('sendMessage', values)
        if (res.status !== 200) {
          throw new Error(res?.data?.message)
        }
        toast.success(res?.data?.message)
        formik.resetForm()
      } catch (error: any) {
        toast.error(error?.message)
      }
    },
  })

  return (
    <>
      <div className="contact-us-banner">
        <div className="container">
          <h1> {t('Contact Us')}</h1>
        </div>
      </div>
      <div className="contact-us mb-3 mb-md-4 mb-lg-5 py-50">
        <section className="contact-form py-50">
          <div className="container-xl">
            <div className="form-container">
              <h2 className="text-center mb-3 mb-md-4 fs-6xl fw-bold text-white mt-0">
                {t('Send Us a Message')}
              </h2>
              <form onSubmit={formik.handleSubmit}>
                <div className="row g-2 g-md-3">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      placeholder={`${t('Name')} *`}
                      {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-danger mt-2 mx-2 fw-bold ">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control email_contact_input"
                      id="email"
                      placeholder={`${t('Email Id')} *`}
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-danger mt-2 mx-2 fw-bold ">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      className="form-control"
                      id="mobile"
                      placeholder={`${t('Mobile Number')} *`}
                      {...formik.getFieldProps('mobileNumber')}
                    />
                    {formik.touched.mobileNumber &&
                    formik.errors.mobileNumber ? (
                      <div className="text-danger mt-2 mx-2 fw-bold ">
                        {formik.errors.mobileNumber}
                      </div>
                    ) : null}
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      id="subject"
                      {...formik.getFieldProps('subject')}
                    >
                      <option value="">{t('Select Subject')}</option>
                      <option value="Login issues">{t('Login issues')}</option>
                      <option value="Recover lost account">
                        {t('Recover lost account')}
                      </option>
                      <option value="Age issues">{t('Age issues')}</option>
                      <option value="Other">{t('Other')}</option>
                    </select>
                    {formik.touched.subject && formik.errors.subject ? (
                      <div className="text-danger mt-2 mx-2 fw-bold ">
                        {formik.errors.subject}
                      </div>
                    ) : null}
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      id="message"
                      rows={4}
                      placeholder={t('What do you want to tell us?')}
                      {...formik.getFieldProps('message')}
                    />
                    {formik.touched.message && formik.errors.message ? (
                      <div className="text-danger mt-2 mx-2 fw-bold ">
                        {formik.errors.message}
                      </div>
                    ) : null}
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btns btn_secondary w-100 mt-2 mt-md-3"
                    >
                      {t('Send Your Message')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
        <section className="contact-address pt-0">
          <div className="container-xl">
            <div className="row gx-md-4 gy-lg-0 gy-4">
              <div className="col-lg-4">
                <div className="contact-card">
                  <div className="contact-icon">
                    <Image
                      src="/assets/images/call-Icon.png"
                      alt={t('Phone Icon')}
                      width={44}
                      height={44}
                      className=""
                    />
                  </div>
                  <div className="contact-info">
                    <h5 className="fs-4xl text-white fw-bolder mb-2">
                      {t('Get In Touch')}
                    </h5>
                    <p className="fs-2xl mb-0 text-white ">
                      <a href="tel:+8745200000">+91 87452 00000</a>
                    </p>
                    <p className="fs-2xl mb-0 text-white ">
                      <a href="tel:+18004125230">+1800 4125 230</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="contact-card">
                  <div className="contact-icon">
                    <Image
                      src="/assets/images/mail-icon.png"
                      alt={t('Phone Icon')}
                      width={44}
                      height={44}
                      className=""
                    />
                  </div>
                  <div className="contact-info">
                    <h5 className="fs-4xl text-white fw-bolder mb-2">
                      {t('Email Address')}
                    </h5>
                    <p className="fs-2xl mb-0 text-white ">
                      <a href="mailto:betworld@gmail.com">betworld@gmail.com</a>
                    </p>
                    <p className="fs-2xl mb-0 text-white ">
                      <a href="mailto:supportbet@gmail.com">
                        supportbet@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="contact-card">
                  <div className="contact-icon">
                    <Image
                      src="/assets/images/location-icon.png"
                      alt={t('Phone Icon')}
                      width={44}
                      height={44}
                      className=""
                    />
                  </div>
                  <div className="contact-info">
                    <h5 className="fs-4xl text-white fw-bolder mb-2">
                      {t('Address')}
                    </h5>
                    <p className="fs-2xl mb-0 text-white ">
                      23, Hal Old Airport Rd, Bengaluru, Karnataka 560008, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
export default dynamic(() => Promise.resolve(ContactUs), {
  ssr: false,
})
