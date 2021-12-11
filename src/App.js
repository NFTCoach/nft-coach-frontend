import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import { Landing } from "pages/Landing";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Marketplace from "pages/Marketplace";
import { useDispatch } from "react-redux";
import Game from "pages/Game";
import { MyTeam } from "pages/Game/MyTeam";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}>
            {/*  <Route path=":teamId" element={<Team />} /> */}
          </Route>
          <Route path="/market" element={<Marketplace />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game/team" element={<MyTeam />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
