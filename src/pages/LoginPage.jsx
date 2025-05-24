import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const response = await fetch('http://localhost:3000/api/admin/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    usuario: usuario.trim(), 
                    clave: contrasena 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error en el servidor');
            }

            // Si la autenticación es exitosa
            if (data.mensaje == "Acceso concedido") {
                // Guardar información del usuario en localStorage
                localStorage.setItem('token', data.token || 'authenticated');
                localStorage.setItem('usuario', usuario);
                localStorage.setItem('rol', data.rol);
                
                // Redireccionar a la página principal
                navigate('/');
            } else {
                setError('Credenciales inválidas');
            }

        } catch (err) {
            console.error('Error de login:', err);
            setError(err.message || 'Error de conexión con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="usuario">Usuario</label>
                    <input
                        id="usuario"
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        disabled={cargando}
                        required
                        autoComplete="username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contrasena">Contraseña</label>
                    <input
                        id="contrasena"
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        disabled={cargando}
                        required
                        autoComplete="current-password"
                    />
                </div>

                {error && <p className="error" role="alert">{error}</p>}

                <button 
                    type="submit" 
                    disabled={cargando || !usuario.trim() || !contrasena}
                    className={cargando ? 'loading' : ''}
                >
                    {cargando ? 'Iniciando sesión...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;