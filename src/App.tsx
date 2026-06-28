import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { FootballBingoPage } from "./games/bingo/FootballBingoPage";
import { ConnectionsPage } from "./games/connections/ConnectionsPage";
import { SnippetGuessPage } from "./games/music/SnippetGuessPage";
import { TuneGridPage } from "./games/music/TuneGridPage";
import { WordlePage } from "./games/wordle/WordlePage";
import { About } from "./pages/About";
import { AppDetail } from "./pages/AppDetail";
import { Apps } from "./pages/Apps";
import { Contact } from "./pages/Contact";
import { Games } from "./pages/Games";
import { Home } from "./pages/Home";
import { Roadmap } from "./pages/Roadmap";

export default function App() {
  const location = useLocation();

  return (
    <div className="brand-shell min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/:slug" element={<AppDetail />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/wordle" element={<WordlePage />} />
          <Route path="/games/connections" element={<ConnectionsPage />} />
          <Route path="/games/bingo" element={<FootballBingoPage />} />
          <Route path="/games/tune-grid" element={<TuneGridPage />} />
          <Route path="/games/song-snippet" element={<SnippetGuessPage />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
