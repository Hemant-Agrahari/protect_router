import React from 'react';
import DatePicker from 'react-datepicker';

/**
 * CustomDatePicker is a reusable component built on top of the `react-datepicker` library.
 It allows the user to select a range of dates with a start and end date.
 */

interface CustomDatePickerProps {
  selected: Date;
  onChange: (range: [Date, Date]) => void
  startDate: Date;
  endDate: Date;
  maxDate: Date;
  placeholderText:string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  startDate,
  endDate,
  maxDate,
  placeholderText
}) => {

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange={true}
      maxDate={maxDate}
      placeholderText={placeholderText}
    />
  )
}

export default CustomDatePicker;
