import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contrasena }),
            });

            if (!response.ok) throw new Error('Credenciales inválidas');

            const data = await response.json();
            localStorage.setItem('token', data.token); // o cualquier dato relevante

            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <label>Usuario</label>
                <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default LoginPage;
