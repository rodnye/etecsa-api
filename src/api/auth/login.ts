import { requestEtecsaApi, EtecsaApiError } from '../../core/api';
import { ETECSA } from '../../core/methods';
import { AuthCredentials, LoginSuccessData } from './types';
import { detectUserFormat, validateUserFormat } from './utils';

/**
 * Iniciar sesión con credenciales de ETECSA
 */
export const login = async (
  credentials: AuthCredentials,
): Promise<LoginSuccessData> => {
  if (
    !validateUserFormat(credentials.user, detectUserFormat(credentials.user))
  ) {
    throw new EtecsaApiError('Formato de usuario incorrecto', 400, {
      code: 'invalid_format',
    });
  }

  try {
    await requestEtecsaApi<null>('/autenticarse/autenticarse_api', {
      method: 'put',
      data: {
        operacion: 'autenticar',
        usuario: credentials.user,
        contrasenna: credentials.pass,
      },
    });

    const cookies = ETECSA.cookiesJar.getCookiesSync(ETECSA.href);
    const csrfToken = cookies.find((c) => c.key === 'csrftoken');
    const sessionId = cookies.find((c) => c.key === 'sessionid');

    if (!csrfToken || !sessionId) {
      throw new EtecsaApiError(
        'No se pudieron obtener las cookies de sesión',
        500,
        { code: 'session_cookies_missing' },
      );
    }

    return { cookies: { csrfToken, sessionId } };
  } catch (err) {
    if (err instanceof EtecsaApiError) {
      if (err.status === 203) {
        throw new EtecsaApiError('Usuario o contraseña incorrectos', 203, {
          code: 'invalid_credentials',
        });
      }
      if (err.status === 226) {
        throw new EtecsaApiError(
          'Ha superado el límite de 3 intentos fallidos. Por favor verifique sus datos e inténtelo nuevamente en 30 minutos.',
          226,
          { code: 'too_many_attempts' },
        );
      }
    }
    throw err;
  }
};

/**
 * Verificar si un usuario existe en el sistema ETECSA.
 */
export const checkUserExistsAuthApi = async (
  user: string,
): Promise<{ exists: false } | { exists: true; attemptsExceeded: true }> => {
  const userFormat = detectUserFormat(user);
  if (!validateUserFormat(user, userFormat)) {
    throw new EtecsaApiError('Formato de usuario incorrecto', 400, {
      code: 'invalid_format',
    });
  }

  try {
    const data = await requestEtecsaApi<{ existe: boolean }>(
      '/autenticarse/autenticarse_api',
      {
        method: 'post',
        data: {
          operacion: 'verificar_usuario',
          tipo_usuario: userFormat === 'phone' ? 'celular' : 'correo',
          usuario: user,
        },
      },
    );

    if (data.existe) {
      throw new EtecsaApiError(
        userFormat === 'phone'
          ? 'Ha superado el número de intentos para un día con ese número móvil'
          : 'Ha superado el número de intentos para un día con ese correo electrónico',
        200,
        { code: 'too_many_attempts', exists: true },
      );
    }

    return { exists: false };
  } catch (err) {
    if (err instanceof EtecsaApiError && err.status === 204) {
      throw new EtecsaApiError(
        userFormat === 'phone'
          ? 'El teléfono móvil no está registrado en el sistema'
          : 'El correo electrónico no está registrado en el sistema',
        204,
        { code: 'user_not_found' },
      );
    }
    throw err;
  }
};
