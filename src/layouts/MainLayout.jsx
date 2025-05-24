// src/layouts/MainLayout.jsx
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div>
            <Header />
            <main style={{ padding: '1rem' }}>
                <Outlet />
            </main>
        </div>
    );
}
