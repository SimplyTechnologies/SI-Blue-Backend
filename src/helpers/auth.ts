export const checkFirstName = firstName => {
  console.log(firstName);
  if (typeof firstName !== 'string') {
    throw Error('Firstname must be a string');
  }
  if (firstName.length < 3) {
    throw Error('Firstname length must be at least 3 characters');
  }
  return firstName;
};

export const checkLastName = lastName => {
  if (typeof lastName !== 'string') {
    throw Error('Lastname must be a string');
  }
  if (lastName.length < 3) {
    throw Error('Lastname length must be at least 3 characters');
  }
  return lastName;
};

export const checkPhoneNumber = phoneNumber => {
  if (typeof phoneNumber !== 'string') {
    throw Error('Phone number must be a string');
  }

  const trimmedNumber = phoneNumber.trim();

  if (trimmedNumber.length === 0) {
    throw Error('Phone number cannot be empty');
  }

  const phoneRegex = /^\+?\d{10,15}$/;
  if (!phoneRegex.test(trimmedNumber)) {
    throw Error('Please provide a valid phone number');
  }

  return trimmedNumber;
};

export const checkEmail = email => {
  if (typeof email !== 'string') {
    throw Error('Email must be a string');
  }
  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0) {
    throw Error('Email cannot be empty');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    throw Error('Please provide a valid email address');
  }

  return trimmedEmail;
};

export const checkPassword = password => {
  if (typeof password != 'string') {
    throw Error('Password must be a string');
  }
  if (password.length < 8) {
    throw Error('Password must be at least 8 characters');
  }
  if (!/[a-zA-Z]/.test(password)) {
    throw Error('Password must include at least one letter');
  }
  if (!/[0-9]/.test(password)) {
    throw Error('Password must include at least one digit');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    throw Error('Password must include at least one symbol');
  }

  return password;
};
