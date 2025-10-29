import { buildQueryContext } from '@superset-ui/core';
import { DEFAULT_FORM_DATA, PluginFilterCheckboxQueryFormData } from './types';

export default function buildQuery(
  formData: PluginFilterCheckboxQueryFormData,
) {
  const { sortAscending, sortMetric } = { ...DEFAULT_FORM_DATA, ...formData };
  return buildQueryContext(formData, baseQueryObject => {
    const { columns = [] } = baseQueryObject;

    return [
      {
        ...baseQueryObject,
        metrics: sortMetric ? [sortMetric] : [],
        orderby:
          sortMetric || sortAscending !== undefined
            ? (sortMetric ? [sortMetric] : columns).map(column => [
                column,
                !!sortAscending,
              ])
            : [],
      },
    ];
  });
}
