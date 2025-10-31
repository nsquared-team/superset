import {
  AppSection,
  ChartProps,
  ChartDataResponseResult,
  DataRecord,
  FilterState,
  GenericDataType,
  QueryFormData,
} from '@superset-ui/core';
import { RefObject } from 'react';
import { FilterBarOrientation } from 'src/dashboard/types';
import { PluginFilterHooks, PluginFilterStylesProps } from '../types';

export type BooleanValue = (boolean | string | null)[] | null | undefined;

export interface PluginFilterBooleanCustomizeProps {
  defaultValue?: BooleanValue;
  booleanFilterValue?: boolean;
  useFilterNameAsLabel?: boolean;
  hideFilterTitle?: boolean;
}

export const DEFAULT_FORM_DATA: PluginFilterBooleanCustomizeProps = {
  defaultValue: null,
  booleanFilterValue: false,
  useFilterNameAsLabel: false,
  hideFilterTitle: false,
};

export type PluginFilterBooleanQueryFormData = QueryFormData &
  PluginFilterStylesProps &
  PluginFilterBooleanCustomizeProps & {
    filterName?: string;
  };

export interface PluginFilterBooleanChartProps extends ChartProps {
  queriesData: ChartDataResponseResult[];
}

export type PluginFilterBooleanProps = PluginFilterStylesProps &
  PluginFilterHooks & {
    coltypeMap: Record<string, GenericDataType>;
    data: DataRecord[];
    appSection: AppSection;
    formData: PluginFilterBooleanQueryFormData;
    filterState: FilterState;
    isRefreshing: boolean;
    inputRef?: RefObject<HTMLDivElement>;
    filterBarOrientation?: FilterBarOrientation;
    clearAllTrigger?: Record<string, boolean>;
    onClearAllComplete?: (filterId: string) => void;
  };

