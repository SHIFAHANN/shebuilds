export interface Topic {
    id: string;
    title: string;
    description: string;
    image?: string;
    color: string;
    isCustom?: boolean;
}

export type MessageType = 'text' | 'image' | 'audio' | 'video';

export interface Message {
    id: string;
    text?: string;
    type: MessageType;
    mediaUrl?: string; // For simulation, we can use placeholder URLs
    authorId: string; // Random ID to simulate "imposter" users
    authorName?: string; // Display name (IP or nickname)
    isUser: boolean;
    timestamp: string;
    isModerated?: boolean; // If true, content is hidden/flagged by AI
}

export const topics: Topic[] = [
    {
        id: '1',
        title: 'childhood scars',
        description: 'Discussing the hidden wounds of our early years.',
        color: 'bg-rose-500/10 text-rose-400',
    },
    {
        id: '2',
        title: 'things i never told anyone',
        description: 'A safe space for your deepest secrets.',
        color: 'bg-indigo-500/10 text-indigo-400',
    },
    {
        id: '3',
        title: 'growing up too soon',
        description: 'For those who had to be adults before they were ready.',
        color: 'bg-amber-500/10 text-amber-400',
    },
    {
        id: '4',
        title: 'homes that didnt feel like home',
        description: 'When the place you live isnt your sanctuary.',
        color: 'bg-emerald-500/10 text-emerald-400',
    },
    {
        id: '5',
        title: 'words that hurt',
        description: 'The impact of verbal scars.',
        color: 'bg-red-500/10 text-red-400',
    },
    {
        id: '6',
        title: 'the day everything changed',
        description: 'Moments that defined a before and after.',
        color: 'bg-cyan-500/10 text-cyan-400',
    },
    {
        id: '7',
        title: 'faded memories',
        description: 'Holding onto what is slipping away.',
        color: 'bg-slate-500/10 text-slate-400',
    },
    {
        id: '8',
        title: 'the past that haunts',
        description: 'Dealing with ghosts of yesterday.',
        color: 'bg-violet-500/10 text-violet-400',
    },
    {
        id: '9',
        title: 'people who left',
        description: 'Coping with absence and loss.',
        color: 'bg-orange-500/10 text-orange-400',
    },
    {
        id: '10',
        title: 'unsaid goodbyes',
        description: 'Closure that never happened.',
        color: 'bg-pink-500/10 text-pink-400',
    },
    {
        id: '11',
        title: 'loving in silence',
        description: 'Unrequited or hidden affection.',
        color: 'bg-fuchsia-500/10 text-fuchsia-400',
    },
    {
        id: '12',
        title: 'anxiety talks',
        description: 'Open discussions on managing anxiety.',
        color: 'bg-blue-500/10 text-blue-400',
    },
    {
        id: '13',
        title: 'overthinking zone',
        description: 'For the minds that never rest.',
        color: 'bg-purple-500/10 text-purple-400',
    },
    {
        id: '14',
        title: 'healing slowly',
        description: 'Celebrating small steps in recovery.',
        color: 'bg-teal-500/10 text-teal-400',
    },
    {
        id: '15',
        title: 'becoming myself',
        description: 'The journey of self-discovery.',
        color: 'bg-lime-500/10 text-lime-400',
    },
    {
        id: '16',
        title: 'soft confessions',
        description: 'Gentle admissions of the heart.',
        color: 'bg-sky-500/10 text-sky-400',
    },
    {
        id: '17',
        title: 'Covid19',
        description: 'Experiences during the pandemic.',
        color: 'bg-gray-500/10 text-gray-400',
    },
    {
        id: '18',
        title: 'Netflix Dark',
        description: 'Theories and discussions about the show.',
        color: 'bg-red-900/10 text-red-500',
    },
    {
        id: '19',
        title: 'Social Issues',
        description: 'Debating the world around us.',
        color: 'bg-green-500/10 text-green-400',
    },
];

export const mockMessages: Message[] = [
    {
        id: '1',
        text: 'I always felt like I had to be the strong one.',
        type: 'text',
        authorId: 'user-123',
        isUser: false,
        timestamp: '10:00 AM',
    },
    {
        id: '2',
        text: 'It is okay to be vulnerable sometimes.',
        type: 'text',
        authorId: 'me',
        isUser: true,
        timestamp: '10:02 AM',
    },
    {
        id: '3',
        text: 'I just dont know how to let my guard down anymore.',
        type: 'text',
        authorId: 'user-123',
        isUser: false,
        timestamp: '10:03 AM',
    },
];
