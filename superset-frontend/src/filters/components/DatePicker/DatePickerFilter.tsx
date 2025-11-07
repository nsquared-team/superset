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
import { styled, NO_TIME_RANGE } from '@superset-ui/core';
import { useCallback, useEffect, useState } from 'react';
import { DatePicker, AntdThemeProvider } from '@superset-ui/core/components';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DEFAULT_FORM_DATA, PluginFilterTimeProps } from './types';
import { FilterPluginStyle } from '../common';

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

export default function TimeFilterPlugin(props: PluginFilterTimeProps) {
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

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const singleDate =
    props.formData?.singleDate ?? DEFAULT_FORM_DATA.singleDate;

  useEffect(() => {
    if (filterState.value && filterState.value !== NO_TIME_RANGE) {
      const parts = filterState.value.split(' : ');
      if (parts.length === 2) {
        if (singleDate) {
          const startDate = parts[0].trim();
          const parsedStartDate = dayjs(startDate);
          if (parsedStartDate.isValid()) {
            setSelectedDate(parsedStartDate.startOf('day'));
            return;
          }
        } else {
          const endDate = parts[1].trim();
          const parsedEndDate = dayjs(endDate);
          if (parsedEndDate.isValid()) {
            setSelectedDate(parsedEndDate.subtract(1, 'day').startOf('day'));
            return;
          }
        }
      }
    }
    setSelectedDate(null);
  }, [filterState.value, singleDate]);

  const handleDateChange = useCallback(
    (date: Dayjs | null): void => {
      if (date) {
        const normalizedDate = date.startOf('day');
        setSelectedDate(normalizedDate);
        const startDate = normalizedDate.format('YYYY-MM-DD');
        const endDate = normalizedDate.add(1, 'day').format('YYYY-MM-DD');

        const timeRange = singleDate
          ? `${startDate} : ${endDate}`
          : `1900-01-01 : ${endDate}`;

        setDataMask({
          extraFormData: {
            time_range: timeRange,
          },
          filterState: {
            value: timeRange,
          },
        });
      } else {
        setSelectedDate(null);
        setDataMask({
          extraFormData: {},
          filterState: {
            value: undefined,
          },
        });
      }
    },
    [singleDate, setDataMask],
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
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Select a date"
            format="YYYY-MM-DD"
            allowClear
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
