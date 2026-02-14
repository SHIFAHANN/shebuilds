import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { UserProvider } from './context/UserContext';
import Welcome from './pages/Welcome';
import TopicList from './pages/TopicList';
import Chat from './pages/Chat';

import { TopicProvider } from './context/TopicContext';
import CreateTopic from './pages/CreateTopic';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        <Route path="/topics" element={<TopicList />} />
        <Route path="/create-topic" element={<CreateTopic />} />
        <Route path="/chat/:topicId" element={<Chat />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <UserProvider>
      <TopicProvider>
        <BrowserRouter>
          <div className="bg-brand-dark min-h-screen text-slate-200 selection:bg-accent-primary/30 selection:text-white">
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </TopicProvider>
    </UserProvider>
  );
}

export default App;
