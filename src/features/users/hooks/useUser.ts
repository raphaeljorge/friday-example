import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, getReadingHistory } from '../api/users';

const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  history: () => [...userKeys.all, 'history'] as const,
};

export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: getUserProfile,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}

export function useReadingHistory() {
  return useQuery({
    queryKey: userKeys.history(),
    queryFn: getReadingHistory,
  });
}