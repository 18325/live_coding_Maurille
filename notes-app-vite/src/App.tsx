import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { useAuth } from './hooks/useAuth';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import NotesList from './components/Notes/NotesList';
import NoteEditor from './components/Notes/NoteEditor';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar>
          <NotesList />
        </Sidebar>
        <main className="flex-1 overflow-hidden">
          <NoteEditor />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </AuthProvider>
  );
};

export default App;
