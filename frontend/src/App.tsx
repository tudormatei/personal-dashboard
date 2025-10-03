import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import type { JSX } from "react";
import Home from "./pages/Home/Home";
import Weight from "./pages/Weight/Weight";
import Macros from "./pages/Macros/Macros";
import Workouts from "./pages/Workouts/Workouts";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weight" element={<Weight />} />
          <Route path="/macros" element={<Macros />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
