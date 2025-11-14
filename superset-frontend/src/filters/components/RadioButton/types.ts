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

export type RadioButtonValue = number | string | boolean | bigint | Date | null | undefined;

export interface PluginFilterRadioButtonCustomizeProps {
  defaultValue?: RadioButtonValue;
  enableEmptyFilter: boolean;
  inverseSelection: boolean;
  defaultToFirstItem: boolean;
  sortAscending?: boolean;
  sortMetric?: string;
}

export const DEFAULT_FORM_DATA: PluginFilterRadioButtonCustomizeProps = {
  defaultValue: null,
  enableEmptyFilter: false,
  inverseSelection: false,
  defaultToFirstItem: false,
  sortAscending: true,
};

export type PluginFilterRadioButtonQueryFormData = QueryFormData &
  PluginFilterStylesProps &
  PluginFilterRadioButtonCustomizeProps;

export interface PluginFilterRadioButtonChartProps extends ChartProps {
  queriesData: ChartDataResponseResult[];
}

export type PluginFilterRadioButtonProps = PluginFilterStylesProps &
  PluginFilterHooks & {
    coltypeMap: Record<string, GenericDataType>;
    data: DataRecord[];
    appSection: AppSection;
    formData: PluginFilterRadioButtonQueryFormData;
    filterState: FilterState;
    isRefreshing: boolean;
    inputRef?: RefObject<HTMLDivElement>;
    filterBarOrientation?: FilterBarOrientation;
    clearAllTrigger?: Record<string, boolean>;
    onClearAllComplete?: (filterId: string) => void;
  };
