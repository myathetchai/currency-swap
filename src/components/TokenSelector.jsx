import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { tokenData } from "../assets/tokenData";

const tokens = tokenData.map((token) => ({
  ...token,
  icon: `/tokens/${token.symbol}.svg`,
}));

const TokenSelector = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState("");

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle>
        Select a Token
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tokens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List>
          {filteredTokens.map((token) => (
            <ListItem button key={token.symbol} onClick={() => onSelect(token)}>
              <ListItemAvatar>
                <Avatar src={token.icon} alt={token.name} />
              </ListItemAvatar>
              <ListItemText primary={token.name} secondary={token.symbol} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

TokenSelector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TokenSelector;
