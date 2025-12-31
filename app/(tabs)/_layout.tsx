import { faFile } from '@fortawesome/pro-regular-svg-icons/faFile';
import { faHouse } from '@fortawesome/pro-regular-svg-icons/faHouse';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Colors } from '@template/styles/theme';
import { Tabs } from 'expo-router';

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
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faHouse}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="test/index"
        options={{
          title: 'Test',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faFile}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
