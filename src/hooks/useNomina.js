// GenerarPagosPage.js - Versión con hook personalizado
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import useNomina from './hooks/useNomina'; // Ajusta la ruta según tu estructura

const GenerarPagosPage = () => {
    const [pagos, setPagos] = useState([]);
    const { 
        loading, 
        error, 
        obtenerTodasNominas, 
        obtenerNominasPorEmpleado,
        insertarNomina,
        clearError 
    } = useNomina();

    useEffect(() => {
        cargarNominas();
    }, []);

    const cargarNominas = async () => {
        try {
            const data = await obtenerTodasNominas();
            setPagos(data);
        } catch (err) {
            console.error('Error al cargar nóminas:', err);
        }
    };

    const buscarPorEmpleado = async (idEmpleado) => {
        try {
            const data = await obtenerNominasPorEmpleado(idEmpleado);
            setPagos(data);
        } catch (err) {
            console.error('Error al buscar por empleado:', err);
        }
    };

    const crearNuevaNomina = async (datos) => {
        try {
            await insertarNomina(datos);
            // Recargar la lista después de insertar
            await cargarNominas();
        } catch (err) {
            console.error('Error al crear nómina:', err);
        }
    };

    const exportarExcel = () => {
        if (pagos.length === 0) {
            alert('No hay datos para exportar');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(pagos);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pagos');
        XLSX.writeFile(workbook, 'pagos_mensuales.xlsx');
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        return new Date(fecha).toLocaleDateString('es-ES');
    };

    const formatearMoneda = (cantidad) => {
        if (!cantidad) return '$0.00';
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(cantidad);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Cargando datos de nómina...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                <p>Error: {error}</p>
                <button onClick={() => { clearError(); cargarNominas(); }}>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>Pagos a realizar este mes</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={exportarExcel} style={{ marginRight: '10px' }}>
                    Exportar a Excel
                </button>
                <button onClick={cargarNominas}>
                    Actualizar Datos
                </button>
            </div>

            {pagos.length === 0 ? (
                <p>No hay datos de nómina disponibles.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Colaborador</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Periodo</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Inicio</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fin</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Horas Trabajadas</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Horas Extra</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total a Pagar</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha de Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagos.map(pago => (
                            <tr key={pago.id_nomina}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {pago.nombre_empleado || `Empleado ${pago.id_empleado}`}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pago.tipo_periodo}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {formatearFecha(pago.fecha_inicio)}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {formatearFecha(pago.fecha_fin)}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    {pago.horas_trabajadas || 0}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    {pago.horas_extra || 0}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                                    {formatearMoneda(pago.total_pago)}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {formatearFecha(pago.fecha_pago)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GenerarPagosPage;