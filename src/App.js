import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import { Landing } from "pages/Landing";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Marketplace from "pages/Marketplace";
import { useSelector } from "react-redux";
import Game from "pages/Game";
import { MyTeam } from "pages/Game/MyTeam";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PATHS } from "common/constants/paths";
import { Tournaments } from "pages/Game/Tournaments";
import CreateTeam from "pages/Game/CreateTeam";
import TrainingMatch from "pages/Game/TrainingMatch";
import { checkIfRightNetwork } from "common/utils/checkIfRightNetwork";

function App() {
  useEffect(() => {
    const checkNetwork = async () => {
      await checkIfRightNetwork();
    };
    checkNetwork();

    AOS.init({
      duration: 1000,
    });
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter basename={process.env.NODE_ENV === "development" ? undefined : "https://nftcoach.github.io/nft-coach-frontend"}>
        <Routes>
          <Route path={PATHS.landing} element={<Landing />}>
            {/*  <Route path=":teamId" element={<Team />} /> */}
          </Route>
          <Route path={PATHS.market} element={<Marketplace />} />
          <Route path={PATHS.game} element={<Game />} />
          <Route path={PATHS.team} element={<MyTeam />} />
          <Route path={PATHS.tournaments} element={<Tournaments />} />
          <Route path={PATHS.create_team} element={<CreateTeam />} />
          <Route path={PATHS.training} element={<TrainingMatch />} />
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
