import "../Css/home.css";
import ShowBoards from "../Componants/ShowBoards";
import "react-loading-skeleton/dist/skeleton.css";

export default function Home() {
  return (
    <div className="container">
      <ShowBoards />
    </div>
  );
}
