import { Behavior, ChartMetadata, ChartPlugin, t } from '@superset-ui/core';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';

export default class FilterCheckboxPlugin extends ChartPlugin {
  constructor() {
    const metadata = new ChartMetadata({
      name: t('Checkbox filter'),
      description: t('Checkbox filter plugin using AntD'),
      behaviors: [Behavior.InteractiveChart, Behavior.NativeFilter],
      enableNoResults: false,
      tags: [t('Experimental')],
      thumbnail,
    });

    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('./RadioButtonFilterPlugin'),
      metadata,
      transformProps,
    });
  }
}
