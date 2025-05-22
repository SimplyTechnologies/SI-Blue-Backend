import Joi from 'joi';

export const checkYear = (year: number) => {
  const yearSchema = Joi.number().integer().min(1990).max(new Date().getFullYear());
  return yearSchema.validate(year);
};

export const validateVin = (vin: string) => {};

