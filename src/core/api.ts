import { AxiosError, AxiosResponse } from 'axios';
import { ETECSA, ensureInit } from './methods';

export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number; details?: unknown };

export const requestEtecsaApi = async <T = unknown>(
  relative: string,
  config: { method?: string; data?: object } = {},
): Promise<ApiResult<T>> => {
  try {
    await ensureInit();

    const response: AxiosResponse<T> = await ETECSA.axios({
      url: ETECSA.href + relative,
      method: config.method || 'get',
      data: config.data && ETECSA.encryptPayload(config.data),
    });

    return {
      ok: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status ?? 500;
    let errorMessage = 'Ocurrió un error al conectar con el servidor';

    if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
      const data = axiosError.response.data as Record<string, unknown>;
      if (typeof data.mensaje === 'string') errorMessage = data.mensaje;
      else if (typeof data.error === 'string') errorMessage = data.error;
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
    }

    return {
      ok: false,
      error: errorMessage,
      status,
      details: axiosError.response?.data,
    };
  }
};