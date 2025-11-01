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

