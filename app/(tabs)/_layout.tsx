import { Tabs } from 'expo-router';

import { Colors } from '@template/styles/theme';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home/index"
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="test/index"
        options={{
          title: 'Test',
        }}
      />
    </Tabs>
  );
}
