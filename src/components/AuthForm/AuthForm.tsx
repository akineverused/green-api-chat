import { useState, type FormEvent } from 'react';
import type { GreenApiCredentials } from '../../types/green-api';
import './AuthForm.scss';

interface AuthFormProps {
    onLogin: (credentials: GreenApiCredentials) => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (idInstance.trim() && apiTokenInstance.trim()) {
            onLogin({
                idInstance: idInstance.trim(),
                apiTokenInstance: apiTokenInstance.trim(),
            });
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-form__title">GREEN-API Chat</h2>
                <p className="auth-form__subtitle">Введите учетные данные инстанса</p>

                <div className="auth-form__field">
                    <label htmlFor="idInstance">idInstance</label>
                    <input
                        id="idInstance"
                        type="text"
                        placeholder="1101000000"
                        value={idInstance}
                        onChange={(e) => setIdInstance(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-form__field">
                    <label htmlFor="apiTokenInstance">apiTokenInstance</label>
                    <input
                        id="apiTokenInstance"
                        type="password"
                        placeholder="abcdef1234567890..."
                        value={apiTokenInstance}
                        onChange={(e) => setApiTokenInstance(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="auth-form__button">
                    Войти
                </button>
            </form>
        </div>
    );
};