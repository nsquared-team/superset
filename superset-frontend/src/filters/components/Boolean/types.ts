/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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

