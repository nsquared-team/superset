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
  ControlPanelConfig,
  ControlPanelsContainerProps,
  sharedControls,
} from '@superset-ui/chart-controls';
import { t } from '@superset-ui/core';
import { ALL_DATE_RANGE_PRESETS } from './types';

const config: ControlPanelConfig = {
  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'groupby',
            config: {
              ...sharedControls.groupby,
              label: t('Column'),
              required: true,
            },
          },
        ],
      ],
    },
    {
      label: t('UI Configuration'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'enableEmptyFilter',
            config: {
              type: 'CheckboxControl',
              label: t('Filter value is required'),
              default: false,
              renderTrigger: true,
              description: t(
                'User must select a value before applying the filter',
              ),
            },
          },
        ],
        [
          {
            name: 'customPresets',
            config: {
              type: 'CheckboxControl',
              label: t('Customize date presets'),
              default: false,
              renderTrigger: true,
              description: t(
                'Enable to select which preset date ranges to show in the date picker',
              ),
            },
          },
        ],
        [
          {
            name: 'enabledPresets',
            config: {
              type: 'SelectControl',
              label: t('Enabled presets'),
              multi: true,
              freeForm: false,
              clearable: false,
              default: ALL_DATE_RANGE_PRESETS,
              mode: 'multiple',
              choices: [
                ['today', t('Today')],
                ['yesterday', t('Yesterday')],
                ['last_7_days', t('Last 7 Days')],
                ['last_14_days', t('Last 14 Days')],
                ['last_28_days', t('Last 28 Days')],
                ['last_30_days', t('Last 30 Days')],
                ['this_week', t('This Week')],
                ['last_week', t('Last Week')],
                ['this_month', t('This Month')],
                ['last_month', t('Last Month')],
                ['this_quarter', t('This Quarter')],
                ['last_quarter', t('Last Quarter')],
                ['this_year', t('This Year')],
                ['last_year', t('Last Year')],
              ],
              renderTrigger: true,
              description: t(
                'Select which preset date ranges to display in the date picker',
              ),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.customPresets?.value),
            },
          },
        ],
      ],
    },
  ],
};

export default config;
