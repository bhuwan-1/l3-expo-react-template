import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '@template/models/user.model';
import api from '@template/services/api/api';

const userApi = {
  useUsersQuery: () => {
    return useQuery({
      queryKey: ['users'],
      queryFn: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
      },
    });
  },

  useUserQuery: (userId: number) => {
    return useQuery({
      queryKey: ['users', userId],
      queryFn: async () => {
        const response = await api.get<User>(`/users/${userId}`);
        return response.data;
      },
      enabled: !!userId,
    });
  },

  useCreateUserMutation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateUserPayload) => {
        const response = await api.post<User>('/users', data);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate and refetch users list
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
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
        // Invalidate and refetch users list and specific user
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['users', data.id] });
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
        // Invalidate and refetch users list
        queryClient.invalidateQueries({ queryKey: ['users'] });
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
