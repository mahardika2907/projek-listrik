import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.alert and window.confirm
Object.defineProperty(window, 'alert', {
  value: vi.fn(),
});

Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
});

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});