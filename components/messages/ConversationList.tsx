import React from 'react';
import { NavLink } from 'react-router-dom';
import { useConversations } from '../../hooks/useConversations';
import { useUser } from '../../stores/authStore';
import { Skeleton } from '../ui/Skeleton';
import { Conversation } from '../../types';

// A simple utility to format time since a date
const timeSince = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return "now";
};

const PresenceIndicator: React.FC<{ status?: 'online' | 'offline' }> = ({ status }) => {
    if (status !== 'online') return null;
    return <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />;
};


const ConversationItem: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
    const currentUser = useUser();
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser?.id);

    if (!otherParticipant) return null;

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-start p-3 hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-50' : ''
        }`;

    return (
        <NavLink to={`/messages/${conversation.id}`} className={navLinkClass}>
            <div className="relative mr-4 rtl:ml-4 rtl:mr-0 flex-shrink-0">
                <img 
                    src={otherParticipant.avatarUrl} 
                    alt={otherParticipant.fullName} 
                    className="w-12 h-12 rounded-full"
                />
                <PresenceIndicator status={otherParticipant.status} />
            </div>
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold truncate">{otherParticipant.fullName}</h3>
                    {conversation.lastMessage && <time className="text-xs text-gray-500 flex-shrink-0">{timeSince(conversation.lastMessage.createdAt)}</time>}
                </div>
                <div className="flex justify-between items-start mt-1">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage?.body || 'No messages yet'}</p>
                    {conversation.unreadCount > 0 && (
                        <span className="flex-shrink-0 ml-2 rtl:mr-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </NavLink>
    );
};

const ConversationListSkeleton: React.FC = () => (
    <div className="p-3">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center mb-3">
                <Skeleton className="w-12 h-12 rounded-full mr-4 rtl:ml-4 rtl:mr-0" />
                <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="h-3 w-1/5" />
                    </div>
                    <Skeleton className="h-4 w-4/5 mt-2" />
                </div>
            </div>
        ))}
    </div>
);


export const ConversationList: React.FC = () => {
    const { data: conversations, isLoading, isError } = useConversations();

    if (isLoading) {
        return <ConversationListSkeleton />;
    }

    if (isError) {
        return <p className="p-4 text-destructive">Failed to load conversations.</p>;
    }

    if (!conversations || conversations.length === 0) {
        return <p className="p-4 text-gray-500">No conversations yet.</p>;
    }

    return (
        <nav>
            {conversations.map(conv => (
                <ConversationItem key={conv.id} conversation={conv} />
            ))}
        </nav>
    );
};