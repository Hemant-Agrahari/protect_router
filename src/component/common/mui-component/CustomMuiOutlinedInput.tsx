import { OutlinedInput, OutlinedInputProps } from '@mui/material';

/**
 * This CustomMuiOutlinedInput  is a reusable  component around the Material-UI `OutlinedInput` component.
 * It allows you to customize the input by automatically adding a custom class to the `OutlinedInput`
 * while still supporting all the standard props from the original `OutlinedInput`.
 */


const CustomMuiOutlinedInput: React.FC<OutlinedInputProps> = (props) => {
  const { className, ...otherProps } = props;

  return (
    <OutlinedInput
      {...otherProps}
      className={`custom-outlined-input ${className}`}
    />
  );
};

export default CustomMuiOutlinedInput;
