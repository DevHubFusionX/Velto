export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-()]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateAmount = (amount, min = 0) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= min;
};
