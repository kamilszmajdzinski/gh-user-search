// functional programming - currying

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
