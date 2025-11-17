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
import { t, validateNonEmpty } from '@superset-ui/core';
import {
  ControlPanelConfig,
  sharedControls,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';

const {
  booleanFilterValue,
  useFilterNameAsLabel,
  hideFilterTitle,
} = DEFAULT_FORM_DATA;

const config: ControlPanelConfig = {
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
            name: 'booleanFilterValue',
            config: {
              type: 'CheckboxControl',
              renderTrigger: true,
              label: t('Filter for False values'),
              default: booleanFilterValue,
              description: t(
                'When checked, filters for FALSE values. When unchecked, filters for TRUE values',
              ),
            },
          },
        ],
        [
          {
            name: 'useFilterNameAsLabel',
            config: {
              type: 'CheckboxControl',
              renderTrigger: true,
              label: t('Use filter name as label'),
              default: useFilterNameAsLabel,
              description: t(
                'Use the filter name as the checkbox label instead of True/False.',
              ),
            },
          },
        ],
        [
          {
            name: 'hideFilterTitle',
            config: {
              type: 'CheckboxControl',
              renderTrigger: true,
              label: t('Hide filter title'),
              default: hideFilterTitle,
              description: t(
                'Hide the filter title in the filter bar',
              ),
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    groupby: {
      multi: false,
      validators: [validateNonEmpty],
    },
  },
};

export default config;

