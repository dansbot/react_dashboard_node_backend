import { Typography, Box, useTheme, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const Header = ({ title, subtitle, icon, path }) => {
  const navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  var titleStack = [
    <Typography
      variant="h2"
      color={colors.grey[100]}
      fontWeight="bold"
      sx={{ m: "0 0 5px 0" }}
      key="1"
    >
      {title}
    </Typography>,
  ];
  if (icon != null) {
    if (icon === "AddIcon") {
      titleStack.push(
        <Tooltip title="Add team member" key="2">
          <IconButton
            color="inherit"
            sx={{ fontSize: "32px" }}
            onClick={() => {
              routeChange(path);
            }}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      );
    }
  }

  return (
    <Box mb="30px">
      <Stack direction="row" justifyContent="space-between">
        {titleStack}
      </Stack>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
