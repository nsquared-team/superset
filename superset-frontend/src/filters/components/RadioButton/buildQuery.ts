import { buildQueryContext } from '@superset-ui/core';
import { DEFAULT_FORM_DATA, PluginFilterCheckboxQueryFormData } from './types';

export default function buildQuery(
  formData: PluginFilterCheckboxQueryFormData,
) {
  const { sortAscending, sortMetric } = { ...DEFAULT_FORM_DATA, ...formData };
  
  return buildQueryContext(formData, baseQueryObject => {
    const { columns = [] } = baseQueryObject;
    const hasOrdering = sortMetric || sortAscending !== undefined;
    const orderByColumns = sortMetric ? [sortMetric] : columns;

    return [
      {
        ...baseQueryObject,
        metrics: sortMetric ? [sortMetric] : [],
        orderby: hasOrdering
          ? orderByColumns.map(column => [column, !!sortAscending])
          : [],
      },
    ];
  });
}
