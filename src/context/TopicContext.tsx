import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, addDoc, query, serverTimestamp } from 'firebase/firestore';
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
            // Merge topics. Firebase topics come first.
            // Note: initialTopics lack createdAt, so strict time sorting isn't possible yet.
            const allTopics = [...firebaseTopics, ...initialTopics];

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
