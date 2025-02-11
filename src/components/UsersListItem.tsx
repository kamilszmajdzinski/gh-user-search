import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import { GithubUser } from "../types/users";

export const UsersListItem = ({
  user,
  itemRef,
}: {
  user: GithubUser;
  itemRef: React.RefObject<HTMLLIElement> | null;
}) => {
  return (
    <ListItem ref={itemRef} sx={{ borderBottom: "1px solid #ddd" }}>
      <ListItemAvatar>
        <Avatar src={user.avatar_url} alt={user.login} />
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="h6">{user.login}</Typography>}
        secondary={
          <a href={user.html_url} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
        }
      />
    </ListItem>
  );
};
