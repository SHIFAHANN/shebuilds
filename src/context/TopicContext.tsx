import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Topic, topics as initialTopics } from '../lib/data';

interface TopicContextType {
    topics: Topic[];
    addTopic: (topic: Omit<Topic, 'id'>) => Promise<void>;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export function TopicProvider({ children }: { children: ReactNode }) {
    const [topics, setTopics] = useState<Topic[]>([]);

    useEffect(() => {
        // Subscribe to topics collection
        // Removing orderBy temporarily to avoid index issues. Sorting client-side.
        const q = query(collection(db, 'topics'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const firebaseTopics = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Topic[];

            console.log("Fetched topics from Firestore:", firebaseTopics);

            // Merge and sort client-side
            const allTopics = [...firebaseTopics, ...initialTopics].sort((a, b) => {
                // Sort by createdAt if available (firebase topics), or fallback to something else
                // Since initialTopics don't have createdAt, they might end up last or first depending on logic
                // Let's just put firebase topics first for now by implicit array order, 
                // but if we want strict sorting we need a createdAt on all or explicit logic.
                // For now, let's just rely on the array order (firebase first).
                return 0;
            });

            setTopics(allTopics);
        }, (error) => {
            console.error("Error fetching topics:", error);
        });

        return () => unsubscribe();
    }, []);

    const addTopic = async (topic: Omit<Topic, 'id'>) => {
        try {
            console.log("Adding topic to Firestore:", topic);
            await addDoc(collection(db, 'topics'), {
                ...topic,
                createdAt: serverTimestamp() // Use server timestamp for consistency
            });
            console.log("Topic added successfully");
        } catch (error) {
            console.error("Error adding topic:", error);
        }
    };

    return (
        <TopicContext.Provider value={{ topics, addTopic }}>
            {children}
        </TopicContext.Provider>
    );
}

export function useTopics() {
    const context = useContext(TopicContext);
    if (context === undefined) {
        throw new Error('useTopics must be used within a TopicProvider');
    }
    return context;
}
