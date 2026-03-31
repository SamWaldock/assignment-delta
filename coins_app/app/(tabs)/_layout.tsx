import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Coins',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bitcoin" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
