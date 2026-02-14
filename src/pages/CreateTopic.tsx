import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTopics } from '../context/TopicContext';
import { cn } from '../lib/utils';

const COLORS = [
    'bg-rose-500/10 text-rose-400',
    'bg-blue-500/10 text-blue-400',
    'bg-amber-500/10 text-amber-400',
    'bg-emerald-500/10 text-emerald-400',
    'bg-purple-500/10 text-purple-400',
    'bg-pink-500/10 text-pink-400',
    'bg-cyan-500/10 text-cyan-400',
];

export default function CreateTopic() {
    const navigate = useNavigate();
    const { addTopic } = useTopics();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    const handleCreate = async () => {
        if (!title.trim() || !description.trim()) return;

        await addTopic({
            title,
            description,
            color: selectedColor,
            isCustom: true
        });

        navigate('/topics');
    };

    return (
        <div className="min-h-screen p-6 bg-brand-dark">
            <header className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-2xl font-bold">Create New Topic</h1>
            </header>

            <div className="space-y-8 max-w-md mx-auto">
                <div className="space-y-4">
                    <label className="text-sm text-slate-400 font-medium ml-1">Topic Title</label>
                    <Input
                        placeholder="e.g. Late Night Thoughts"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="bg-brand-surface"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm text-slate-400 font-medium ml-1">Description</label>
                    <textarea
                        placeholder="What is this circle about?"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full h-32 rounded-xl border border-white/10 bg-brand-surface px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-primary block resize-none"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm text-slate-400 font-medium ml-1">Theme Color</label>
                    <div className="flex gap-3 flex-wrap">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all border-2",
                                    color.replace('/10', ''), // Approximate solid color for background
                                    selectedColor === color ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"
                                )}
                            >
                                {/* Using the text color class to extract the color for the background visual is tricky in pure tailwind class string
                      Instead, just coloring the background directly with the class
                  */}
                                <div className={cn("w-full h-full rounded-full opacity-50", color)} />
                                {selectedColor === color && <Check className="w-5 h-5 absolute text-white" />}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={handleCreate}
                    className="w-full text-lg h-14 mt-8"
                    disabled={!title.trim() || !description.trim()}
                    asMotion
                >
                    Create Channel
                </Button>
            </div>
        </div>
    );
}
