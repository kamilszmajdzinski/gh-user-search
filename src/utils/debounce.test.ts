import { debounce } from "./debounce";

jest.useFakeTimers();

describe("debounce", () => {
  let mockFn: jest.Mock;

  beforeEach(() => {
    mockFn = jest.fn();
  });

  it("calls the debounced function only once after delay", () => {
    const debouncedFn = debounce(mockFn, 2000);

    debouncedFn("first invoke");
    debouncedFn("second invoke");

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("second invoke");
  });

  it("clears previous call if function is called within delay", () => {
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn("first invoke");
    jest.advanceTimersByTime(200);
    debouncedFn("second invoke");
    jest.advanceTimersByTime(200);
    debouncedFn("third invoke");

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("third invoke");
  });
});
