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
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  return (
    <DndProvider backend={HTML5Backend}>
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
      <ToastContainer theme="dark" />
    </DndProvider>
  );
}

export default App;
