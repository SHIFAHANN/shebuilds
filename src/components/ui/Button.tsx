import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    asMotion?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', asMotion = false, ...props }, ref) => {
        const variants = {
            primary: 'bg-accent-primary text-brand-dark hover:bg-accent-primary/90 font-semibold shadow-accent-primary/20 shadow-lg',
            secondary: 'bg-accent-secondary text-white hover:bg-accent-secondary/90 font-semibold shadow-accent-secondary/20 shadow-lg',
            outline: 'border border-white/20 text-slate-300 hover:bg-white/5 hover:text-white',
            ghost: 'text-slate-400 hover:text-white hover:bg-white/5',
        };

        const sizes = {
            sm: 'h-9 px-4 text-sm rounded-lg',
            md: 'h-11 px-6 text-base rounded-xl',
            lg: 'h-14 px-8 text-lg rounded-2xl',
        };

        const baseStyles = 'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200';

        const classes = cn(baseStyles, variants[variant], sizes[size], className);

        if (asMotion) {
            // @ts-ignore - motion.button handles refs differently, keeping it simple for now
            return (
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className={classes}
                    {...(props as any)}
                >
                    {props.children}
                </motion.button>
            );
        }

        return (
            <button ref={ref} className={classes} {...props} />
        );
    }
);

Button.displayName = 'Button';

export { Button };
