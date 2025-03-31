import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './toaster.module.css'

const Toaster = () => (
  <ToastContainer
    position="top-center"
    autoClose={500}
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    toastClassName={styles.customToast}
  />
)

export default Toaster
