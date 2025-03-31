import React from 'react';
import { AccordionDetails as MuiAccordionDetails, AccordionDetailsProps } from '@mui/material';

/**
 * This CustomMuiAccordionDetails reusable component  AccordionDetails is a component used to hold the content that is revealed when an accordion is expanded.
 * */

const CustomMuiAccordionDetails = (props: AccordionDetailsProps) => (
  <MuiAccordionDetails className="custom-accordion-details" {...props} />
);

export default CustomMuiAccordionDetails;
