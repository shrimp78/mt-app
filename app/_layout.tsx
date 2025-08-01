import 'react-native-gesture-handler';
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GroupProvider } from '@context/GroupContext';
import { AuthProvider } from '@context/AuthContext';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <AuthProvider>
          <GroupProvider>
            <Stack
              screenOptions={{
                headerTintColor: '#000000',
                headerStyle: { backgroundColor: '#F9F9F9' }
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />

              {/* ホーム */}
              <Stack.Screen name="home/index" options={{ headerTitle: '' }} />

              {/* アイテム */}
              <Stack.Screen name="items/[id]" options={{ headerTitle: '' }} />

              {/* グループ */}
              <Stack.Screen name="groups/index" options={{ headerTitle: '' }} />
              <Stack.Screen name="groups/[id]" options={{ headerTitle: '' }} />
            </Stack>
          </GroupProvider>
        </AuthProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
