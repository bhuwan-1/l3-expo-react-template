import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@template/constants/query-keys.constant';
import {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '@template/models/user.model';
import api from '@template/services/api/api';

const userApi = {
  useUsersQuery: () => {
    return useQuery({
      queryKey: queryKeys.users.lists(),
      queryFn: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
      },
    });
  },

  useUserQuery: (userId: number) => {
    return useQuery({
      queryKey: queryKeys.users.detail(userId),
      queryFn: async () => {
        const response = await api.get<User>(`/users/${userId}`);
        return response.data;
      },
      enabled: !!userId,
    });
  },

  useCreateUserMutation: () => {
    return useMutation({
      mutationFn: async (data: CreateUserPayload) => {
        const response = await api.post<User>('/users', data);
        return response.data;
      },
      onSuccess: () => {
        // can show a success message
      },
      onError: (error) => {
        // can show a error message
      },
      onSettled: () => {
        // can invalidate the queries if you prefer not to use the meta option
      },
      meta: { invalidateQueries: queryKeys.users.all },
    });
  },

  useUpdateUserMutation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: UpdateUserPayload) => {
        const { id, ...updateData } = data;
        const response = await api.put<User>(`/users/${id}`, updateData);
        return response.data;
      },
      onSuccess: (data) => {
        // Invalidate all user queries (more efficient than individual invalidations)
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      },
    });
  },

  useDeleteUserMutation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (userId: number) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate and refetch all user-related queries
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      },
    });
  },
};

export const {
  useUsersQuery,
  useUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
