import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherProvider } from '../../context/WeatherContext';
import { ThemeProvider } from '../../context/ThemeContext';
import WeatherApp from './WeatherApp';

// Mock the hooks and context
jest.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value) => value
}));

jest.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: (key, initialValue) => [initialValue, jest.fn()]
}));

// Mock the WeatherContext
const mockWeatherContext = {
  weatherData: null,
  loading: false,
  error: null,
  recentSearches: [],
  fetchWeather: jest.fn(),
};

const mockThemeContext = {
  isDarkMode: false,
  toggleTheme: jest.fn(),
};

// Wrapper component with providers
const AllTheProviders = ({ children }) => (
  <ThemeProvider value={mockThemeContext}>
    <WeatherProvider value={mockWeatherContext}>
      {children}
    </WeatherProvider>
  </ThemeProvider>
);

describe('WeatherApp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the WeatherApp component', () => {
    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    // Check if main elements are rendered
    expect(screen.getByText(/Weather Forecast/i)).toBeInTheDocument();
    expect(screen.getByText(/Good (morning|afternoon|evening)!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter city name/i)).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    const themeToggle = screen.getByText(/Light Mode|Dark Mode/i);
    expect(themeToggle).toBeInTheDocument();
  });

  test('renders search input field', () => {
    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    const searchInput = screen.getByPlaceholderText(/Enter city name/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders example cities when no search is made', () => {
    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    expect(screen.getByText(/Welcome to Weather Forecast/i)).toBeInTheDocument();
    expect(screen.getByText(/Try these examples:/i)).toBeInTheDocument();
    
    // Check for example cities
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
  });

  test('updates search query on input change', () => {
    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    const searchInput = screen.getByPlaceholderText(/Enter city name/i);
    fireEvent.change(searchInput, { target: { value: 'London' } });
    
    expect(searchInput.value).toBe('London');
  });

  test('calls fetchWeather when search button is clicked', () => {
    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    const searchInput = screen.getByPlaceholderText(/Enter city name/i);
    const searchButton = screen.getByText(/Search/i);
    
    fireEvent.change(searchInput, { target: { value: 'London' } });
    fireEvent.click(searchButton);
    
    expect(mockWeatherContext.fetchWeather).toHaveBeenCalledWith('London');
  });

  test('shows loading spinner when loading is true', () => {
    const loadingContext = {
      ...mockWeatherContext,
      loading: true,
    };
    
    render(
      <ThemeProvider value={mockThemeContext}>
        <WeatherProvider value={loadingContext}>
          <WeatherApp />
        </WeatherProvider>
      </ThemeProvider>
    );
    
    expect(screen.getByText(/Fetching weather data/i)).toBeInTheDocument();
  });

  test('shows error message when error exists', () => {
    const errorContext = {
      ...mockWeatherContext,
      error: 'City not found',
    };
    
    render(
      <ThemeProvider value={mockThemeContext}>
        <WeatherProvider value={errorContext}>
          <WeatherApp />
        </WeatherProvider>
      </ThemeProvider>
    );
    
    expect(screen.getByText(/City not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
  });

  test('renders weather data when available', () => {
    const weatherContext = {
      ...mockWeatherContext,
      weatherData: {
        name: 'London',
        sys: { country: 'GB' },
        coord: { lat: 51.5074, lon: -0.1278 },
        dt: Date.now() / 1000,
        main: {
          temp: 15,
          feels_like: 14,
          humidity: 65,
          pressure: 1015,
        },
        weather: [{ description: 'clear sky', icon: '01d' }],
        wind: { speed: 3.6 },
        visibility: 10000,
        clouds: { all: 0 },
      },
    };
    
    render(
      <ThemeProvider value={mockThemeContext}>
        <WeatherProvider value={weatherContext}>
          <WeatherApp />
        </WeatherProvider>
      </ThemeProvider>
    );
    
    expect(screen.getByText(/London, GB/i)).toBeInTheDocument();
    expect(screen.getByText(/15°C/i)).toBeInTheDocument();
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    expect(screen.getByText(/Feels Like/i)).toBeInTheDocument();
  });

  test('handles clicking on example cities', () => {
    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    const londonButton = screen.getByText('London');
    fireEvent.click(londonButton);
    
    expect(mockWeatherContext.fetchWeather).toHaveBeenCalledWith('London');
  });

  test('toggles theme when theme button is clicked', () => {
    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    const themeButton = screen.getByText(/Light Mode/i);
    fireEvent.click(themeButton);
    
    expect(mockThemeContext.toggleTheme).toHaveBeenCalled();
  });

  test('renders recent searches section when searches exist', () => {
    const recentContext = {
      ...mockWeatherContext,
      recentSearches: ['London', 'Paris'],
    };
    
    render(
      <ThemeProvider value={mockThemeContext}>
        <WeatherProvider value={recentContext}>
          <WeatherApp />
        </WeatherProvider>
      </ThemeProvider>
    );
    
    expect(screen.getByText(/Recent Searches/i)).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });
});

// Test for API integration
describe('WeatherApp API Integration', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('handles successful API response', async () => {
    const mockWeatherData = {
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 15 },
      weather: [{ description: 'clear sky' }],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    });

    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test('handles API error response', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<WeatherApp />, { wrapper: AllTheProviders });
    
    await waitFor(() => {
      expect(screen.queryByText(/Network error/i)).not.toBeInTheDocument();
    });
  });
});