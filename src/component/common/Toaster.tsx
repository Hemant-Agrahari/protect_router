import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './toaster.module.css';

/**
 * Toaster is a wrapper around the `react-toastify` library to display customizable toast notifications.
 * It is configured to show toast messages at the top-center of the screen with a short auto-close duration,
 * and offers various options like disabling the progress bar, pausing on hover or focus loss, and customizing the toast appearance.
 * 
 * The component uses custom styling via `toastClassName` to apply a custom CSS class to each toast notification.
 */

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
);

export default Toaster;
