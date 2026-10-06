import { useState, type FormEvent, useRef, useEffect, useCallback } from 'react';
import type { GreenApiCredentials, ChatMessage } from '../../types/green-api';
import { sendMessage } from '../../api/greenApi';
import { useGreenApiPolling } from '../../hooks/useGreenApiPolling';
import './ChatWindow.scss';

interface ChatWindowProps {
    credentials: GreenApiCredentials;
    onLogout: () => void;
}

export const ChatWindow = ({ credentials, onLogout }: ChatWindowProps) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [activeChatPhone, setActiveChatPhone] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleIncomingMessage = useCallback((newMsg: ChatMessage) => {
        setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
        });
    }, []);

    useGreenApiPolling(credentials, activeChatPhone, handleIncomingMessage);

    const handleStartChat = (e: FormEvent) => {
        e.preventDefault();
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        if (cleanPhone) {
            setActiveChatPhone(cleanPhone);
            setMessages([]);
        }
    };

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isSending || !activeChatPhone) return;

        const messageText = inputText.trim();
        setInputText('');
        setIsSending(true);

        try {
            const response = await sendMessage(credentials, activeChatPhone, messageText);

            const newOutgoingMessage: ChatMessage = {
                id: response.idMessage || Date.now().toString(),
                text: messageText,
                type: 'outgoing',
                timestamp: Math.floor(Date.now() / 1000),
            };

            setMessages((prev) => [...prev, newOutgoingMessage]);
        } catch (error) {
            alert('Не удалось отправить сообщение');
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    if (!activeChatPhone) {
        return (
            <div className="chat-start-container">
                <div className="chat-start-card">
                    <div className="chat-start-card__header">
                        <h3>Создать новый чат</h3>
                        <button className="logout-btn" onClick={onLogout}>Выйти</button>
                    </div>
                    <form onSubmit={handleStartChat}>
                        <div className="input-group">
                            <label htmlFor="phone">Номер телефона получателя</label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="77011234567"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="primary-btn">
                            Открыть чат
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-layout">
            <header className="chat-header">
                <div className="chat-header__info">
                    <div className="avatar">📱</div>
                    <div>
                        <div className="phone-number">+{activeChatPhone}</div>
                        <div className="status">в сети (GREEN-API)</div>
                    </div>
                </div>
                <div className="chat-header__actions">
                    <button className="secondary-btn" onClick={() => setActiveChatPhone('')}>
                        Сменить чат
                    </button>
                    <button className="logout-btn" onClick={onLogout}>
                        Выйти
                    </button>
                </div>
            </header>

            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="empty-chat-hint">
                        Сообщений пока нет. Напишите первое сообщение!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const timeStr = new Date(msg.timestamp * 1000).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        return (
                            <div
                                key={msg.id}
                                className={`message-bubble message-bubble--${msg.type}`}
                            >
                                <div className="message-bubble__text">{msg.text}</div>
                                <div className="message-bubble__time">{timeStr}</div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="message-input-bar" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Введите сообщение..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isSending}
                />
                <button type="submit" disabled={!inputText.trim() || isSending}>
                    {isSending ? '...' : 'Отправить'}
                </button>
            </form>
        </div>
    );
};