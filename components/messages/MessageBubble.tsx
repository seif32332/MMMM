import React from 'react';
import { useUser } from '../../stores/authStore';
import { Message } from '../../types';
import { ReadReceiptIcon } from './ReadReceiptIcon';

interface MessageBubbleProps {
    message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const currentUser = useUser();
    const isSentByMe = message.senderId === currentUser?.id;

    const bubbleClasses = isSentByMe
        ? 'bg-primary text-primary-foreground'
        : 'bg-white text-gray-800 border';
    
    const containerClasses = `flex ${isSentByMe ? 'justify-end' : 'justify-start'}`;

    return (
        <div className={containerClasses}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 shadow-sm ${bubbleClasses}`}>
                <p className="whitespace-pre-wrap">{message.body}</p>
                 {isSentByMe && (
                    <div className="flex justify-end mt-1">
                        <ReadReceiptIcon status={message.status} />
                    </div>
                )}
            </div>
        </div>
    );
};