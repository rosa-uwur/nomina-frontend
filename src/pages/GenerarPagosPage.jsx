import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const GenerarPagosPage = () => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [insertandoNomina, setInsertandoNomina] = useState(false);

    // Configuración de la URL base de tu API
    const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta según tu configuración

    useEffect(() => {
        obtenerNominas();
    }, []);

    const obtenerNominas = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_BASE_URL}/nomina/`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setPagos(data);
        } catch (error) {
            console.error('Error al obtener nóminas:', error);
            setError('Error al cargar los datos de nómina');
        } finally {
            setLoading(false);
        }
    };

    const obtenerNominasPorEmpleado = async (idEmpleado) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_BASE_URL}/nomina/empleado/${idEmpleado}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setPagos(data);
        } catch (error) {
            console.error('Error al obtener nóminas por empleado:', error);
            setError('Error al cargar los datos del empleado');
        } finally {
            setLoading(false);
        }
    };

    const insertarNuevaNomina = async (datosNomina) => {
        try {
            const response = await fetch(`${API_BASE_URL}/nomina`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosNomina)
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const nuevaNomina = await response.json();
            
            // Actualizar la lista después de insertar
            obtenerNominas();
            
            return nuevaNomina;
        } catch (error) {
            console.error('Error al insertar nómina:', error);
            throw error;
        }
    };

    // Nueva función para llamar al endpoint insNomina
    const insertarNominaEndpoint = async () => {
        try {
            setInsertandoNomina(true);
            setError(null);
            
            const response = await fetch(`${API_BASE_URL}/nomina/insNomina`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const resultado = await response.json();
            console.log('Nómina insertada exitosamente:', resultado);
            
            // Actualizar la tabla después de la inserción
            await obtenerNominas();
            
            alert('Nómina insertada exitosamente');
        } catch (error) {
            console.error('Error al insertar nómina:', error);
            setError('Error al insertar la nómina');
            alert('Error al insertar la nómina. Por favor, intenta de nuevo.');
        } finally {
            setInsertandoNomina(false);
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
        if (!cantidad) return 'Q0.00';
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'GTQ'
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
                <p>{error}</p>
                <button onClick={obtenerNominas} style={{ marginTop: '10px' }}>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>Pagos a realizar este mes</h2>

            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={insertarNominaEndpoint} 
                    disabled={insertandoNomina}
                    style={{ 
                        marginRight: '10px',
                        backgroundColor: insertandoNomina ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        cursor: insertandoNomina ? 'not-allowed' : 'pointer',
                        borderRadius: '4px'
                    }}
                >
                    {insertandoNomina ? 'Insertando...' : 'Insertar Nómina'}
                </button>
                <button onClick={exportarExcel} style={{ marginRight: '10px' }}>
                    Exportar a Excel
                </button>
                <button onClick={obtenerNominas}>
                    Actualizar Datos
                </button>
            </div>

            {pagos.length === 0 ? (
                <p>No hay datos de nómina disponibles.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID Nómina</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID Empleado</th>
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
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pago.id_nomina}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pago.id_empleado}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {pago.nombre_empleado || 'N/A'}
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