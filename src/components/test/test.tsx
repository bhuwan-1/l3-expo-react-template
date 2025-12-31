import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Code snippets for documentation
const CODE_SNIPPETS = {
  createHooks: `import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@template/services/api/api';
import { User, CreateUserPayload } from '@template/models/user.model';

// Query Hook (GET request)
export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/users');
      return response.data;
    },
  });
};

// Mutation Hook (POST/PUT/DELETE)
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      const response = await api.post<User>('/users', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate cache to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};`,

  usingQueries: `import { useUsersQuery, useUserQuery } from '@template/services/user/user.api';

function MyComponent() {
  // Fetch list of users
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useUsersQuery();

  // Fetch single user (with conditional fetching)
  const {
    data: user,
    isLoading: isLoadingUser,
  } = useUserQuery(userId, {
    enabled: !!userId, // Only fetch if userId exists
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {users?.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}`,

  usingMutations: `import { useCreateUserMutation } from '@template/services/user/user.api';

function CreateUserForm() {
  const { mutateAsync: createUser, isPending } = useCreateUserMutation();

  const handleSubmit = async () => {
    try {
      const newUser = await createUser({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
      });
      Alert.alert('Success', 'User created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create user');
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSubmit}
      disabled={isPending}
    >
      {isPending ? (
        <ActivityIndicator />
      ) : (
        <Text>Create User</Text>
      )}
    </TouchableOpacity>
  );
}`,

  directApiCalls: `import api from '@template/services/api/api';

// GET request
const fetchData = async () => {
  try {
    const response = await api.get<User[]>('/users', {
      params: { page: 1, limit: 10 },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST request
const createData = async () => {
  try {
    const response = await api.post<User>('/users', {
      name: 'John',
      email: 'john@example.com',
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// PUT request
const updateData = async (id: number) => {
  try {
    const response = await api.put<User>(\`/users/\${id}\`, {
      name: 'Updated Name',
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// DELETE request
const deleteData = async (id: number) => {
  try {
    await api.delete(\`/users/\${id}\`);
  } catch (error) {
    console.error('Error:', error);
  }
};`,

  errorHandling: `// In queries
const { data, error, isError } = useUsersQuery();

if (isError) {
  return (
    <View>
      <Text>Error: {error?.message}</Text>
      {error?.status && (
        <Text>Status: {error.status}</Text>
      )}
    </View>
  );
}

// In mutations
const { mutateAsync, isError, error } = useCreateUserMutation();

const handleSubmit = async () => {
  try {
    await mutateAsync(data);
  } catch (err) {
    if (err.status === 400) {
      Alert.alert('Validation Error', 'Please check your input');
    } else if (err.status === 401) {
      Alert.alert('Unauthorized', 'Please login again');
    } else {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  }
};`,

  advancedPatterns: `// Conditional queries
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => api.get(\`/users/\${userId}\`),
  enabled: !!userId && isAuthenticated, // Only fetch when conditions met
});

// Optimistic updates
const { mutate } = useUpdateUserMutation();

mutate(
  { id: 1, name: 'New Name' },
  {
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users']);
      
      // Optimistically update
      queryClient.setQueryData(['users'], (old: User[]) =>
        old.map(user => user.id === newData.id 
          ? { ...user, ...newData } 
          : user
        )
      );
      
      return { previousUsers };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context.previousUsers);
    },
  }
);

// Pagination
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['users'],
  queryFn: ({ pageParam = 1 }) => 
    api.get(\`/users?page=\${pageParam}\`),
  getNextPageParam: (lastPage, pages) => 
    lastPage.hasMore ? pages.length + 1 : undefined,
});`,
};

export default function Test() {
  const [showDocs, setShowDocs] = useState(true);

  return (
    <ScrollView className="flex-1 pt-10 bg-white dark:bg-gray-900">
      <View className="p-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          API Usage Examples
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
              {/* 1. Creating API Service Hooks */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  1. Creating API Service Hooks
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
                  2. Using Queries (GET Requests)
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
                  3. Using Mutations (POST/PUT/DELETE)
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
                  4. Error Handling
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.errorHandling}
                  </Text>
                </View>
              </View>

              {/* 5. Advanced Patterns */}
              <View className="mb-4">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  5. Advanced Patterns
                </Text>
                <View className="bg-gray-900 dark:bg-black p-4 rounded-lg mb-2">
                  <Text className="text-xs text-green-400 font-mono">
                    {CODE_SNIPPETS.advancedPatterns}
                  </Text>
                </View>
              </View>

              <View className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <Text className="text-sm text-blue-800 dark:text-blue-200">
                  💡 Tip: Check{' '}
                  <Text className="font-mono">
                    src/services/user/user.api.ts
                  </Text>{' '}
                  for complete examples
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
