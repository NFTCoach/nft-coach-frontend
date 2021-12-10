import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Landing } from "pages/Landing";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Marketplace from "pages/Marketplace";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { setAccountData } from "store/reducers/account";
import Game from "pages/Game";


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
          <Route path="/market" element={<Marketplace />}></Route>
          <Route path="/game" element={<Game />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
