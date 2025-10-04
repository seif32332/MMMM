import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConversationList } from '../../components/messages/ConversationList';
import { useI18n } from '../../i18n';

export const MessagesPage: React.FC = () => {
    const { t } = useI18n();

    return (
        <div className="container mx-auto h-[calc(100vh-81px)]">
            <div className="flex h-full border-x">
                {/* Left Column: Conversation List */}
                <aside className="w-1/3 border-r h-full flex flex-col">
                    <div className="p-4 border-b">
                        <h1 className="text-2xl font-bold">{t('messages.title')}</h1>
                        {/* Search input can be added here */}
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <ConversationList />
                    </div>
                </aside>

                {/* Right Column: Active Chat Window */}
                <main className="w-2/3 h-full flex flex-col">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MessagesPage;
