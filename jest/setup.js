import { jest } from '@jest/globals';
// Include this line ff you're using @react-navigation/stack
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
