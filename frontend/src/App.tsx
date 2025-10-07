import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import type { JSX } from "react";
import Upload from "./pages/Upload/Upload";
import Weight from "./pages/Weight/Weight";
import Macros from "./pages/Macros/Macros";
import Workouts from "./pages/Workouts/Workouts";
import Investments from "./pages/Investments/Investments";
import Home from "./pages/Home/Home";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/weight" element={<Weight />} />
          <Route path="/macros" element={<Macros />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/investments" element={<Investments />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
