import { UserFormat } from './types';

export const PHONE_PATTERN = /^\+53 \d{8}$/;
export const NAUTA_PATTERN =
  /^[A-Za-z0-9ñÑ.~¿?!#/$%^&*()_+=|¡-]{2,50}@nauta\.cu$/;

/**
 * Valida el formato del usuario según el tipo
 */
export const validateUserFormat = (user: string, type: UserFormat): boolean => {
  if (type === 'email') return NAUTA_PATTERN.test(user);
  else return PHONE_PATTERN.test(user);
};

/**
 * Detecta el tipo de usuario basado en el formato
 */
export const detectUserFormat = (user: string): UserFormat => {
  return PHONE_PATTERN.test(user) ? 'phone' : 'email';
};
