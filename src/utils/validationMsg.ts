// write validation field wise and alfabetical order
const amount = {
  require: 'Please enter an amount.',
  integer: 'Amount must be integer.',
  positive: 'Amount must be positive.',
};

const currency = {
  require: 'Please select a currency.',
};

const email = {
  invalidEmail: 'Please enter a valid email address (e.g., name@example.com).',
  require: 'Please enter your email address.',
};

const message = {
  max: 'Message should not exceed 250 characters.',
  min: 'Message should have at least 3 characters.',
  require: 'Message is required.',
};

const mobile = {
  integer: 'A phone number cannot contain decimals.',
  positive: 'A phone number cannot start with a negative sign.',
  require: 'Please enter your phone number.',
  typeError: 'Please enter a valid phone number.',
};

const name = {
  require: 'Please enter your name.',
};

const username = {
  require: 'Please enter your username.',
  min: 'Username should have at least 3 characters',
};

const packages = {
  require: 'Please select a package.',
};

const password = {
  match:
    'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  max: 'Password is too long - should not more than 20 chars.',
  min: 'Password is too short - should be 6 chars minimum.',
  require: 'Please enter a password.',
};

const subject = {
  require: 'Please select a subject.',
};

const termsConditions = {
  require: 'You need to accept the terms and conditions.',
};

const wallet = {
  min: 'Wallet address must be at least 12 characters long.',
  max: 'Wallet address cannot be longer than 60 characters.',
  require: 'Please enter wallet address.',
};

export const validationMsg = {
  amount,
  currency,
  email,
  mobile,
  message,
  name,
  packages,
  password,
  subject,
  termsConditions,
  wallet,
  username,
};
