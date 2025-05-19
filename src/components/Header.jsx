// src/components/Header.jsx
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    return (
        <header className="navbar">
            <div className="navbar-brand">Gestión RRHH</div>
            <nav className="navbar-menu">
                <Link to="/agregar-colaborador">Colaboradores</Link>
                <Link to="/generar-pagos">Generar Pagos</Link>
                <Link to="/productividad">Productividad</Link>
                <Link to="/reportes">Reportes</Link>
            </nav>
        </header>
    );
}
