import { Conversation, Message, User, Paginated, WsEvent, MessageStatus, UserStatus } from '../types';
import { ChatAdapter } from './chatAdapter';

type Subscriber = (event: WsEvent) => void;

// --- MOCK DATABASE ---
const mockUsers: Record<string, Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'username' | 'status' | 'lastSeen'>> = {
    'user-1': { id: 'user-1', fullName: 'Faisal Al-Saud', username: 'faisal', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bear', status: 'online', lastSeen: new Date().toISOString() },
    'user-2': { id: 'user-2', fullName: 'Noor Al-Huda', username: 'noor', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Bandit', status: 'online', lastSeen: new Date().toISOString() },
    'user-3': { id: 'user-3', fullName: 'Ahmed Khan', username: 'ahmedk', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Patches', status: 'offline', lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    'user-4': { id: 'user-4', fullName: 'Fatima Al-Fassi', username: 'fatima', avatarUrl: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Abby', status: 'online', lastSeen: new Date().toISOString() },
};

let mockMessages: Record<string, Message[]> = {
    'conv-1': [
        { id: 'msg-1-1', conversationId: 'conv-1', senderId: 'user-2', body: 'Hi Faisal, I reviewed the pitch deck. Looks promising!', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), status: 'read' },
        { id: 'msg-1-2', conversationId: 'conv-1', senderId: 'user-1', body: 'Thanks, Noor! Any feedback on the financial projections?', createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), status: 'read' },
        { id: 'msg-1-3', conversationId: 'conv-1', senderId: 'user-2', body: 'They seem solid, but let\'s discuss slide 8 in our call.', createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(), status: 'read' },
        { id: 'msg-1-4', conversationId: 'conv-1', senderId: 'user-1', body: 'Great, thanks for the update!', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: 'delivered' },
    ],
    'conv-2': [
        { id: 'msg-2-1', conversationId: 'conv-2', senderId: 'user-3', body: 'Faisal, are you available for a quick sync tomorrow?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), status: 'read' },
        { id: 'msg-2-2', conversationId: 'conv-2', senderId: 'user-1', body: 'Yes, I can make the meeting at 3 PM.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), status: 'sent' },
    ],
};

let mockConversations: Record<string, Conversation> = {
    'conv-1': {
        id: 'conv-1',
        participants: [mockUsers['user-1'], mockUsers['user-2']],
        lastMessage: mockMessages['conv-1'][mockMessages['conv-1'].length - 1],
        unreadCount: 0,
    },
    'conv-2': {
        id: 'conv-2',
        participants: [mockUsers['user-1'], mockUsers['user-3']],
        lastMessage: mockMessages['conv-2'][mockMessages['conv-2'].length - 1],
        unreadCount: 1,
    },
};

/**
 * Finds or creates a conversation between a set of participants.
 */
export const findOrCreateConversation = async (participantIds: string[]): Promise<Conversation> => {
    // Normalize participant IDs to ensure consistent key
    const sortedIds = [...participantIds].sort();

    // Check for an existing conversation
    const existingConv = Object.values(mockConversations).find(conv => {
        const convPids = conv.participants.map(p => p.id).sort();
        return JSON.stringify(convPids) === JSON.stringify(sortedIds);
    });

    if (existingConv) {
        return existingConv;
    }

    // If not found, create a new one
    const newConvId = `conv-${Date.now()}`;
    const participants = sortedIds.map(id => mockUsers[id]).filter(Boolean);
    
    if (participants.length !== sortedIds.length) {
        throw new Error("One or more participants not found");
    }

    const newConversation: Conversation = {
        id: newConvId,
        participants,
        unreadCount: 0,
    };

    mockConversations[newConvId] = newConversation;
    mockMessages[newConvId] = [];
    
    return newConversation;
};


// --- MOCK ADAPTER IMPLEMENTATION ---
export class MockChatAdapter implements ChatAdapter {
    private subscribers: Set<Subscriber> = new Set();
    private currentUserId: string;

    constructor(userId: string) {
        this.currentUserId = userId;
        this.simulateRealTimeEvents();
    }

    private emit(event: WsEvent) {
        this.subscribers.forEach(cb => cb(event));
    }
    
    private sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // --- ADAPTER METHODS ---
    async getConversations(options: { cursor?: string; limit?: number }): Promise<Paginated<Conversation>> {
        await this.sleep(400);
        const userConvs = Object.values(mockConversations)
            .filter(c => c.participants.some(p => p.id === this.currentUserId))
            .sort((a, b) => new Date(b.lastMessage?.createdAt || 0).getTime() - new Date(a.lastMessage?.createdAt || 0).getTime());
        return { items: userConvs, nextCursor: null };
    }

    async getMessages(conversationId: string, options: { cursor?: string; limit?: number }): Promise<Paginated<Message>> {
        await this.sleep(300);
        const messages = mockMessages[conversationId] || [];
        return { items: [...messages].reverse(), nextCursor: null }; // reverse for infinite scroll
    }

    async sendMessage(conversationId: string, tempId: string, body: string): Promise<void> {
        await this.sleep(250); // Simulate network latency to server
        
        const serverId = `msg-${Date.now()}`;
        const createdAt = new Date().toISOString();
        
        // 1. Send ACK to the sender
        this.emit({ type: 'message:ack', payload: { tempId, serverId, createdAt, conversationId } });

        const newMessage: Message = { id: serverId, tempId, conversationId, senderId: this.currentUserId, body, createdAt, status: 'sent' };
        
        // 2. Add message to DB and update conversation
        if (!mockMessages[conversationId]) mockMessages[conversationId] = [];
        mockMessages[conversationId].push(newMessage);
        mockConversations[conversationId].lastMessage = { body, createdAt };
        
        // 3. Push new message to all participants
        this.emit({ type: 'message:new', payload: newMessage });

        // 4. Simulate delivery and read receipts
        setTimeout(() => {
            newMessage.status = 'delivered';
            this.emit({ type: 'delivery:update', payload: { conversationId, messageId: serverId, status: 'DELIVERED', readAt: new Date().toISOString() } });
        }, 1000);

        // Simulate the other user reading it after a few seconds
        setTimeout(() => {
            this.markAsRead(conversationId, this.currentUserId);
        }, 3000);
    }

    async markAsRead(conversationId: string, readerId?: string): Promise<void> {
        await this.sleep(100);
        const messagesToUpdate = mockMessages[conversationId]?.filter(m => m.senderId !== this.currentUserId && m.status !== 'read');
        
        if (messagesToUpdate) {
            messagesToUpdate.forEach(m => {
                m.status = 'read';
                this.emit({ type: 'delivery:update', payload: { conversationId, messageId: m.id, status: 'READ', readAt: new Date().toISOString() } });
            });
        }
        mockConversations[conversationId].unreadCount = 0;
    }

    async sendTypingUpdate(conversationId: string, isTyping: boolean): Promise<void> {
        const otherUser = mockConversations[conversationId].participants.find(p => p.id !== this.currentUserId);
        if (otherUser) {
            this.emit({ type: 'typing:update', payload: { conversationId, userId: this.currentUserId, isTyping } });
        }
    }

    subscribe(callback: Subscriber): () => void {
        this.subscribers.add(callback);
        return () => {
            this.subscribers.delete(callback);
        };
    }

    // --- SIMULATION LOGIC ---
    private simulateRealTimeEvents() {
        // Simulate other users typing
        setInterval(() => {
            const conv = mockConversations['conv-1'];
            const otherUser = conv.participants.find(p => p.id !== this.currentUserId);
            if (otherUser) {
                this.emit({ type: 'typing:update', payload: { conversationId: conv.id, userId: otherUser.id, isTyping: true } });
                setTimeout(() => {
                    this.emit({ type: 'typing:update', payload: { conversationId: conv.id, userId: otherUser.id, isTyping: false } });
                }, 2000);
            }
        }, 15000);
        
        // Simulate a user coming online/offline
        setInterval(() => {
            const userToUpdate = mockUsers['user-3'];
            userToUpdate.status = userToUpdate.status === 'online' ? 'offline' : 'online';
            userToUpdate.lastSeen = new Date().toISOString();
            this.emit({ type: 'presence:update', payload: { userId: userToUpdate.id, status: userToUpdate.status, lastSeen: userToUpdate.lastSeen } });
        }, 20000);
    }
}