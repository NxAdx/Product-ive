import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    notificationAsync: jest.fn(),
    selectionAsync: jest.fn(),
    ImpactFeedbackStyle: {
          Light: 'light',
          Medium: 'medium',
    },
    NotificationFeedbackType: {
          Success: 'success',
    },
}));

jest.mock('expo-sqlite', () => ({
    openDatabaseAsync: jest.fn().mockResolvedValue({
          execAsync: jest.fn().mockResolvedValue(undefined),
          getFirstAsync: jest.fn().mockResolvedValue({ user_version: 1 }),
          runAsync: jest.fn().mockResolvedValue({ changes: 1 }),
          withExclusiveTransactionAsync: jest.fn().mockImplementation(async (cb: any) => {
                  await cb({
                            runAsync: jest.fn().mockResolvedValue({ changes: 1 }),
                  });
          }),
          closeAsync: jest.fn().mockResolvedValue(undefined),
    }),
}));

beforeEach(async () => {
    await mockAsyncStorage.clear();
});

jest.mock('expo-widgets', () => ({}));
jest.mock('@expo/ui/swift-ui', () => ({}));

