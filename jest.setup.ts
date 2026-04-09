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

jest.mock('expo-widgets', () => ({
          createWidget: jest.fn().mockImplementation(() => {
                      const comp = () => null;
                      comp.updateSnapshot = jest.fn();
                      return comp;
          }),
}));

jest.mock('@expo/ui/swift-ui', () => ({
          VStack: jest.fn(),
          HStack: jest.fn(),
          Text: jest.fn(),
          Spacer: jest.fn(),
}));

jest.mock('@expo/ui/swift-ui/modifiers', () => ({
          padding: jest.fn(),
          background: jest.fn(),
          foregroundStyle: jest.fn(),
          font: jest.fn(),
          cornerRadius: jest.fn(),
          frame: jest.fn(),
}));

jest.mock('expo-modules-core', () => ({
          requireNativeModule: jest.fn().mockReturnValue({}),
}));
