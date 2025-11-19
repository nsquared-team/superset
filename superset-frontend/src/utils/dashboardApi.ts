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
import { makeApi, SupersetClient } from '@superset-ui/core';
import { FilterBarOrientation, DashboardInfo } from 'src/dashboard/types';

export interface UpdateFilterBarOrientationOptions {
  dashboardId: number;
  orientation: FilterBarOrientation;
  existingMetadata?: Record<string, any>;
}

export interface UpdateFilterBarOrientationResponse {
  result: Partial<DashboardInfo>;
  last_modified_time: number;
}

export async function updateDashboardFilterBarOrientation(
  options: UpdateFilterBarOrientationOptions,
): Promise<UpdateFilterBarOrientationResponse> {
  const { dashboardId, orientation, existingMetadata } = options;

  const updateDashboard = makeApi<
    Partial<DashboardInfo>,
    UpdateFilterBarOrientationResponse
  >({
    method: 'PUT',
    endpoint: `/api/v1/dashboard/${dashboardId}`,
  });

  const metadata = existingMetadata || {};

  const response = await updateDashboard({
    json_metadata: JSON.stringify({
      ...metadata,
      filter_bar_orientation: orientation,
    }),
  });

  return response;
}

export async function getDashboardMetadata(
  dashboardId: number,
): Promise<Record<string, any>> {
  const { json } = await SupersetClient.get({
    endpoint: `/api/v1/dashboard/${dashboardId}`,
  });

  const dashboard = json as { result: DashboardInfo };

  if (dashboard.result.json_metadata) {
    try {
      return JSON.parse(dashboard.result.json_metadata);
    } catch {
      return {};
    }
  }

  return {};
}

export async function setDashboardFilterBarOrientation(
  dashboardId: number,
  orientation: FilterBarOrientation,
): Promise<UpdateFilterBarOrientationResponse> {
  const existingMetadata = await getDashboardMetadata(dashboardId);

  return updateDashboardFilterBarOrientation({
    dashboardId,
    orientation,
    existingMetadata,
  });
}