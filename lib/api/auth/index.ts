import { requestEtecsaApi } from '../../core/api';
import { AuthCredentials, AuthResponse } from './types';
import { detectUserFormat, validateUserFormat } from './utils';

/**
 * Autenticación de usuario en la tienda ETECSA
 */
export const authApi = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    if (
      !validateUserFormat(credentials.user, detectUserFormat(credentials.user))
    )
      throw new Error('Formato de usuario incorrecto');
      
    try {
      const response = await requestEtecsaApi<null, AuthCredentials>(
        '/autenticarse/autenticarse_api',
        {
          method: 'put',
          data: {
            operacion: 'autenticar',
            usuario: credentials.user,
            contrasenna: credentials.pass,
          },
        },
      );

      if (response.status === 200) {
        const cookies = response.headers['set-cookie'];
        const csrfToken = cookies?.find((c) => c.startsWith('csrftoken='))!;
        const sessionId = cookies?.find((c) => c.startsWith('sessionid='))!;

        return {
          success: true,
          cookies: {
            csrfToken,
            sessionId,
          },
        };
      }

      if (response.status === 203) {
        return {
          success: false,
          error: 'invalid_credentials',
          message: 'Usuario o contraseña incorrectos',
        };
      }

      if (response.status === 226) {
        return {
          success: false,
          error: 'too_many_attempts',
          message:
            'Ha superado el límite de 3 intentos fallidos. Por favor verifique sus datos e inténtelo nuevamente en 30 minutos.',
        };
      }

      return {
        success: false,
        error: 'server_error',
        message: 'Ocurrió un error durante la autenticación',
      };
    } catch (error) {
      console.error('Auth error:', error);
      return {
        success: false,
        error: 'server_error',
        message: 'Ocurrió un error al conectar con el servidor',
      };
    }
  },
};
