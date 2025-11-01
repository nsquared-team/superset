import { Behavior, ChartMetadata, ChartPlugin, t } from '@superset-ui/core';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';

export default class FilterBooleanPlugin extends ChartPlugin {
  constructor() {
    const metadata = new ChartMetadata({
      name: t('Single Boolean Checkbox'),
      description: t('Single checkbox filter for boolean columns'),
      behaviors: [Behavior.InteractiveChart, Behavior.NativeFilter],
      enableNoResults: false,
      tags: [t('Experimental')],
      thumbnail,
    });

    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('./BooleanFilterPlugin'),
      metadata,
      transformProps,
    });
  }
}

