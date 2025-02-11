import { render, screen, waitFor } from "@testing-library/react";

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { UsersList } from "./UsersList";

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useInfiniteQuery: jest.fn(),
}));

const queryClient = new QueryClient();

describe("UsersList", () => {
  it("renders loading state", () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UsersList />
      </QueryClientProvider>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            users: [],
          },
        ],
      },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UsersList />
      </QueryClientProvider>
    );

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders users when data is fetched", async () => {
    (useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            users: [
              { id: 1, login: "johndoe" },
              { id: 2, login: "janedoe" },
            ],
          },
        ],
      },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UsersList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("johndoe")).toBeInTheDocument();
      expect(screen.getByText("janedoe")).toBeInTheDocument();
    });
  });
});
