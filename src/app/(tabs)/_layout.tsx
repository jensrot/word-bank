import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#1e1e1e',
                    borderBottomColor: 'rgb(39, 39, 41)',
                },
                headerTitleStyle: {
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 25,
                },
                headerTitleAlign: 'center',
                tabBarStyle: {
                    backgroundColor: '#1e1e1e',
                    borderTopColor: 'rgb(39, 39, 41)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarActiveTintColor: 'white',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "All Books",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="saved-books"
                options={{
                    title: "Saved Books",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="export-books"
                options={{
                    title: "Export Books",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="share" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
