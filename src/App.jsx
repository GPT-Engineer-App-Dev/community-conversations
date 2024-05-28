import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import { SupabaseProvider } from "./integrations/supabase/index.js";

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Index />} />
        </Routes>
      </Router>
    </SupabaseProvider>
  );
}

export default App;
