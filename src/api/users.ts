import { GithubUserSearchResponse } from "../types/users";

export const fetchUsers = async ({
  queryKey,
  pageParam = 1,
}: {
  queryKey: string[];
  pageParam: number;
}) => {
  const [, searchQuery] = queryKey;
  if (!searchQuery) return { users: [], nextPage: null };

  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${searchQuery}&page=${pageParam}&per_page=20`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data");
    }

    const data: GithubUserSearchResponse = await response.json();
    return {
      users: data.items,
      nextPage: data.items.length === 20 ? pageParam + 1 : null,
    };
  } catch (error) {
    console.error("Fetch Error:", error);

    throw error;
  }
};
