export interface GreenApiCredentials {
    idInstance: string;
    apiTokenInstance: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    type: 'incoming' | 'outgoing';
    timestamp: number;
}

export interface ReceiveNotificationResponse {
    receiptId: number;
    body: {
        typeWebhook: string;
        instanceData: {
            idInstance: number;
            wid: string;
            typeInstance: string;
        };
        timestamp: number;
        idMessage: string;
        senderData?: {
            chatId: string;
            sender: string;
            senderName: string;
        };
        messageData?: {
            typeMessage: string;
            textMessageData?: {
                textMessage: string;
            };
            extendedTextMessageData?: {
                text: string;
            };
        };
    };
}