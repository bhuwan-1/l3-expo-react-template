import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Code snippets for documentation
const CODE_SNIPPETS = {
  // Pattern 1: Query Keys Structure
  queryKeysPattern: `// src/constants/query-keys.constant.ts
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters?: { userId?: number }) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.posts.details(), id] as const,
  },
};

// Benefits:
// - Type-safe query keys
// - Hierarchical invalidation (invalidate 'all' to clear everything)
// - Easy to find and manage related queries`,

  // Pattern 2: API Service Pattern (Recommended)
  createHooks: `// src/services/user/user.api.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@template/constants/query-keys.constant.ts';
import api from '@template/services/api/api';

const userApi = {
  // Query Hook - GET all users
  useUsersQuery: () => {
    return useQuery({
      queryKey: queryKeys.users.lists(),
      queryFn: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
      },
    });
  },

  // Query Hook - GET single user (conditional)
  useUserQuery: (userId: number) => {
    return useQuery({
      queryKey: queryKeys.users.detail(userId),
      queryFn: async () => {
        const response = await api.get<User>(\`/users/\${userId}\`);
        return response.data;
      },
      enabled: !!userId, // Only fetch if userId exists
    });
  },

  // Mutation Hook - CREATE (using meta invalidation)
  useCreateUserMutation: () => {
    return useMutation({
      mutationFn: async (data: CreateUserPayload) => {
        const response = await api.post<User>('/users', data);
        return response.data;
      },
      meta: { invalidateQueries: queryKeys.users.all },
    });
  },

  // Mutation Hook - UPDATE (manual invalidation)
  useUpdateUserMutation: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (data: UpdateUserPayload) => {
        const { id, ...updateData } = data;
        const response = await api.put<User>(\`/users/\${id}\`, updateData);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      },
    });
  },

  // Mutation Hook - DELETE
  useDeleteUserMutation: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (userId: number) => {
        await api.delete(\`/users/\${userId}\`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      },
    });
  },
};

// Export individual hooks
export const {
  useUsersQuery,
  useUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;`,

  usingQueries: `import { useUsersQuery, useUserQuery } from '@template/services/user/user.api';

function MyComponent() {
  const [userId, setUserId] = useState<number>();

  // Fetch list of users
  const {
    data: users,
    isLoading,
    error,
    isError,
    refetch,
  } = useUsersQuery();

  // Fetch single user (conditional - only runs when userId exists)
  const {
    data: user,
    isLoading: isLoadingUser,
  } = useUserQuery(userId!); // enabled is already set in the hook

  if (isLoading) return <ActivityIndicator />;
  if (isError) return <Text>Error: {error?.message}</Text>;

  return (
    <View>
      {users?.map(user => (
        <TouchableOpacity key={user.id} onPress={() => setUserId(user.id)}>
          <Text>{user.name}</Text>
        </TouchableOpacity>
      ))}
      
      {isLoadingUser && <Text>Loading user details...</Text>}
      {user && <Text>Selected: {user.name}</Text>}
      
      <Button title="Refresh" onPress={() => refetch()} />
    </View>
  );
}`,

  usingMutations: `import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@template/services/user/user.api';

function UserManagement() {
  // CREATE - Using mutateAsync for async/await pattern
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUserMutation();

  // UPDATE - Using mutate for fire-and-forget pattern
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();

  // DELETE
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUserMutation();

  const handleCreate = async () => {
    try {
      const newUser = await createUser({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
      });
      Alert.alert('Success', \`User \${newUser.name} created!\`);
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to create user');
    }
  };

  const handleUpdate = () => {
    // Fire-and-forget pattern
    updateUser(
      { id: 1, name: 'Updated Name' },
      {
        onSuccess: () => Alert.alert('Success', 'User updated!'),
        onError: (error) => Alert.alert('Error', error?.message),
      }
    );
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      Alert.alert('Success', 'User deleted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleCreate} disabled={isCreating}>
        {isCreating ? <ActivityIndicator /> : <Text>Create User</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleUpdate} disabled={isUpdating}>
        <Text>Update User</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handleDelete(1)} disabled={isDeleting}>
        <Text>Delete User</Text>
      </TouchableOpacity>
    </View>
  );
}`,

  errorHandling: `import { ApiError } from '@template/models/api.model';

// Error Handling in Queries
function UsersList() {
  const { data, error, isError, isLoading } = useUsersQuery();

  if (isLoading) return <ActivityIndicator />;
  
  if (isError) {
    const apiError = error as ApiError;
    return (
      <View>
        <Text>Error: {apiError?.message || 'Something went wrong'}</Text>
        {apiError?.status && <Text>Status Code: {apiError.status}</Text>}
        {apiError?.data && <Text>Details: {JSON.stringify(apiError.data)}</Text>}
      </View>
    );
  }

  return <UserList users={data} />;
}

// Error Handling in Mutations (try-catch)
function CreateUser() {
  const { mutateAsync: createUser, isPending } = useCreateUserMutation();

  const handleSubmit = async (userData: CreateUserPayload) => {
    try {
      const newUser = await createUser(userData);
      Alert.alert('Success', \`User \${newUser.name} created!\`);
    } catch (err) {
      const error = err as ApiError;
      
      // Handle specific error codes
      if (error.status === 400) {
        Alert.alert('Validation Error', 'Please check your input');
      } else if (error.status === 401) {
        Alert.alert('Unauthorized', 'Please login again');
      } else if (error.status === 403) {
        Alert.alert('Forbidden', 'You don\\'t have permission');
      } else if (error.status === 404) {
        Alert.alert('Not Found', 'Resource not found');
      } else if (error.status === 408) {
        Alert.alert('Timeout', 'Request took too long');
      } else if (error.status === 0) {
        Alert.alert('Network Error', 'Please check your connection');
      } else {
        Alert.alert('Error', error.message || 'Something went wrong');
      }
    }
  };

  return <UserForm onSubmit={handleSubmit} isLoading={isPending} />;
}

// Error Handling with Callbacks
function UpdateUser() {
  const { mutate: updateUser } = useUpdateUserMutation();

  const handleUpdate = (data: UpdateUserPayload) => {
    updateUser(data, {
      onSuccess: (updatedUser) => {
        Alert.alert('Success', 'User updated!');
      },
      onError: (error: ApiError) => {
        Alert.alert('Error', error.message);
      },
    });
  };
  
  return <UpdateForm onSubmit={handleUpdate} />;
}`,

  advancedPatterns: `import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@template/constants/query-keys.constant.ts';

// 1. Meta-based Cache Invalidation (Automatic)
// Configured in query-client.ts - mutations with meta automatically invalidate
const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      const response = await api.post<User>('/users', data);
      return response.data;
    },
    meta: { 
      invalidateQueries: queryKeys.users.all, // Auto-invalidates on success
    },
  });
};

// 2. Manual Cache Invalidation (Granular Control)
const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      const response = await api.put<User>(\`/users/\${data.id}\`, data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Invalidate all user queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      
      // Or invalidate specific queries only
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.users.detail(updatedUser.id) 
      });
    },
  });
};

// 3. Optimistic Updates (Instant UI feedback)
const useOptimisticUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      const response = await api.put<User>(\`/users/\${data.id}\`, data);
      return response.data;
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });
      
      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(queryKeys.users.lists());
      
      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.users.lists(), (old: User[]) =>
        old?.map(user => 
          user.id === newData.id ? { ...user, ...newData } : user
        )
      );
      
      return { previousUsers };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKeys.users.lists(), context.previousUsers);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

// 4. Conditional Queries (Already enabled in useUserQuery)
const useConditionalFetch = (userId: number | undefined, isAuthenticated: boolean) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId!),
    queryFn: async () => {
      const response = await api.get<User>(\`/users/\${userId}\`);
      return response.data;
    },
    // Multiple conditions
    enabled: !!userId && isAuthenticated && userId > 0,
  });
};

// 5. Pagination with useInfiniteQuery
const useInfiniteUsers = () => {
  return useInfiniteQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<{ 
        users: User[]; 
        nextPage: number | null;
        hasMore: boolean;
      }>('/users', {
        params: { page: pageParam, limit: 20 }
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

// Usage:
function InfiniteUserList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteUsers();
  
  return (
    <FlatList
      data={data?.pages.flatMap(page => page.users)}
      onEndReached={() => hasNextPage && fetchNextPage()}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
    />
  );
}

// 6. Filtered/Parameterized Queries
const useFilteredUsers = (filters: { status?: string; role?: string }) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: async () => {
      const response = await api.get<User[]>('/users', {
        params: filters,
      });
      return response.data;
    },
    enabled: Object.keys(filters).length > 0,
  });
};

// 7. Prefetching (Improve UX)
const prefetchUser = async (userId: number) => {
  const queryClient = useQueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      const response = await api.get<User>(\`/users/\${userId}\`);
      return response.data;
    },
  });
};

// Usage: Prefetch on hover
<TouchableOpacity 
  onPress={() => navigate(\`/users/\${user.id}\`)}
  onPressIn={() => prefetchUser(user.id)}
>
  <Text>{user.name}</Text>
</TouchableOpacity>`,
  // New Pattern: Query Client Configuration
  queryClientConfig: `// src/config/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed requests 3 times
      refetchOnWindowFocus: false, // Don't refetch on window focus
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
    },
    mutations: {
      // Global mutation handler for meta-based invalidation
      onSettled: (_data, _error, _variables, _context, mutation) => {
        if (mutation.meta?.invalidateQueries) {
          queryClient.invalidateQueries({
            queryKey: mutation.meta.invalidateQueries as readonly unknown[],
          });
        }
      },
    },
  },
});

// Usage in App:
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@template/config/query-client';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}`,

  // New Pattern: Authentication Token Management
  authTokenManagement: `import api from '@template/services/api/api';

// Set auth token (after login)
const login = async (email: string, password: string) => {
  const response = await api.post<{ token: string; user: User }>(
    '/auth/login',
    { email, password },
    { skipAuth: true } // Don't send token for login request
  );
  
  // Store token - it will be automatically included in future requests
  await api.setAuthToken(response.data.token);
  
  return response.data.user;
};

// Clear auth token (on logout)
const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    // Clear token even if logout fails
    await api.clearAuthToken();
  }
};

// Making authenticated requests
const fetchUserProfile = async () => {
  // Token automatically included from storage
  const response = await api.get<User>('/auth/profile');
  return response.data;
};

// Making public requests (skip auth)
const fetchPublicData = async () => {
  const response = await api.get('/public/config', {
    skipAuth: true, // Don't include auth token
  });
  return response.data;
};`,

  // New Pattern: Combining Multiple Queries
  combiningQueries: `// Fetch multiple resources simultaneously
function UserDashboard({ userId }: { userId: number }) {
  const { data: user, isLoading: isLoadingUser } = useUserQuery(userId);
  const { data: posts, isLoading: isLoadingPosts } = usePostsQuery(userId);
  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery(userId);

  const isLoading = isLoadingUser || isLoadingPosts || isLoadingProfile;
  
  if (isLoading) return <ActivityIndicator />;

  return (
    <View>
      <UserInfo user={user} />
      <ProfileStats profile={profile} />
      <PostsList posts={posts} />
    </View>
  );
}

// Dependent Queries (fetch second query based on first)
function UserWithPosts({ userId }: { userId: number }) {
  // First query
  const { data: user } = useUserQuery(userId);
  
  // Second query - only runs after user is fetched
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: async () => {
      const response = await api.get<Post[]>(\`/posts?userId=\${user!.id}\`);
      return response.data;
    },
    enabled: !!user, // Only fetch when user exists
  });

  return <View>{/* render */}</View>;
}`,
};

