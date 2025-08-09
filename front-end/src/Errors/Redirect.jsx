import { useNavigate } from "react-router-dom";

export default function Redirect() {
  const nav = useNavigate();
  const redirectToBoards = () => {
    nav("/");
  };
  redirectToBoards();
  return <div></div>;
}
