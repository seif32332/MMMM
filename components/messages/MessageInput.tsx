import React, { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useI18n } from '../../i18n';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Input } from '../ui/Input';
import { useChatAdapter } from '../../services/chatAdapter';
import { debounce } from 'lodash';
import { Tooltip } from '../ui/Tooltip';


// Placeholder Icons
const PaperclipIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;


interface MessageInputProps {
    conversationId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
    const { t } = useI18n();
    const { control, handleSubmit, reset } = useForm<{ body: string }>({ defaultValues: { body: '' } });
    const sendMessageMutation = useSendMessage(conversationId);
    const adapter = useChatAdapter();

    const sendTypingUpdate = useCallback(
        debounce((isTyping: boolean) => {
            adapter.sendTypingUpdate(conversationId, isTyping);
        }, 500),
        [adapter, conversationId]
    );

    const onSubmit = (data: { body: string }) => {
        if (data.body.trim()) {
            sendMessageMutation.mutate({ body: data.body.trim(), tempId: `temp-${Date.now()}` });
            reset();
            sendTypingUpdate(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center space-x-2 rtl:space-x-reverse">
            <Tooltip content={t('messages.actions.attach_file')}>
                <Button variant="ghost" size="icon" type="button"><PaperclipIcon /></Button>
            </Tooltip>
             <Tooltip content={t('messages.actions.start_call')}>
                <Button variant="ghost" size="icon" type="button"><PhoneIcon /></Button>
            </Tooltip>
             <Tooltip content={t('messages.actions.send_deal')}>
                <Button variant="ghost" size="icon" type="button"><BriefcaseIcon /></Button>
            </Tooltip>
            
            <Controller
                name="body"
                control={control}
                render={({ field }) => (
                    <Input 
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            sendTypingUpdate(e.target.value.length > 0);
                        }}
                        placeholder={t('messages.chat_input_placeholder')}
                        className="flex-grow"
                        autoComplete="off"
                    />
                )}
            />
            
            <Button type="submit" size="icon" disabled={sendMessageMutation.isPending}>
                {sendMessageMutation.isPending ? <Spinner size="sm" /> : <SendIcon />}
            </Button>
        </form>
    );
};