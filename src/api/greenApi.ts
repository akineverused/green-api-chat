import type { GreenApiCredentials, ReceiveNotificationResponse } from '../types/green-api';

const BASE_URL = 'https://api.green-api.com';

const getUrl = (credentials: GreenApiCredentials, method: string) => {
    return `${BASE_URL}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}`;
};

export const sendMessage = async (
    credentials: GreenApiCredentials,
    phoneNumber: string,
    message: string
) => {
    const chatId = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;

    const response = await fetch(getUrl(credentials, 'sendMessage'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chatId,
            message,
        }),
    });

    if (!response.ok) {
        throw new Error('Ошибка при отправке сообщения');
    }

    return await response.json();
};

export const receiveNotification = async (
    credentials: GreenApiCredentials
): Promise<ReceiveNotificationResponse | null> => {
    const response = await fetch(getUrl(credentials, 'receiveNotification'), {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Ошибка при получении уведомления');
    }

    const text = await response.text();
    if (!text) {
        return null;
    }

    return JSON.parse(text);
};

export const deleteNotification = async (
    credentials: GreenApiCredentials,
    receiptId: number
) => {
    const response = await fetch(`${getUrl(credentials, 'deleteNotification')}/${receiptId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Ошибка при удалении уведомления');
    }

    return await response.json();
};