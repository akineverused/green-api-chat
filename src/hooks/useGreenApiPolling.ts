import { useEffect } from 'react';
import type { GreenApiCredentials, ChatMessage } from '../types/green-api';
import { receiveNotification, deleteNotification } from '../api/greenApi';

export const useGreenApiPolling = (
    credentials: GreenApiCredentials | null,
    activePhoneNumber: string,
    onNewMessage: (msg: ChatMessage) => void
) => {
    useEffect(() => {
        if (!credentials || !activePhoneNumber) return;

        const intervalId = setInterval(async () => {
            try {
                const notification = await receiveNotification(credentials);
                if (!notification) return;

                const { receiptId, body } = notification;

                if (
                    body.typeWebhook === 'incomingMessageReceived' &&
                    body.messageData
                ) {
                    const senderChatId = body.senderData?.chatId || '';
                    const targetChatId = activePhoneNumber.includes('@')
                        ? activePhoneNumber
                        : `${activePhoneNumber}@c.us`;

                    if (senderChatId === targetChatId) {
                        const text =
                            body.messageData.textMessageData?.textMessage ||
                            body.messageData.extendedTextMessageData?.text ||
                            '';

                        if (text) {
                            onNewMessage({
                                id: body.idMessage,
                                text,
                                type: 'incoming',
                                timestamp: body.timestamp || Math.floor(Date.now() / 1000),
                            });
                        }
                    }
                }

                await deleteNotification(credentials, receiptId);
            } catch (error) {
                console.error('Ошибка поллинга:', error);
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, [credentials, activePhoneNumber, onNewMessage]);
};