import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Landing } from "./pages";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}>
            {/*  <Route path=":teamId" element={<Team />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
