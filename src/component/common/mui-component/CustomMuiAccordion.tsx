import React from 'react';
import { Accordion as MuiAccordion, AccordionProps } from '@mui/material';

/**
 * This `CustomMuiAccordion` is a reusable wrapper around Material-UI's `Accordion` that allows you to display and hide sections of related content on a page.
 * */

const CustomMuiAccordion = (props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square className="custom-accordion" {...props} />
);

export default CustomMuiAccordion;
