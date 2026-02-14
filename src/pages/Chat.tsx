import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Hash, Plus, Image as ImageIcon, Mic, ShieldAlert, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { topics, Message, MessageType } from '../lib/data';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { useTopics } from '../context/TopicContext';

// Mock AI moderation list
const BANNED_WORDS = ['hate', 'stupid', 'ugly', 'kill', 'attack'];

export default function Chat() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { topics: liveTopics } = useTopics(); // Get fresh topics from context

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [isRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Try to find topic in live context first, fallback to static
    const topic = liveTopics.find(t => t.id === topicId) || topics.find(t => t.id === topicId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!topicId) return;

        const q = query(
            collection(db, 'topics', topicId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Convert Firestore Timestamp to string for UI
                    timestamp: data.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '...'
                } as Message;
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [topicId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const checkForModeration = (text: string) => {
        return BANNED_WORDS.some(word => text.toLowerCase().includes(word));
    };

    const handleSend = async (type: MessageType = 'text', content?: string) => {
        if ((type === 'text' && !inputValue.trim()) || !topicId || !user) return;

        const isModerated = type === 'text' && checkForModeration(inputValue);

        // Store message
        await addDoc(collection(db, 'topics', topicId, 'messages'), {
            text: type === 'text' ? inputValue : undefined,
            type,
            mediaUrl: content || null,
            authorId: user.uid, // Use actual Firebase UID (IP)
            authorName: user.displayName || user.uid, // Store Display Name (IP or Nickname)
            isUser: true, // In local view we might use this, but better to compare IDs in render
            timestamp: serverTimestamp(),
            isModerated
        });

        setInputValue('');
        setShowAttachMenu(false);
    };

    const simulateUpload = (type: 'image' | 'video' | 'audio') => {
        // In a real app, this would open a file picker
        const fakeUrl = type === 'image'
            ? 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=800&q=80'
            : type === 'video'
                ? 'https://www.w3schools.com/html/mov_bbb.mp4'
                : '';

        handleSend(type, fakeUrl);
    };

    if (!topic) return <div>Topic not found</div>;

    return (
        <div className="flex flex-col h-screen bg-brand-dark">
            {/* Header */}
            <header className="flex items-center gap-3 p-4 border-b border-white/5 bg-brand-dark/80 backdrop-blur-md sticky top-0 z-20">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", topic.color)}>
                    <Hash className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-bold text-lg capitalize leading-tight">{topic.title}</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-pulse" />
                        <p className="text-xs text-slate-400">32 Online • AI Moderation Active</p>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="text-center py-6">
                    <div className="inline-block px-4 py-2 rounded-full bg-white/5 text-xs text-slate-400">
                        This is a safe space. Messages are AI moderated.
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "flex flex-col mb-4",
                                msg.authorId === user?.uid ? "items-end" : "items-start"
                            )}
                        >
                            {/* Author visual identifier - Show Name/IP */}
                            {msg.authorId !== user?.uid && (
                                <span className="text-[10px] text-slate-500 mb-1 ml-2">
                                    {msg.authorName || msg.authorId}
                                </span>
                            )}

                            <div
                                className={cn(
                                    "max-w-[85%] rounded-2xl relative shadow-sm overflow-hidden",
                                    msg.authorId === user?.uid
                                        ? "bg-accent-primary text-brand-dark rounded-tr-sm"
                                        : "bg-brand-surface-light text-slate-200 rounded-tl-sm",
                                    msg.isModerated && "bg-red-500/10 border border-red-500/20 text-red-200"
                                )}
                            >
                                {msg.isModerated ? (
                                    <div className="px-5 py-3 flex items-center gap-2 text-sm italic opacity-80">
                                        <ShieldAlert className="w-4 h-4" />
                                        <span>Message removed by AI for unsafe content.</span>
                                    </div>
                                ) : (
                                    <>
                                        {msg.type === 'image' && msg.mediaUrl && (
                                            <img src={msg.mediaUrl} alt="attachment" className="w-full h-auto max-h-60 object-cover" />
                                        )}

                                        {msg.type === 'video' && msg.mediaUrl && (
                                            <video controls className="w-full max-h-60 rounded-lg">
                                                <source src={msg.mediaUrl} type="video/mp4" />
                                            </video>
                                        )}

                                        {msg.type === 'audio' && (
                                            <div className="flex items-center gap-3 px-4 py-3 min-w-[200px]">
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Mic className="w-4 h-4 fill-current" />
                                                </div>
                                                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                                    <div className="h-full w-1/3 bg-current" />
                                                </div>
                                                <span className="text-xs font-mono opacity-70">0:15</span>
                                            </div>
                                        )}

                                        {msg.text && <div className="px-5 py-3 text-sm leading-relaxed">{msg.text}</div>}
                                    </>
                                )}

                                <span className={cn(
                                    "text-[10px] absolute bottom-1 block opacity-50",
                                    msg.authorId === user?.uid ? "text-brand-dark right-3" : "text-slate-400 right-3"
                                )}>
                                    {msg.timestamp}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-brand-surface/30 backdrop-blur-lg border-t border-white/5 relative">

                {/* Attachment Menu */}
                <AnimatePresence>
                    {showAttachMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-20 left-4 flex gap-3 p-3 bg-brand-surface border border-white/10 rounded-2xl shadow-xl z-10"
                        >
                            <button onClick={() => simulateUpload('image')} className="flex flex-col items-center gap-1 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <span className="text-xs text-slate-400">Photo</span>
                            </button>
                            <button onClick={() => simulateUpload('video')} className="flex flex-col items-center gap-1 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Video className="w-5 h-5" />
                                </div>
                                <span className="text-xs text-slate-400">Video</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className={cn("rounded-full w-10 h-10 p-0", showAttachMenu && "bg-white/10 rotate-45")}
                    >
                        <Plus className="w-6 h-6" />
                    </Button>

                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Message..."
                        className="flex-1 bg-brand-surface-light/50 border-none rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                    />

                    {inputValue.trim() ? (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSend('text')}
                            className="w-12 h-12 rounded-full bg-accent-primary flex items-center justify-center text-brand-dark shadow-lg shadow-accent-primary/20"
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.9, scaleX: 0.9 }}
                            onClick={() => handleSend('audio')}
                            className="w-12 h-12 rounded-full bg-brand-surface-light flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                        >
                            {isRecording ? <div className="w-4 h-4 rounded-sm bg-red-500 animate-pulse" /> : <Mic className="w-5 h-5" />}
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
