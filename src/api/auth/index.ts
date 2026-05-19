import { profileApi } from '../profile';
import { checkUserExistsAuthApi, loginAuthApi } from './_login';
import {
  generateCodeAuthApi,
  resetPasswordAuthApi,
  verifyCodeAuthApi,
} from './_recovery';

/**
 * Autenticación de usuario en la tienda ETECSA
 */
export const authApi = {
  login: loginAuthApi,
  logout: profileApi.logout,
  checkUser: checkUserExistsAuthApi,
  resetPassword: resetPasswordAuthApi,
  verifyCode: verifyCodeAuthApi,
  generateCode: generateCodeAuthApi,
};
