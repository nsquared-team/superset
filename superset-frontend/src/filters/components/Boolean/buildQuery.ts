import { buildQueryContext } from '@superset-ui/core';
import { PluginFilterBooleanQueryFormData } from './types';

export default function buildQuery(
  formData: PluginFilterBooleanQueryFormData,
) {
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      metrics: [],
      orderby: [],
    },
  ]);
}

