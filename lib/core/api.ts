import { AxiosResponse } from 'axios';
import { ETECSA } from './methods';

export const requestEtecsaApi = <T = unknown, D = unknown>(
  relative: string,
  config: { method?: string; data?: object },
): Promise<AxiosResponse<T, D>> => {
  return ETECSA.axios({
    url: ETECSA.href + relative,
    method: config.method || 'get',
    data: config.data && ETECSA.encryptPayload(config.data),
  });
};
