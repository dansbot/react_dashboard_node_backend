import { useNavigate } from "react-router-dom";

function Redirect(path) {
  const navigate = useNavigate();
  return navigate(path);
}

export { Redirect };
