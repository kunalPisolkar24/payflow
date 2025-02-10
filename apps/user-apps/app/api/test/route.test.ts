import { describe, it, expect } from 'vitest';
import { GET } from './route'; 

describe('Testing the test endpoint', () => {
  it('should return a successful response with the expected message', async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({ message: 'API route test successful!' });
  });
});
