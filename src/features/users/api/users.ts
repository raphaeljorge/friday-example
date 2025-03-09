import { apiClient } from '@/lib/api/client';
import type { User, UserResponse, ReadingHistoryResponse } from '../types';

export async function getUserProfile(): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>('/user/profile');
  return response.data;
}

export async function updateUserProfile(
  user: Partial<User>
): Promise<UserResponse> {
  const response = await apiClient.put<UserResponse>('/user/profile', user);
  return response.data;
}

export async function getReadingHistory(): Promise<ReadingHistoryResponse> {
  const response = await apiClient.get<ReadingHistoryResponse>('/user/history');
  return response.data;
}
