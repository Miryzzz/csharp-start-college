type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (payload: unknown) => void;
};

const JUDGE0_ENDPOINT = 'https://ce.judge0.com/submissions?base64_encoded=false&wait=true';
const MAX_SOURCE_LENGTH = 20000;
const MAX_STDIN_LENGTH = 5000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Используйте POST для запуска кода.' });
  }

  let body: { code?: unknown; stdin?: unknown };
  try {
    body = typeof req.body === 'string'
      ? JSON.parse(req.body) as { code?: unknown; stdin?: unknown }
      : req.body as { code?: unknown; stdin?: unknown };
  } catch {
    return res.status(400).json({ ok: false, error: 'Некорректный JSON-запрос.' });
  }
  const code = typeof body?.code === 'string' ? body.code : '';
  const stdin = typeof body?.stdin === 'string' ? body.stdin : '';
  if (!code.trim()) return res.status(400).json({ ok: false, error: 'Введите код перед запуском.' });
  if (code.length > MAX_SOURCE_LENGTH) return res.status(400).json({ ok: false, error: `Код не должен быть длиннее ${MAX_SOURCE_LENGTH} символов.` });
  if (stdin.length > MAX_STDIN_LENGTH) return res.status(400).json({ ok: false, error: `Ввод не должен быть длиннее ${MAX_STDIN_LENGTH} символов.` });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const runnerResponse = await fetch(JUDGE0_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ language_id: 51, source_code: code, stdin }),
      signal: controller.signal,
    });
    const payload = await runnerResponse.json() as {
      stdout?: string | null;
      stderr?: string | null;
      compile_output?: string | null;
      message?: string | null;
      status?: { id?: number; description?: string };
    };
    if (!runnerResponse.ok || !payload.status) {
      return res.status(502).json({ ok: false, error: payload.message || 'Сервис компиляции вернул ошибку.' });
    }
    const output = payload.stdout || '';
    const error = payload.compile_output || payload.stderr || payload.message || '';
    return res.status(200).json({ ok: payload.status.id === 3, output, ...(error ? { error } : {}) });
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError'
      ? 'Программа выполнялась слишком долго (лимит — 15 секунд).'
      : 'Сервис компиляции временно недоступен.';
    return res.status(504).json({ ok: false, error: message });
  } finally {
    clearTimeout(timeout);
  }
}
