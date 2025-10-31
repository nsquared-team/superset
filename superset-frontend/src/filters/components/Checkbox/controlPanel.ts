import { t, validateNonEmpty } from '@superset-ui/core';
import {
  ControlPanelConfig,
  sharedControls,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';

const {
  enableEmptyFilter,
  sortAscending,
  singleBooleanMode,
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
            name: 'singleBooleanMode',
            config: {
              type: 'CheckboxControl',
              renderTrigger: true,
              label: t('Single Boolean Mode'),
              default: singleBooleanMode,
              description: t(
                'Show as a single checkbox that filters boolean values when checked, shows all when unchecked',
              ),
            },
          },
        ],
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
              visibility: ({ form_data }: { form_data: any }) =>
                form_data.singleBooleanMode === true,
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
                'Use the filter name as the checkbox label instead of data values.',
              ),
              visibility: ({ form_data }: { form_data: any }) =>
                form_data.singleBooleanMode === true,
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
        [
          {
            name: 'sortAscending',
            config: {
              type: 'CheckboxControl',
              renderTrigger: true,
              label: t('Sort ascending'),
              default: sortAscending,
              description: t('Check for sorting ascending'),
            },
          },
        ],
        [
          {
            name: 'enableEmptyFilter',
            config: {
              type: 'CheckboxControl',
              label: t('Filter value is required'),
              default: enableEmptyFilter,
              renderTrigger: true,
              description: t(
                'User must select a value before applying the filter',
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
