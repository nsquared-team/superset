import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  AppSection,
  ensureIsArray,
  getColumnLabel,
  t,
} from '@superset-ui/core';
import { FormItem, Checkbox } from '@superset-ui/core/components';
import { getSelectExtraFormData } from '../../utils';
import { FilterPluginStyle, StatusMessage } from '../common';
import { PluginFilterBooleanProps, BooleanValue } from './types';

export default function PluginFilterBoolean(props: PluginFilterBooleanProps) {
  const {
    filterState,
    formData,
    height,
    isRefreshing,
    width,
    setDataMask,
    setHoveredFilter,
    unsetHoveredFilter,
    setFocusedFilter,
    unsetFocusedFilter,
    appSection,
    inputRef,
    clearAllTrigger,
    onClearAllComplete,
  } = props;
  const {
    booleanFilterValue,
    useFilterNameAsLabel,
    filterName,
  } = formData;

  const groupby = useMemo(
    () => ensureIsArray(formData.groupby).map(getColumnLabel),
    [formData.groupby],
  );
  const [col] = groupby;

  const isDisabled = appSection === AppSection.FilterConfigModal;
  const isInitializedRef = useRef(false);

  const updateDataMask = useCallback(
    (values: BooleanValue) => {
      // Show all when no values are selected
      if (!values || !values.length) {
        setDataMask({
          extraFormData: {},
          filterState: {
            label: undefined,
            value: null,
            excludeFilterValues: true,
          },
        });
        return;
      }

      // Convert string true/false to boolean
      const processedValues = values.map(val => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return val;
      });

      setDataMask({
        extraFormData: getSelectExtraFormData(
          col,
          processedValues,
          false,
          false,
        ),
        filterState: {
          label: values
            .map(value => (value === 'true' ? t('True') : t('False')))
            .join(', '),
          value: values,
          excludeFilterValues: true,
        },
      });
    },
    [col, setDataMask],
  );

  const handleSingleBooleanChange = useCallback(
    (e: any) => {
      const isChecked = e.target.checked;
      if (isChecked) {
        updateDataMask([booleanFilterValue ? 'false' : 'true']);
      } else {
        updateDataMask(null);
      }
    },
    [updateDataMask, booleanFilterValue],
  );

  const singleBooleanChecked = useMemo(() => {
    const value = filterState.value as BooleanValue;
    return !!(value && value.length > 0);
  }, [filterState.value]);

  useEffect(() => {
    // Handle clear all
    if (clearAllTrigger) {
      updateDataMask(null);
      onClearAllComplete?.(formData.nativeFilterId);
      isInitializedRef.current = false;
      return;
    }

    if (isDisabled) {
      if (!isInitializedRef.current) {
        updateDataMask(null);
        isInitializedRef.current = true;
      }
      return;
    }

    if (!isInitializedRef.current) {
      if (formData?.defaultValue) {
        updateDataMask(formData.defaultValue);
      } else {
        updateDataMask(null);
      }
      isInitializedRef.current = true;
    }
  }, [
    clearAllTrigger,
    isDisabled,
    formData.defaultValue,
    formData.nativeFilterId,
    updateDataMask,
    onClearAllComplete,
  ]);

  return (
    <FilterPluginStyle height={height} width={width}>
      <FormItem
        validateStatus={filterState.validateStatus}
        extra={
          filterState.validateMessage ? (
            <StatusMessage status={filterState.validateStatus}>
              {filterState.validateMessage}
            </StatusMessage>
          ) : undefined
        }
      >
        <div
          onMouseEnter={setHoveredFilter}
          onMouseLeave={unsetHoveredFilter}
          onFocus={setFocusedFilter}
          onBlur={unsetFocusedFilter}
          ref={inputRef}
        >
          <Checkbox
            checked={singleBooleanChecked}
            disabled={isDisabled || isRefreshing}
            onChange={handleSingleBooleanChange}
          >
            {useFilterNameAsLabel && filterName
              ? filterName
              : booleanFilterValue
                ? t('False')
                : t('True')}
          </Checkbox>
        </div>
      </FormItem>
    </FilterPluginStyle>
  );
}

