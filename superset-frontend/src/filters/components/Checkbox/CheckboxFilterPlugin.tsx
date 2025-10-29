import { useCallback, useEffect, useMemo } from 'react';
import {
  AppSection,
  DataMask,
  ensureIsArray,
  ExtraFormData,
  GenericDataType,
  getColumnLabel,
  JsonObject,
  finestTemporalGrainFormatter,
  t,
  styled,
} from '@superset-ui/core';
import { isUndefined } from 'lodash';
import { useImmerReducer } from 'use-immer';
import { FormItem, Checkbox, Space } from '@superset-ui/core/components';
import { FilterBarOrientation } from 'src/dashboard/types';
import { getDataRecordFormatter, getSelectExtraFormData } from '../../utils';
import { FilterPluginStyle, StatusMessage } from '../common';
import { PluginFilterCheckboxProps, CheckboxValue } from './types';

type DataMaskAction =
  | { type: 'ownState'; ownState: JsonObject }
  | {
      type: 'filterState';
      extraFormData: ExtraFormData;
      filterState: {
        value: CheckboxValue;
        label?: string;
        excludeFilterValues?: boolean;
      };
    };

function reducer(draft: DataMask, action: DataMaskAction) {
  switch (action.type) {
    case 'ownState':
      draft.ownState = {
        ...draft.ownState,
        ...action.ownState,
      };
      return draft;
    case 'filterState':
      if (
        JSON.stringify(draft.extraFormData) !==
        JSON.stringify(action.extraFormData)
      ) {
        draft.extraFormData = action.extraFormData;
      }
      if (
        JSON.stringify(draft.filterState) !== JSON.stringify(action.filterState)
      ) {
        draft.filterState = { ...draft.filterState, ...action.filterState };
      }

      return draft;
    default:
      return draft;
  }
}

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

const StyledSpace = styled(Space)`
  display: flex;
  align-items: center;
  width: 100%;
  padding-top: 2px;
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
  const { enableEmptyFilter, inverseSelection, defaultToFirstItem } = formData;

  const groupby = useMemo(
    () => ensureIsArray(formData.groupby).map(getColumnLabel),
    [formData.groupby],
  );
  const [col] = groupby;
  const [dataMask, dispatchDataMask] = useImmerReducer(reducer, {
    extraFormData: {},
    filterState,
  });
  const datatype: GenericDataType = coltypeMap[col];
  const labelFormatter = useMemo(
    () =>
      getDataRecordFormatter({
        timeFormatter: finestTemporalGrainFormatter(data.map(el => el[col])),
      }),
    [data, col],
  );
  const excludeFilterValues = isUndefined(filterState?.excludeFilterValues)
    ? true
    : filterState?.excludeFilterValues;

  const updateDataMask = useCallback(
    (values: CheckboxValue) => {
      const emptyFilter =
        enableEmptyFilter && !inverseSelection && !values?.length;

      const suffix = inverseSelection && values?.length ? t(' (excluded)') : '';
      dispatchDataMask({
        type: 'filterState',
        extraFormData: getSelectExtraFormData(
          col,
          values,
          emptyFilter,
          excludeFilterValues && inverseSelection,
        ),
        filterState: {
          ...filterState,
          label: values?.length
            ? `${(values || [])
                .map(value => labelFormatter(value, datatype))
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
      dispatchDataMask,
      enableEmptyFilter,
      inverseSelection,
      excludeFilterValues,
      JSON.stringify(filterState),
      labelFormatter,
    ],
  );

  const isDisabled =
    appSection === AppSection.FilterConfigModal && defaultToFirstItem;

  const handleChange = useCallback(
    (checkedValues: CheckboxValue) => {
      if (checkedValues && checkedValues.length === 0) {
        updateDataMask(null);
      } else {
        updateDataMask(checkedValues);
      }
    },
    [updateDataMask],
  );

  const formItemExtra = useMemo(() => {
    if (filterState.validateMessage) {
      return (
        <StatusMessage status={filterState.validateStatus}>
          {filterState.validateMessage}
        </StatusMessage>
      );
    }
    return undefined;
  }, [filterState.validateMessage, filterState.validateStatus]);

  const uniqueOptions = useMemo(() => {
    const allOptions = new Set([...data.map(el => el[col])]);
    return [...allOptions]
      .filter(value => value !== null && value !== undefined)
      .map((value: string) => ({
        label: labelFormatter(value, datatype),
        value,
      }));
  }, [data, datatype, col, labelFormatter]);

  const sortedOptions = useMemo(() => {
    const sorted = [...uniqueOptions];
    if (formData.sortAscending !== undefined) {
      sorted.sort((a, b) => {
        const labelA = String(a.label).toLowerCase();
        const labelB = String(b.label).toLowerCase();
        return formData.sortAscending
          ? labelA.localeCompare(labelB)
          : labelB.localeCompare(labelA);
      });
    }
    return sorted;
  }, [uniqueOptions, formData.sortAscending]);

  // Initialize filter state on mount or when key dependencies change
  useEffect(() => {
    if (isDisabled) {
      updateDataMask(null);
      return;
    }

    if (filterState.value !== undefined) {
      updateDataMask(filterState.value);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled, defaultToFirstItem]);

  // Sync dataMask with parent component
  useEffect(() => {
    setDataMask(dataMask);
  }, [JSON.stringify(dataMask)]);

  // Handle clear all trigger
  useEffect(() => {
    if (clearAllTrigger) {
      updateDataMask(null);
      onClearAllComplete?.(formData.nativeFilterId);
    }
  }, [
    clearAllTrigger,
    onClearAllComplete,
    updateDataMask,
    formData.nativeFilterId,
  ]);

  return (
    <FilterPluginStyle height={height} width={width}>
      <FormItem
        validateStatus={filterState.validateStatus}
        extra={formItemExtra}
      >
        <StyledSpace>
          <div
            onMouseEnter={setHoveredFilter}
            onMouseLeave={unsetHoveredFilter}
            onFocus={setFocusedFilter}
            onBlur={unsetFocusedFilter}
            ref={inputRef}
          >
            <StyledCheckboxGroup
              appSection={appSection}
              inverseSelection={inverseSelection}
              orientation={filterBarOrientation}
              value={(filterState.value as any) || []}
              disabled={isDisabled || isRefreshing}
              onChange={handleChange as any}
            >
              {sortedOptions.map(option => (
                <Checkbox key={option.value} value={option.value}>
                  {option.label}
                </Checkbox>
              ))}
            </StyledCheckboxGroup>
          </div>
        </StyledSpace>
      </FormItem>
    </FilterPluginStyle>
  );
}