export default function Test() {
  const [showDocs, setShowDocs] = useState(true);

  return (
    <ScrollView className="flex-1 pt-10 bg-white dark:bg-gray-900">
      <View className="p-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 API Integration Guide
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-6">
          Complete guide to API patterns and best practices in this template
        </Text>

        {/* Documentation Section */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => setShowDocs(!showDocs)}
            className="bg-indigo-500 dark:bg-indigo-600 px-4 py-3 rounded-lg mb-4"
          >
            <Text className="text-white text-center font-semibold">
              {showDocs ? '▼' : '▶'} {showDocs ? 'Hide' : 'Show'} API
              Documentation
            </Text>
          </TouchableOpacity>

          {showDocs && (
            <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              {/* 0. Query Keys Structure */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  📌 Query Keys Structure
                </Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Define hierarchical query keys in{' '}
                  <Text className="font-mono">src/lib/query-keys.ts</Text>
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.queryKeysPattern}
                  </Text>
                </View>
              </View>

              {/* 1. Creating API Service Hooks */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  1️⃣ Creating API Service Hooks
                </Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Create hooks in{' '}
                  <Text className="font-mono">
                    src/services/[feature]/[feature].api.ts
                  </Text>
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.createHooks}
                  </Text>
                </View>
              </View>

              {/* 2. Using Queries */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  2️⃣ Using Queries (GET Requests)
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.usingQueries}
                  </Text>
                </View>
              </View>

              {/* 3. Using Mutations */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  3️⃣ Using Mutations (POST/PUT/DELETE)
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.usingMutations}
                  </Text>
                </View>
              </View>

              {/* 4. Error Handling */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  4️⃣ Error Handling
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.errorHandling}
                  </Text>
                </View>
              </View>

              {/* 5. Query Client Configuration */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  5️⃣ Query Client Configuration
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.queryClientConfig}
                  </Text>
                </View>
              </View>

              {/* 6. Authentication Token Management */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  6️⃣ Authentication Token Management
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.authTokenManagement}
                  </Text>
                </View>
              </View>

              {/* 7. Advanced Patterns */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  7️⃣ Advanced Patterns
                </Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Optimistic updates, pagination, conditional queries, and more
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.advancedPatterns}
                  </Text>
                </View>
              </View>

              {/* 8. Combining Multiple Queries */}
              <View className="mb-4">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  8️⃣ Combining Multiple Queries
                </Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Parallel and dependent queries
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.combiningQueries}
                  </Text>
                </View>
              </View>

              {/* Resources & Tips */}
              <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-3">
                <Text className="text-base font-bold text-blue-900 dark:text-blue-100 mb-2">
                  📚 Resources & Examples
                </Text>
                <Text className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                  •{' '}
                  <Text className="font-mono">
                    src/services/user/user.api.ts
                  </Text>{' '}
                  - Complete API service example
                </Text>
                <Text className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                  •{' '}
                  <Text className="font-mono">
                    src/constants/query-keys.constant.ts
                  </Text>{' '}
                  - Query keys structure
                </Text>
                <Text className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                  •{' '}
                  <Text className="font-mono">src/config/query-client.ts</Text>{' '}
                  - Query client config
                </Text>
                <Text className="text-sm text-blue-800 dark:text-blue-200">
                  • <Text className="font-mono">src/services/api/api.ts</Text> -
                  Core API client
                </Text>
              </View>

              <View className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <Text className="text-base font-bold text-amber-900 dark:text-amber-100 mb-2">
                  💡 Best Practices
                </Text>
                <Text className="text-sm text-amber-800 dark:text-amber-200 mb-1">
                  ✓ Use hierarchical query keys for efficient cache invalidation
                </Text>
                <Text className="text-sm text-amber-800 dark:text-amber-200 mb-1">
                  ✓ Leverage meta invalidation for cleaner mutation code
                </Text>
                <Text className="text-sm text-amber-800 dark:text-amber-200 mb-1">
                  ✓ Group related API hooks in feature-specific files
                </Text>
                <Text className="text-sm text-amber-800 dark:text-amber-200 mb-1">
                  ✓ Handle errors consistently using ApiError type
                </Text>
                <Text className="text-sm text-amber-800 dark:text-amber-200">
                  ✓ Use optimistic updates for better user experience
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
