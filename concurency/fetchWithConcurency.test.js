import { fetchWithConcurrency } from './fetchWithConcurrency.js';

describe('fetchWithConcurrency', () => {
  const mockUrls = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/posts/2',
  'https://jsonplaceholder.typicode.com/posts/3',
  'https://jsonplaceholder.typicode.com/posts/4'
  ];

  beforeAll(() => {
    global.fetch = jest.fn((url) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            text: () => Promise.resolve(`Response from ${url}`)
          });
        }, 100); // simulate network delay
      })
    );
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should fetch all URLs with respect to max concurrency', async () => {
    const maxConcurrency = 2;
    const responses = await fetchWithConcurrency(mockUrls, maxConcurrency);

    expect(responses).toHaveLength(mockUrls.length);
    responses.forEach((res, i) => {
      expect(res).toBe(`Response from ${mockUrls[i]}`);
    });
    expect(global.fetch).toHaveBeenCalledTimes(mockUrls.length);
  });

  it('should not exceed the concurrency limit', async () => {
    const maxConcurrency = 2;
    let currentConcurrent = 0;
    let maxObservedConcurrent = 0;

    global.fetch = jest.fn((url) => {
      currentConcurrent++;
      if (currentConcurrent > maxObservedConcurrent) {
        maxObservedConcurrent = currentConcurrent;
      }

      return new Promise((resolve) =>
        setTimeout(() => {
          currentConcurrent--;
          resolve({
            text: () => Promise.resolve(`Response from ${url}`)
          });
        }, 100)
      );
    });

    await fetchWithConcurrency(mockUrls, maxConcurrency);
    expect(maxObservedConcurrent).toBeLessThanOrEqual(maxConcurrency);
  });
});
