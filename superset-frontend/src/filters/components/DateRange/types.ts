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
import { RefObject } from 'react';
import {
  Behavior,
  DataRecord,
  FilterState,
  QueryFormData,
} from '@superset-ui/core';
import { PluginFilterHooks, PluginFilterStylesProps } from '../types';

export type DateRangePresetKey = 
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_14_days'
  | 'last_28_days'
  | 'last_30_days'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year';

interface PluginFilterTimeCustomizeProps {
  defaultValue?: string | null;
  singleDate?: boolean;
  customPresets?: boolean;
  enabledPresets?: DateRangePresetKey[];
}

export type PluginFilterSelectQueryFormData = QueryFormData &
  PluginFilterStylesProps &
  PluginFilterTimeCustomizeProps;

export type PluginFilterTimeProps = PluginFilterStylesProps & {
  behaviors: Behavior[];
  data: DataRecord[];
  formData: PluginFilterSelectQueryFormData;
  filterState: FilterState;
  inputRef: RefObject<HTMLInputElement>;
  isOverflowingFilterBar?: boolean;
} & PluginFilterHooks;

export const ALL_DATE_RANGE_PRESETS: DateRangePresetKey[] = [
  'today',
  'yesterday',
  'last_7_days',
  'last_14_days',
  'last_28_days',
  'last_30_days',
  'this_week',
  'last_week',
  'this_month',
  'last_month',
  'this_quarter',
  'last_quarter',
  'this_year',
  'last_year',
];

export const DEFAULT_FORM_DATA: PluginFilterTimeCustomizeProps = {
  defaultValue: null,
  singleDate: false,
  customPresets: false,
  enabledPresets: ALL_DATE_RANGE_PRESETS,
};
