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
import { styled, NO_TIME_RANGE, t } from '@superset-ui/core';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { RangePicker, AntdThemeProvider } from '@superset-ui/core/components';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { PluginFilterTimeProps, DateRangePresetKey } from './types';
import { FilterPluginStyle } from '../common';

dayjs.extend(quarterOfYear);

const TimeFilterStyles = styled(FilterPluginStyle)`
  display: flex;
  align-items: center;
  overflow-x: visible;

  & .ant-tag {
    margin-right: 0;
  }
`;

const ControlContainer = styled.div<{
  validateStatus?: 'error' | 'warning' | 'info';
}>`
  display: flex;
  height: 100%;
  max-width: 100%;
  width: 100%;

  & .ant-picker {
    width: 100%;
    border-radius: ${({ theme }) => theme.borderRadius};

    ${({ validateStatus, theme }) => {
      if (!validateStatus) return '';
      switch (validateStatus) {
        case 'error':
          return `border-color: ${theme.colorError}`;
        case 'warning':
          return `border-color: ${theme.colorWarning}`;
        case 'info':
          return `border-color: ${theme.colorInfo}`;
        default:
          return `border-color: ${theme.colorError}`;
      }
    }}
  }

  & .ant-picker:hover,
  & .ant-picker-focused {
    border-color: ${({ theme }) => theme.colorPrimary};
  }

  &:focus-within .ant-picker {
    border-color: ${({ theme }) => theme.colorPrimary};
    box-shadow: ${({ theme }) => `0 0 0 2px ${theme.controlOutline}`};
    outline: 0;
  }
`;

export default function DateRangeFilter(props: PluginFilterTimeProps) {
  const {
    setDataMask,
    setHoveredFilter,
    unsetHoveredFilter,
    setFocusedFilter,
    unsetFocusedFilter,
    setFilterActive,
    width,
    height,
    filterState,
    inputRef,
  } = props;

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const allRangePresets = useMemo(() => {
    const today = dayjs().startOf('day');
    return new Map<DateRangePresetKey, { label: string; value: [Dayjs, Dayjs] }>([
      ['today', { label: t('Today'), value: [today, today] }],
      ['yesterday', {
        label: t('Yesterday'),
        value: [today.subtract(1, 'day'), today.subtract(1, 'day')],
      }],
      ['last_7_days', {
        label: t('Last 7 Days'),
        value: [today.subtract(6, 'day'), today],
      }],
      ['last_14_days', {
        label: t('Last 14 Days'),
        value: [today.subtract(13, 'day'), today],
      }],
      ['last_28_days', {
        label: t('Last 28 Days'),
        value: [today.subtract(27, 'day'), today],
      }],
      ['last_30_days', {
        label: t('Last 30 Days'),
        value: [today.subtract(29, 'day'), today],
      }],
      ['this_week', {
        label: t('This Week'),
        value: [today.startOf('week'), today.endOf('week')],
      }],
      ['last_week', {
        label: t('Last Week'),
        value: [today.subtract(1, 'week').startOf('week'), today.subtract(1, 'week').endOf('week')],
      }],
      ['this_month', {
        label: t('This Month'),
        value: [today.startOf('month'), today.endOf('month')],
      }],
      ['last_month', {
        label: t('Last Month'),
        value: [
          today.subtract(1, 'month').startOf('month'),
          today.subtract(1, 'month').endOf('month'),
        ],
      }],
      ['this_quarter', {
        label: t('This Quarter'),
        value: [today.startOf('quarter'), today.endOf('quarter')],
      }],
      ['last_quarter', {
        label: t('Last Quarter'),
        value: [
          today.subtract(1, 'quarter').startOf('quarter'),
          today.subtract(1, 'quarter').endOf('quarter'),
        ],
      }],
      ['this_year', {
        label: t('This Year'),
        value: [today.startOf('year'), today.endOf('year')],
      }],
      ['last_year', {
        label: t('Last Year'),
        value: [
          today.subtract(1, 'year').startOf('year'),
          today.subtract(1, 'year').endOf('year'),
        ],
      }],
    ]);
  }, []);

  const rangePresets = useMemo(() => {
    const { customPresets, enabledPresets } = props.formData || {};
    
    // If customize presets is enabled, filter based on enabledPresets
    if (customPresets && enabledPresets && Array.isArray(enabledPresets)) {
      return enabledPresets
        .filter(key => allRangePresets.has(key))
        .map(key => allRangePresets.get(key)!);
    }
    
    // Otherwise return all presets (old behavior for backward compatibility)
    return Array.from(allRangePresets.values());
  }, [allRangePresets, props.formData]);

  useEffect(() => {
    if (filterState.value && filterState.value !== NO_TIME_RANGE) {
      const parts = filterState.value.split(' : ');
      if (parts.length === 2) {
        const startDate = parts[0].trim();
        const endDate = parts[1].trim();
        const parsedStartDate = dayjs(startDate);
        const parsedEndDate = dayjs(endDate);

        if (parsedStartDate.isValid() && parsedEndDate.isValid()) {
          setDateRange([
            parsedStartDate.startOf('day'),
            parsedEndDate.subtract(1, 'day').startOf('day'),
          ]);
          return;
        }
      }
    }
    setDateRange([null, null]);
  }, [filterState.value]);

  const handleDateChange = useCallback(
    (dates: [Dayjs | null, Dayjs | null] | null): void => {
      if (dates && dates[0] && dates[1]) {
        const startDate = dates[0].startOf('day');
        const endDate = dates[1].startOf('day');
        setDateRange([startDate, endDate]);

        const formattedStartDate = startDate.format('YYYY-MM-DD');
        const formattedEndDate = endDate.add(1, 'day').format('YYYY-MM-DD');

        const timeRange = `${formattedStartDate} : ${formattedEndDate}`;

        setDataMask({
          extraFormData: {
            time_range: timeRange,
          },
          filterState: {
            value: timeRange,
          },
        });
      } else {
        setDateRange([null, null]);
        setDataMask({
          extraFormData: {},
          filterState: {
            value: undefined,
          },
        });
      }
    },
    [setDataMask],
  );

  return props.formData?.inView ? (
    <AntdThemeProvider>
      <TimeFilterStyles width={width} height={height}>
        <ControlContainer
          ref={inputRef}
          validateStatus={filterState.validateStatus}
          onFocus={setFocusedFilter}
          onBlur={unsetFocusedFilter}
          onMouseEnter={setHoveredFilter}
          onMouseLeave={unsetHoveredFilter}
          tabIndex={-1}
        >
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            placeholder={['Start date', 'End date']}
            format="YYYY-MM-DD"
            allowClear
            presets={rangePresets.length > 0 ? rangePresets : undefined}
            onOpenChange={open => {
              setFilterActive(open);
              if (!open) {
                unsetHoveredFilter();
                unsetFocusedFilter();
              }
            }}
            style={{ width: '100%' }}
          />
        </ControlContainer>
      </TimeFilterStyles>
    </AntdThemeProvider>
  ) : null;
}
