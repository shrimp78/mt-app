import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <GluestackUIProvider config={config}>
      <Stack
        screenOptions={{
          headerTintColor: '#000000',
          headerStyle: { backgroundColor: '#F9F9F9' }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* ホーム */}
        <Stack.Screen name="home/index" options={{ headerTitle: 'ホーム' }} />

        {/* アイテム */}
        <Stack.Screen name="items/index" options={{ headerTitle: '' }} />
        <Stack.Screen
          name="items/create"
          options={{ headerTitle: '新規作成' }}
        />
        <Stack.Screen name="items/[id]" options={{ headerTitle: '' }} />
      </Stack>
    </GluestackUIProvider>
  );
}
