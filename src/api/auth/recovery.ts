import { requestEtecsaApi, EtecsaApiError } from '../../core/api';
import { detectUserFormat, validateUserFormat } from './utils';

/**
 * Generar y enviar código de verificación al usuario.
 */
export const sendCode = async (user: string): Promise<{ message: string }> => {
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
          operacion: 'generar_codigo',
          tipo_usuario: userFormat === 'phone' ? 'celular' : 'correo',
          usuario: user,
        },
      },
    );

    if (data.existe) {
      throw new EtecsaApiError('Ha superado la cantidad de intentos (3)', 200, {
        code: 'too_many_attempts',
      });
    }

    const message =
      userFormat === 'phone'
        ? 'Se ha reenviado un código de activación a su número móvil'
        : 'Se ha reenviado un código de activación a su correo electrónico';

    return { message };
  } catch (err) {
    // Si ya es un error que lanzamos (too_many_attempts) o uno de la API, lo relanzamos
    throw err;
  }
};

/**
 * Verificar código de validación enviado al usuario.
 */
export const verifyCode = async (
  user: string,
  code: string,
): Promise<{ message: string }> => {
  try {
    const data = await requestEtecsaApi<boolean>(
      '/autenticarse/autenticarse_api',
      {
        method: 'post',
        data: {
          operacion: 'verificar_codigo',
          usuario: user,
          codigo: code,
        },
      },
    );

    if (data) {
      return { message: 'Código verificado correctamente' };
    }

    throw new EtecsaApiError('Ha superado la cantidad de intentos (3)', 200, {
      code: 'too_many_attempts',
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Recuperar/restablecer contraseña.
 */
export const resetPassword = async (
  user: string,
  newPassword: string,
): Promise<{ message: string }> => {
  try {
    await requestEtecsaApi<null>('/autenticarse/autenticarse_api', {
      method: 'put',
      data: {
        operacion: 'recuperar_contrasenna',
        usuario: user,
        contrasenna: newPassword,
      },
    });

    return { message: 'Ha cambiado tu contraseña correctamente' };
  } catch (err) {
    throw err;
  }
};
