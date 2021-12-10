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


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  useEffect(() => {
    async function fetchData() {
      const res = await window.ethereum.request({ method: 'eth_accounts' });
      //console.log(res);
      if (res.length > 0){ // user is signed in

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        console.log(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        
        const address = await signer.getAddress();
        console.log(address);

        dispatch(setAccountData({
          address, provider, signer, isSignedIn: true
        }))
      }
    }
    fetchData()
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}>
            {/*  <Route path=":teamId" element={<Team />} /> */}
          </Route>
          <Route path="/market" element={<Marketplace />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
