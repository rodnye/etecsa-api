import { requestEtecsaApi } from '../../core/api';
import type {
  LoadHomePageData,
  LoadPackages,
  LoadPlans,
  LoadBags,
  LoadBag,
  LoadSpecialPlans,
  LoadAdditionalPlans,
  LoadOffersAndPromotions,
  LoadFrequentQuestions,
} from './types';

export interface PageDataRequest {
  operation: string;
  securityValidationUrl?: string;
}

const postPageData = async <R = unknown>(data: PageDataRequest): Promise<R> => {
  return requestEtecsaApi<R>('/tienda_admin/datos_pagina_api', {
    method: 'post',
    data: {
      operacion: data.operation,
    },
  });
};

export const pageApi = {
  home: (): Promise<LoadHomePageData> =>
    postPageData<LoadHomePageData>({
      operation: 'cargar_datos_pagina_principal',
    }),

  packages: (): Promise<LoadPackages> =>
    postPageData<LoadPackages>({ operation: 'cargar_paquetes' }),

  bags: (): Promise<LoadBags> =>
    postPageData<LoadBags>({ operation: 'cargar_bolsas' }),

  bag: (): Promise<LoadBag> =>
    postPageData<LoadBag>({ operation: 'cargar_bolsa' }),

  plans: (): Promise<LoadPlans> =>
    postPageData<LoadPlans>({ operation: 'cargar_planes' }),

  specialPlans: (): Promise<LoadSpecialPlans> =>
    postPageData<LoadSpecialPlans>({ operation: 'cargar_planes_especial' }),

  additionalPlans: (): Promise<LoadAdditionalPlans> =>
    postPageData<LoadAdditionalPlans>({ operation: 'cargar_planes_adicional' }),

  offers: (): Promise<LoadOffersAndPromotions> =>
    postPageData<LoadOffersAndPromotions>({
      operation: 'cargar_ofertas_promociones',
    }),

  faq: (): Promise<LoadFrequentQuestions> =>
    postPageData<LoadFrequentQuestions>({
      operation: 'cargar_preguntas_frecuentes',
    }),
};
