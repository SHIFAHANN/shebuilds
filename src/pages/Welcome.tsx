import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../context/UserContext';

export default function Welcome() {
    const [name, setName] = useState('');
    const { setNickname } = useUser();
    const navigate = useNavigate();

    const handleContinue = () => {
        if (!name.trim()) return;
        setNickname(name);
        navigate('/topics');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md flex flex-col items-center gap-8 relative z-10"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                    }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-accent-primary to-emerald-300 flex items-center justify-center shadow-2xl shadow-accent-primary/20"
                >
                    <MessageCircle className="w-12 h-12 text-brand-dark" strokeWidth={2.5} />
                </motion.div>

                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Talk anonymously
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Discuss various topics with unknown people in a safe space.
                    </p>
                </div>

                <div className="w-full space-y-4 pt-4">
                    <Input
                        placeholder="Enter your nickname"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-center text-lg h-14 bg-brand-surface/50 border-white/10 focus-visible:ring-accent-primary/50"
                        onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                    />

                    <Button
                        onClick={handleContinue}
                        className="w-full h-14 text-lg font-bold"
                        disabled={!name.trim()}
                        asMotion
                    >
                        Continue <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </motion.div>

            <div className="absolute bottom-8 text-slate-500 text-sm">
                No login. No tracking. Just talk.
            </div>
        </div>
    );
}
