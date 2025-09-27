const { handler } = require('./index');

// Mock pg client
const mockQuery = jest.fn();
const mockConnect = jest.fn();
const mockEnd = jest.fn();

jest.mock('pg', () => ({
  Client: jest.fn(() => ({
    connect: mockConnect,
    query: mockQuery,
    end: mockEnd
  }))
}));

// Mock fetch
global.fetch = jest.fn();

describe('Lambda Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DATABASE_URL = 'test-db-url';
    process.env.CRIPTOYA_API_BASE_URL = 'https://test-api.com';
  });

  test('should insert FX rates successfully', async () => {
    const mockFxRates = {
      mep: { al30: { ci: { ask: 1000, bid: 950 } } },
      cripto: { usdt: { ask: 1200, bid: 1150 } }
    };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockFxRates)
    });

    const result = await handler({}, {});

    expect(result.statusCode).toBe(200);
    expect(mockConnect).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockEnd).toHaveBeenCalled();
  });

  test('should handle API error', async () => {
    fetch.mockRejectedValue(new Error('API Error'));

    const result = await handler({}, {});

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe('API Error');
  });
});