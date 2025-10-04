import React, { useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import { useConversations } from '../../hooks/useConversations';
import { useUser } from '../../stores/authStore';
import { Skeleton } from '../ui/Skeleton';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useTypingIndicator } from '../../hooks/useTypingIndicator';
import { useI18n } from '../../i18n';
import { DateSeparator } from './DateSeparator';
import { useChatAdapter } from '../../context/AuthContext';

const TypingIndicator: React.FC<{ user: { fullName?: string } }> = ({ user }) => {
    const { t } = useI18n();
    return (
        <div className="text-sm text-gray-500 italic">
            {t('messages.typing_indicator', { name: user.fullName || 'Someone' })}
        </div>
    );
};

const ChatWindowSkeleton: React.FC = () => (
    <div className="flex flex-col h-full">
        <header className="p-4 border-b flex items-center space-x-4 rtl:space-x-reverse">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
            </div>
        </header>
        <div className="flex-grow p-4 space-y-4">
            <div className="flex justify-start"><Skeleton className="h-10 w-3/5 rounded-2xl" /></div>
            <div className="flex justify-end"><Skeleton className="h-12 w-2/5 rounded-2xl" /></div>
            <div className="flex justify-start"><Skeleton className="h-8 w-1/2 rounded-2xl" /></div>
        </div>
        <div className="p-4 border-t"><Skeleton className="h-12 w-full rounded-md" /></div>
    </div>
);


export const ChatWindow: React.FC = () => {
    const { conversationId } = useParams<{ conversationId: string }>();
    const { data: messages, isLoading, isError } = useMessages(conversationId);
    const { data: conversations } = useConversations();
    const currentUser = useUser();
    const typingUserIds = useTypingIndicator(conversationId);
    const { t } = useI18n();
    const adapter = useChatAdapter();
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mark as read when component is viewed
    useEffect(() => {
        if (conversationId) {
            adapter.markAsRead(conversationId);
        }
    }, [conversationId, adapter]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const conversation = conversations?.find(c => c.id === conversationId);
    const otherParticipant = conversation?.participants.find(p => p.id !== currentUser?.id);
    const isTyping = typingUserIds.includes(otherParticipant?.id || '');

    const groupedMessages = useMemo(() => {
        if (!messages) return [];
        const groups: { date: string, messages: typeof messages }[] = [];
        messages.forEach(msg => {
            const date = new Date(msg.createdAt).toDateString();
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup.date === date) {
                lastGroup.messages.push(msg);
            } else {
                groups.push({ date, messages: [msg] });
            }
        });
        return groups;
    }, [messages]);

    if (isLoading) {
        return <ChatWindowSkeleton />;
    }

    if (isError || !otherParticipant) {
        return <div className="flex items-center justify-center h-full"><p className="text-destructive">Error loading chat.</p></div>;
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="p-4 border-b flex items-center space-x-4 rtl:space-x-reverse bg-white">
                <Link to={`/u/${otherParticipant.username}`}>
                    <img 
                        src={otherParticipant.avatarUrl} 
                        alt={otherParticipant.fullName} 
                        className="w-10 h-10 rounded-full"
                    />
                </Link>
                <div>
                    <h2 className="font-bold">{otherParticipant.fullName}</h2>
                    <p className="text-sm text-gray-500">
                        { otherParticipant.status === 'online' ? t('messages.user_status.online') : t('messages.user_status.offline')}
                    </p>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto p-4 space-y-2">
                {groupedMessages.map((group, index) => (
                    <React.Fragment key={group.date}>
                        <DateSeparator date={group.date} />
                        <div className="space-y-4">
                            {group.messages.map(msg => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))}
                        </div>
                    </React.Fragment>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            
            <div className="h-6 px-4">
                 {isTyping && <TypingIndicator user={otherParticipant} />}
            </div>

            <div className="p-4 border-t bg-white">
                <MessageInput conversationId={conversationId!} />
            </div>
        </div>
    );
};

export default ChatWindow;
