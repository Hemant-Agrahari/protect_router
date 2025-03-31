import React from 'react';

/**
 * FormErrorMessage is a simple component that displays an error message when a form field has been touched
 * and contains an error. It helps in providing real-time validation feedback to users on form inputs.
 * 
 * This component checks whether the form field has been touched and whether an error message exists,
 * and only renders the error message if both conditions are met.
 * */

interface FormErrorMessageProps {
  error: string | undefined; 
  touched: boolean | undefined;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ error, touched }) => {
  if (!touched || !error) return null;
  return <div className="form-error-message text-color-danger font-weight-800 mt-3">{error}</div>;
}
 
export default FormErrorMessage;
