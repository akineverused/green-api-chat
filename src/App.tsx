import { useState } from 'react';
import type { GreenApiCredentials } from './types/green-api';
import { AuthForm } from './components/AuthForm/AuthForm';
import { ChatWindow } from './components/ChatWindow/ChatWindow';

function App() {
    const [credentials, setCredentials] = useState<GreenApiCredentials | null>(null);

    const handleLogout = () => {
        setCredentials(null);
    };

    if (!credentials) {
        return <AuthForm onLogin={setCredentials} />;
    }

    return <ChatWindow credentials={credentials} onLogout={handleLogout} />;
}

export default App;