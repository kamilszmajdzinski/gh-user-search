import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  List,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { fetchUsers } from "../api/users";
import { debounce } from "../utils/debounce";
import { UsersListItem } from "./UsersListItem";

const searchSchema = yup.object({
  searchQuery: yup
    .string()
    .required("Search query is required")
    .min(3, "Search query must be at least 3 characters"),
});

export const UsersList = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(searchSchema),
    defaultValues: {
      searchQuery: "",
    },
  });

  const searchQuery = watch("searchQuery");

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [fetchError, setFetchError] = useState<Error | null>(null);

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((query) => {
        setDebouncedSearchQuery(query as string);
      }, 2000),
    []
  );

  const observerRef = useRef<IntersectionObserver | null>(null);

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["githubUsers", debouncedSearchQuery],
    queryFn: fetchUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: !!debouncedSearchQuery,
  });

  const isEmptyList = data?.pages.every((page) => page.users.length === 0);

  useEffect(() => {
    if (error) {
      setFetchError(error);
    }
  }, [error]);

  useEffect(() => {
    debouncedSetSearchQuery(searchQuery);
  }, [searchQuery, debouncedSetSearchQuery]);

  const handleClearSearch = () => {
    setValue("searchQuery", "");
    setDebouncedSearchQuery("");
    queryClient.removeQueries({ queryKey: ["githubUsers"] });
  };

  const renderTextFieldAndorment = () => {
    if (searchQuery) {
      return (
        <ClearIcon onClick={handleClearSearch} style={{ cursor: "pointer" }} />
      );
    }
    return null;
  };

  const lastItemRef = useCallback(
    (node: Element | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 1 }
      );
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const users = data?.pages.flatMap((page) => page.users) ?? [];

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        alignItems: "center",
        justifyContent: "start",
        padding: 4,
        gap: 4,
        overflow: "hidden",
      }}
    >
      <form
        onSubmit={handleSubmit(() => {})}
        noValidate
        style={{ width: "100%" }}
      >
        <Controller
          name="searchQuery"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="outlined-basic"
              label="Type Github Username"
              variant="outlined"
              sx={{ width: "100%" }}
              onChange={(e) => {
                field.onChange(e);
                setValue("searchQuery", e.target.value);
              }}
              error={!!errors.searchQuery}
              helperText={errors.searchQuery?.message}
              slotProps={{
                input: {
                  endAdornment: renderTextFieldAndorment(),
                },
              }}
            />
          )}
        />
      </form>
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {isLoading && <CircularProgress />}

        {isEmptyList && <Typography>No results found</Typography>}

        <List
          sx={{
            width: "100%",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          {users.map((user, index) => (
            <UsersListItem
              key={user.id}
              user={user}
              itemRef={
                index === users.length - 1
                  ? (lastItemRef as unknown as React.RefObject<HTMLLIElement>)
                  : null
              }
            />
          ))}
        </List>

        <Snackbar
          open={!!fetchError}
          autoHideDuration={3000}
          onClose={() => setFetchError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setFetchError(null)} severity="error">
            {fetchError?.message || "Something went wrong"}
          </Alert>
        </Snackbar>

        {isFetchingNextPage && (
          <CircularProgress
            sx={{
              marginTop: "20px",
              position: "absolute",
              bottom: 20,
            }}
          />
        )}
      </Box>
    </Container>
  );
};
