import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Hash, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { useTopics } from '../context/TopicContext';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';

export default function TopicList() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { topics } = useTopics();

    const filteredTopics = topics.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen p-6 pb-24 relative">
            <header className="mb-8 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Explore Topics</h1>
                    <p className="text-slate-400">Find a conversation that matters to you.</p>
                </div>

                <Input
                    icon={<Search className="w-5 h-5" />}
                    placeholder="Search a topic..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-brand-surface border-transparent focus:bg-brand-surface-light h-14"
                />
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4"
            >
                {filteredTopics.map((topic) => (
                    <motion.div
                        key={topic.id}
                        variants={item}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/chat/${topic.id}`)}
                        className="group relative overflow-hidden rounded-2xl bg-brand-surface hover:bg-brand-surface-light transition-colors p-5 cursor-pointer border border-white/5 hover:border-white/10"
                    >
                        <div className="flex items-start gap-4 relative z-10">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", topic.color)}>
                                <Hash className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-white mb-1 truncate capitalize">{topic.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2">{topic.description}</p>
                            </div>
                            <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                <ChevronRight className="text-slate-500" />
                            </div>
                            {/* Badge for custom topics */}
                            {topic.isCustom && (
                                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-primary" />
                            )}
                        </div>
                    </motion.div>
                ))}

                {filteredTopics.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No topics found matching "{search}"
                    </div>
                )}
            </motion.div>

            {/* Floating Action Button */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="fixed bottom-6 right-6 z-20"
            >
                <Button
                    onClick={() => navigate('/create-topic')}
                    className="w-16 h-16 rounded-full shadow-2xl shadow-accent-primary/20 bg-accent-primary text-brand-dark"
                    asMotion
                >
                    <Plus className="w-8 h-8" />
                </Button>
            </motion.div>
        </div>
    );
}
