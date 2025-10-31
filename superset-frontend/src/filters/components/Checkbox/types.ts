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

export type CheckboxValue = (number | string | null)[] | null | undefined;

export interface PluginFilterCheckboxCustomizeProps {
  defaultValue?: CheckboxValue;
  enableEmptyFilter: boolean;
  inverseSelection: boolean;
  defaultToFirstItem: boolean;
  sortAscending?: boolean;
  sortMetric?: string;
}

export const DEFAULT_FORM_DATA: PluginFilterCheckboxCustomizeProps = {
  defaultValue: null,
  enableEmptyFilter: false,
  inverseSelection: false,
  defaultToFirstItem: false,
  sortAscending: true,
};

export type PluginFilterCheckboxQueryFormData = QueryFormData &
  PluginFilterStylesProps &
  PluginFilterCheckboxCustomizeProps;

export interface PluginFilterCheckboxChartProps extends ChartProps {
  queriesData: ChartDataResponseResult[];
}

export type PluginFilterCheckboxProps = PluginFilterStylesProps &
  PluginFilterHooks & {
    coltypeMap: Record<string, GenericDataType>;
    data: DataRecord[];
    appSection: AppSection;
    formData: PluginFilterCheckboxQueryFormData;
    filterState: FilterState;
    isRefreshing: boolean;
    inputRef?: RefObject<HTMLDivElement>;
    filterBarOrientation?: FilterBarOrientation;
    clearAllTrigger?: Record<string, boolean>;
    onClearAllComplete?: (filterId: string) => void;
  };
