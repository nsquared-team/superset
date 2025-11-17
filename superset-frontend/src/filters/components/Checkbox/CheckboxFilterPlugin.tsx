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
    (values: CheckboxValue) => {
      const emptyFilter =
        enableEmptyFilter && !inverseSelection && !values?.length;

      const suffix = inverseSelection && values?.length ? t(' (excluded)') : '';

      setDataMask({
        extraFormData: getSelectExtraFormData(
          col,
          values,
          emptyFilter,
          excludeFilterValues && inverseSelection,
        ),
        filterState: {
          label: values?.length
            ? `${values
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
      enableEmptyFilter,
      inverseSelection,
      excludeFilterValues,
      labelFormatter,
      setDataMask,
    ],
  );

  const handleChange = useCallback(
    (checkedValues: unknown[]) => {
      const values = checkedValues as CheckboxValue;
      updateDataMask(values?.length ? values : null);
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
      const firstItem: CheckboxValue = groupby.map(
        col => data[0][col],
      ) as string[];
      if (firstItem?.[0] !== undefined) {
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
                {option.label}
              </Checkbox>
            ))}
          </StyledCheckboxGroup>
        </div>
      </FormItem>
    </FilterPluginStyle>
  );
}
