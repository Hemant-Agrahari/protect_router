import React from 'react';
import { AccordionSummary, AccordionSummaryProps } from '@mui/material';

/**
 * This CustomMuiAccordionSummary reusable component serves as the header or title section of an accordion panel. 
 * It allows users to expand or collapse the content by clicking on it, providing 
 * an interactive and organized layout for displaying related content sections.
 * */

const CustomMuiAccordionSummary = (props: AccordionSummaryProps) => (
  <AccordionSummary {...props} className="custom-accordion-summary" />
);

export default CustomMuiAccordionSummary;
