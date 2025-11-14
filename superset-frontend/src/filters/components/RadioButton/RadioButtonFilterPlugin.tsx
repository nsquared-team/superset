import { useCallback, useEffect, useMemo } from 'react';
import {
  AppSection,
  ensureIsArray,
  GenericDataType,
  getColumnLabel,
  finestTemporalGrainFormatter,
  t,
  styled,
} from '@superset-ui/core';
import { FormItem, Radio } from '@superset-ui/core/components';
import { FilterBarOrientation } from 'src/dashboard/types';
import { getDataRecordFormatter, getSelectExtraFormData } from '../../utils';
import { FilterPluginStyle, StatusMessage } from '../common';
import { PluginFilterRadioButtonProps, RadioButtonValue } from './types';

const StyledRadioGroup = styled(Radio.Group)<{
  inverseSelection: boolean;
  appSection: AppSection;
  orientation?: FilterBarOrientation;
}>`
  display: flex;
  flex-direction: ${({ orientation }) =>
    orientation === FilterBarOrientation.Horizontal ? 'row' : 'column'};
  flex-wrap: ${({ orientation }) =>
    orientation === FilterBarOrientation.Horizontal ? 'wrap' : 'nowrap'};
  gap: 8px;
  width: fit-content;
  
  .ant-radio-wrapper {
    margin: 0;
  }
`;

export default function PluginFilterRadioButton(props: PluginFilterRadioButtonProps) {
  const {
    coltypeMap,
    data,
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
    filterBarOrientation,
    clearAllTrigger,
    onClearAllComplete,
  } = props;
  const { enableEmptyFilter, inverseSelection, defaultToFirstItem } = formData;

  const groupby = useMemo(
    () => ensureIsArray(formData.groupby).map(getColumnLabel),
    [formData.groupby],
  );
  const [col] = groupby;
  const datatype: GenericDataType = coltypeMap[col];

  const labelFormatter = useMemo(
    () =>
      getDataRecordFormatter({
        timeFormatter: finestTemporalGrainFormatter(data.map(el => el[col])),
      }),
    [data, col],
  );

  const excludeFilterValues = filterState?.excludeFilterValues ?? true;
  const isDisabled =
    appSection === AppSection.FilterConfigModal && defaultToFirstItem;

  const updateDataMask = useCallback(
    (value: RadioButtonValue) => {
      const emptyFilter =
        enableEmptyFilter && !inverseSelection && value == null;

      const suffix = inverseSelection && value != null ? t(' (excluded)') : '';

      setDataMask({
        extraFormData: getSelectExtraFormData(
          col,
          value != null ? [value as string | number | boolean | null] : null,
          emptyFilter,
          excludeFilterValues && inverseSelection,
        ),
        filterState: {
          label: value != null ? `${labelFormatter(value, datatype)}${suffix}`
            : undefined,
          value:
            appSection === AppSection.FilterConfigModal && defaultToFirstItem
              ? undefined
              : value,
          excludeFilterValues,
        },
      });
    },
    [
      appSection,
      col,
      datatype,
      defaultToFirstItem,
      enableEmptyFilter,
      inverseSelection,
      excludeFilterValues,
      labelFormatter,
      setDataMask,
    ],
  );

  const handleChange = useCallback(
    (e: any) => {
      const value = e.target.value as RadioButtonValue;
      updateDataMask(value);
    },
    [updateDataMask],
  );

  const uniqueOptions = useMemo(() => {
    const allOptions = new Set(data.map(el => el[col]));
    return [...allOptions]
      .filter(value => value !== null && value !== undefined)
      .map((value: string) => ({
        label: labelFormatter(value, datatype),
        value,
      }));
  }, [data, datatype, col, labelFormatter]);

  const sortedOptions = useMemo(() => {
    if (formData.sortAscending === undefined) {
      return uniqueOptions;
    }
    return [...uniqueOptions].sort((a, b) => {
      const labelA = String(a.label).toLowerCase();
      const labelB = String(b.label).toLowerCase();
      return formData.sortAscending
        ? labelA.localeCompare(labelB)
        : labelB.localeCompare(labelA);
    });
  }, [uniqueOptions, formData.sortAscending]);

  useEffect(() => {
    if (clearAllTrigger) {
      updateDataMask(null);
      onClearAllComplete?.(formData.nativeFilterId);
      return;
    }

    if (isDisabled) {
      updateDataMask(null);
      return;
    }

    if (filterState.value !== undefined) {
      updateDataMask(filterState.value);
      return;
    }

    if (defaultToFirstItem && data[0]) {
      const firstItem = data[0][col];
      if (firstItem !== undefined) {
        updateDataMask(firstItem);
      }
    } else if (formData?.defaultValue) {
      updateDataMask(formData.defaultValue);
    }
  }, [isDisabled, defaultToFirstItem, clearAllTrigger]);

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
          <StyledRadioGroup
            appSection={appSection}
            inverseSelection={inverseSelection}
            orientation={filterBarOrientation}
            value={filterState.value as RadioButtonValue}
            disabled={isDisabled || isRefreshing}
            onChange={handleChange}
          >
            {sortedOptions.map(option => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </StyledRadioGroup>
        </div>
      </FormItem>
    </FilterPluginStyle>
  );
}
