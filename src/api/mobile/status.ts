import { EtecsaApiError } from '../../core/api';
import { GetServiceStatusRequest, GetServiceStatusResponse } from './types';
import { mobileServicesRequest } from './utils';

/**
 * Obtener estado del servicio móvil.
 */
export const getMobileServiceStatus = (
  request: GetServiceStatusRequest,
): Promise<GetServiceStatusResponse> =>
  mobileServicesRequest<GetServiceStatusResponse>({
    operation: 'get_estado_servicio',
    data: {
      servicio: request.service,
      carnet: request.ci,
      tipo_ci: request.typeci,
      enviar_sms: request.sendSms,
    },
  });
