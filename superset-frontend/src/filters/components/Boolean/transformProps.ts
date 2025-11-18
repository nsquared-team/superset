
import { GenericDataType } from '@superset-ui/core';
import { noOp } from 'src/utils/common';
import { DEFAULT_FORM_DATA, PluginFilterBooleanChartProps } from './types';

export default function transformProps(
  chartProps: PluginFilterBooleanChartProps,
) {
  const {
    formData,
    height,
    width,
    hooks,
    queriesData,
    displaySettings,
    appSection,
    filterState,
    isRefreshing,
    inputRef,
  } = chartProps;

  const {
    setDataMask = noOp,
    setHoveredFilter = noOp,
    unsetHoveredFilter = noOp,
    setFocusedFilter = noOp,
    unsetFocusedFilter = noOp,
    clearAllTrigger,
    onClearAllComplete,
  } = hooks;

  const [queryData] = queriesData;
  const { colnames = [], coltypes = [], data = [] } = queryData || {};

  const coltypeMap: Record<string, GenericDataType> = colnames.reduce(
    (accumulator, item, index) => ({ ...accumulator, [item]: coltypes[index] }),
    {},
  );

  return {
    coltypeMap,
    data,
    filterState,
    formData: { ...DEFAULT_FORM_DATA, ...formData },
    height,
    width,
    isRefreshing,
    appSection,
    inputRef,
    filterBarOrientation: displaySettings?.filterBarOrientation,
    setDataMask,
    setHoveredFilter,
    unsetHoveredFilter,
    setFocusedFilter,
    unsetFocusedFilter,
    clearAllTrigger,
    onClearAllComplete,
  };
}

