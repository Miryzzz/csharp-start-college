export interface LabResult {
  ok: boolean;
  output: string;
  error?: string;
}

export interface RunnerResponse {
  ok: boolean;
  output?: string;
  error?: string;
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function runCsharp(source: string, fetcher: Fetcher = fetch, stdin = ''): Promise<LabResult> {
  if (!source.trim()) {
    return { ok: false, output: '', error: 'Введите код перед запуском.' };
  }

  try {
    const response = await fetcher('/api/run-csharp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: source, stdin }),
    });
    const payload = await response.json() as RunnerResponse;
    if (!response.ok) {
      return { ok: false, output: '', error: payload.error || 'Сервис компиляции временно недоступен.' };
    }
    return {
      ok: payload.ok,
      output: payload.output || '',
      ...(payload.error ? { error: payload.error } : {}),
    };
  } catch {
    return { ok: false, output: '', error: 'Не удалось связаться с компилятором. Проверьте интернет и попробуйте ещё раз.' };
  }
}
