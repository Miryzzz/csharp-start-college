import { describe, expect, it, vi } from 'vitest';
import { runCsharp } from './labEngine';

describe('runCsharp', () => {
  it('sends arbitrary C# source to the sandbox and returns stdout', async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe('/api/run-csharp');
      expect(init?.method).toBe('POST');
      expect(JSON.parse(String(init?.body))).toEqual({ code: 'for (var i = 0; i < 3; i++) Console.WriteLine(i);', stdin: '' });
      return new Response(JSON.stringify({ ok: true, output: '0\n1\n2' }), { status: 200 });
    });

    await expect(runCsharp('for (var i = 0; i < 3; i++) Console.WriteLine(i);', fetcher)).resolves.toEqual({
      ok: true,
      output: '0\n1\n2',
    });
  });

  it('returns compiler diagnostics when the sandbox rejects the code', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ ok: false, error: 'error CS1002: ; expected' }), { status: 200 }));

    await expect(runCsharp('Console.WriteLine("oops")', fetcher)).resolves.toEqual({
      ok: false,
      output: '',
      error: 'error CS1002: ; expected',
    });
  });

  it('rejects empty source before making a request', async () => {
    const fetcher = vi.fn();

    await expect(runCsharp('  \n', fetcher)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/код/i) });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
