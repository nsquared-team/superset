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
import { FormItem, Checkbox } from '@superset-ui/core/components';
import { FilterBarOrientation } from 'src/dashboard/types';
import { getDataRecordFormatter, getSelectExtraFormData } from '../../utils';
import { FilterPluginStyle, StatusMessage } from '../common';
import { PluginFilterCheckboxProps, CheckboxValue } from './types';

const StyledCheckboxGroup = styled(Checkbox.Group)<{
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
  width: 100%;

  .ant-checkbox-wrapper {
    margin: 0;
  }
`;

export default function PluginFilterCheckbox(props: PluginFilterCheckboxProps) {
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
  const {
    enableEmptyFilter,
    inverseSelection,
    defaultToFirstItem,
    singleBooleanMode,
    booleanFilterValue,
    useFilterNameAsLabel,
    filterName,
  } = formData;

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
    (values: CheckboxValue, isSingleBoolean = false) => {
      // Show all when no values are selected
      if (singleBooleanMode && isSingleBoolean && (!values || !values.length)) {
        setDataMask({
          extraFormData: {},
          filterState: {
            label: undefined,
            value: values,
            excludeFilterValues,
          },
        });
        return;
      }

      const emptyFilter =
        enableEmptyFilter && !inverseSelection && !values?.length;

      const suffix = inverseSelection && values?.length ? t(' (excluded)') : '';

      // Convert string true/false to boolean
      const processedValues = singleBooleanMode
        ? values?.map(val => {
            if (val === 'true') return true;
            if (val === 'false') return false;
            return val;
          })
        : values;

      setDataMask({
        extraFormData: getSelectExtraFormData(
          col,
          processedValues,
          emptyFilter,
          excludeFilterValues && inverseSelection,
        ),
        filterState: {
          label: values?.length
            ? `${values
                .map(value =>
                  singleBooleanMode
                    ? value === 'true'
                      ? t('True')
                      : t('False')
                    : labelFormatter(value, datatype),
                )
                .join(', ')}${suffix}`
            : undefined,
          value:
            appSection === AppSection.FilterConfigModal && defaultToFirstItem
              ? undefined
              : values,
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
      singleBooleanMode,
    ],
  );

  const handleChange = useCallback(
    (checkedValues: unknown[]) => {
      const values = checkedValues as CheckboxValue;
      updateDataMask(values?.length ? values : null, false);
    },
    [updateDataMask],
  );

  const handleSingleBooleanChange = useCallback(
    (e: any) => {
      const isChecked = e.target.checked;
      if (isChecked) {
        updateDataMask(
          [booleanFilterValue ? 'false' : 'true'],
          true,
        );
      } else {
        updateDataMask(null, true);
      }
    },
    [updateDataMask, booleanFilterValue],
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

  const singleBooleanChecked = useMemo(() => {
    if (!singleBooleanMode) return false;
    const value = filterState.value as CheckboxValue;
    return !!(value && value.length > 0);
  }, [singleBooleanMode, filterState.value]);

  useEffect(() => {
    if (clearAllTrigger) {
      updateDataMask(null, singleBooleanMode);
      onClearAllComplete?.(formData.nativeFilterId);
      return;
    }

    if (isDisabled) {
      updateDataMask(null, singleBooleanMode);
      return;
    }

    if (filterState.value !== undefined) {
      updateDataMask(filterState.value, singleBooleanMode);
      return;
    }

    if (singleBooleanMode) {
      updateDataMask(null, false);
      return;
    }

    if (defaultToFirstItem && data[0]) {
      const firstItem: CheckboxValue = groupby.map(
        col => data[0][col],
      ) as string[];
      if (firstItem?.[0] !== undefined) {
        updateDataMask(firstItem);
      }
    } else if (formData?.defaultValue) {
      updateDataMask(formData.defaultValue);
    }
  }, [isDisabled, defaultToFirstItem, clearAllTrigger, singleBooleanMode]);

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
          {singleBooleanMode ? (
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
          ) : (
            <StyledCheckboxGroup
              appSection={appSection}
              inverseSelection={inverseSelection}
              orientation={filterBarOrientation}
              value={(filterState.value as CheckboxValue) || []}
              disabled={isDisabled || isRefreshing}
              onChange={handleChange}
            >
              {sortedOptions.map(option => (
                <Checkbox key={option.value} value={option.value}>
                  {useFilterNameAsLabel &&
                  filterName &&
                  sortedOptions.length === 1
                    ? filterName
                    : option.label}
                </Checkbox>
              ))}
            </StyledCheckboxGroup>
          )}
        </div>
      </FormItem>
    </FilterPluginStyle>
  );
}
