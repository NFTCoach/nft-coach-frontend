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
import { PATHS } from "common/constants/paths";
import { Tournaments } from "pages/Game/Tournaments";

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
          <Route path={PATHS.landing} element={<Landing />}>
            {/*  <Route path=":teamId" element={<Team />} /> */}
          </Route>
          <Route path={PATHS.market} element={<Marketplace />} />
          <Route path={PATHS.game} element={<Game />} />
          <Route path={PATHS.team} element={<MyTeam />} />
          <Route path={PATHS.tournaments} element={<Tournaments />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        draggable={true}
        hideProgressBar={false}
        theme="dark"
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </DndProvider>
  );
}

export default App;
