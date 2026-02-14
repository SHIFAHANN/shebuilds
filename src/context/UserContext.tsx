import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simplified User interface since we aren't using Firebase Auth anymore
export interface User {
    uid: string;
    displayName: string | null;
}

interface UserContextType {
    user: User | null;
    nickname: string;
    setNickname: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [nickname, setNickname] = useState<string>(() => {
        return localStorage.getItem('chat_nickname') || '';
    });

    useEffect(() => {
        /*
          User requested to identify based on IP address without authentication.
          We will fetch the IP and use it as the UID.
        */
        const fetchIpAndSignIn = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                const ip = data.ip;

                // Set the user with IP as UID
                setUser({
                    uid: ip,
                    displayName: nickname || ip // Use IP as default name
                });

                console.log("User identified by IP:", ip);
            } catch (error) {
                console.error("Failed to fetch IP, falling back to random ID", error);
                // Fallback to a random ID if IP fetch fails (e.g. adblocker)
                let storedId = localStorage.getItem('anon_user_id');
                if (!storedId) {
                    storedId = 'anon_' + Math.random().toString(36).substr(2, 9);
                    localStorage.setItem('anon_user_id', storedId);
                }
                setUser({
                    uid: storedId,
                    displayName: nickname || storedId // Use ID as default name
                });
            }
        };

        fetchIpAndSignIn();
    }, []); // Run once on mount

    // Update user object when nickname changes
    useEffect(() => {
        if (user) {
            setUser(prev => prev ? { ...prev, displayName: nickname || prev.uid } : null);
        }
    }, [nickname]);

    const handleSetNickname = (name: string) => {
        setNickname(name);
        localStorage.setItem('chat_nickname', name);
    };

    return (
        <UserContext.Provider value={{ user, nickname, setNickname: handleSetNickname }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
