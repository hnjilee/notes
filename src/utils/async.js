// API가 너무 빠르면 로딩 UI가 깜빡이거나 실패 후 재시도 시 무반응처럼 보이는 문제 개선 위해
// 최소 로딩 시간 유지 목적의 유틸 함수 추가
export async function runWithMinDelay(fn, minDelayMs = 300) {
  const start = Date.now();

  try {
    const result = await fn();
    return result;
  } finally {
    const elapsed = Date.now() - start;
    const remaining = minDelayMs - elapsed;
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }
  }
}
