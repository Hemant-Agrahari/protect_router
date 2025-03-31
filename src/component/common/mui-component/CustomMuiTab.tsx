import React from 'react';
import { Tabs, Tab } from '@mui/material';

/**
 * `CustomMuiTab` is a customizable wrapper around Material-UI's `Tabs` and `Tab`.
 * It renders a set of tabs with labels and allows switching between sections/views.
 * Supports both a single class name or an array of class names for tab styling.
 *
 */

interface CustomMuiTabProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  tabLabels: string[];
  disableRipple?: boolean;
  tabClassName: string | string[];
  tabsClassName: string;
}

const CustomMuiTab: React.FC<CustomMuiTabProps> = ({
  value,
  onChange,
  tabLabels,
  disableRipple = true,
  tabClassName,
  tabsClassName = '',
}) => {
  const classNames = Array.isArray(tabClassName) ? tabClassName : [tabClassName];
  return (
    <Tabs
      value={value}
      onChange={onChange}
      className={tabsClassName}
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabLabels.map((label, index) => (
        <Tab
          key={index}
          label={label}
          disableRipple={disableRipple}
          className={classNames[index]}
        />
      ))}
    </Tabs>
  );
};

export default CustomMuiTab;
