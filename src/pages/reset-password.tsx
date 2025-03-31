import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ResetPasswordPopup from '@/component/ResetPassword';
import { Dialog } from '@mui/material';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const { query } = router;

  useEffect(() => {
    if (query.token) {
      setOpenModal(true);
    }
  }, [query.token]);

  const handleCloseResetPassword = () => {
    setOpenModal(false);
    router.push('/');
  };

  const setOpenResetPasswordModal = (value: boolean) => {
    setOpenModal(value);
  };

  return (
    <div>
      <Dialog
        className="signUpModaluniversal"
        open={openModal}
        onClose={setOpenModal}
        scroll="body"
      >
        <ResetPasswordPopup
          handleCloseResetPassword={handleCloseResetPassword}
          setOpenResetPasswordModal={setOpenResetPasswordModal}
        />
      </Dialog>
    </div>
  );
};

export default ResetPasswordPage;
