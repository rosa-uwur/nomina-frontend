import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta según tu configuración

const ProductividadPage = () => {
    // Estados para manejar los datos
    const [indicadores, setIndicadores] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [editando, setEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Estado para el formulario
    const [formulario, setFormulario] = useState({
        id_empleado: '',
        tareas_realizadas: '',
        horas_trabajadas: '',
        fecha: new Date().toISOString().split('T')[0]
    });

    // Funciones para interactuar con la API
    const apiCall = async (url, options = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en API:', error);
            throw error;
        }
    };

    // Cargar indicadores desde la API
    const cargarIndicadores = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await apiCall('/productividad');
            setIndicadores(data);
        } catch (error) {
            setError('Error al cargar los indicadores: ' + error.message);
        } finally {
            setCargando(false);
        }
    };

    // Cargar empleados (simulado - puedes crear una API para esto también)
    const fetchEmpleados = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/api/empleado');
            setEmpleados(res.data);
            setError(null);
            console.log('Lista de empleados actualizada:', res.data); // Para debug
        } catch (err) {
            console.error('Error al obtener empleados:', err);
            setError('Error al cargar empleados: ' + err.message);
        } finally {
            setLoading(false);
        }
    };


    // Cargar datos iniciales
    useEffect(() => {
        cargarIndicadores();
        fetchEmpleados();
    }, []);

    // Calcular eficiencia
    const calcularEficiencia = (tareas, horas) => {
        if (horas <= 0) return 0;
        return (tareas / horas).toFixed(2);
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    // Agregar nuevo indicador
    const agregarIndicador = async (e) => {
        e.preventDefault();

        // Validar campos obligatorios
        if (!formulario.id_empleado || !formulario.tareas_realizadas || !formulario.horas_trabajadas) {
            setError('Por favor complete todos los campos');
            return;
        }

        try {
            setCargando(true);
            setError(null);

            const nuevoIndicador = {
                id_empleado: parseInt(formulario.id_empleado),
                tareas_realizadas: parseInt(formulario.tareas_realizadas),
                horas_trabajadas: parseInt(formulario.horas_trabajadas),
                fecha: formulario.fecha
            };

            await apiCall('/productividad', {
                method: 'POST',
                body: JSON.stringify(nuevoIndicador)
            });

            // Recargar la lista de indicadores
            await cargarIndicadores();

            // Limpiar formulario
            setFormulario({
                id_empleado: '',
                tareas_realizadas: '',
                horas_trabajadas: '',
                fecha: new Date().toISOString().split('T')[0]
            });

            setError(null);
        } catch (error) {
            setError('Error al agregar el indicador: ' + error.message);
        } finally {
            setCargando(false);
        }
    };

    // Eliminar indicador
    const eliminarIndicador = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este indicador?')) {
            return;
        }

        try {
            setCargando(true);
            setError(null);

            await apiCall(`/productividad/${id}`, {
                method: 'DELETE'
            });

            // Recargar la lista de indicadores
            await cargarIndicadores();
        } catch (error) {
            setError('Error al eliminar el indicador: ' + error.message);
        } finally {
            setCargando(false);
        }
    };

    // Iniciar edición
    const iniciarEdicion = (indicador) => {
        setEditando(indicador.id_indicador);
        setFormulario({
            id_empleado: indicador.id_empleado.toString(),
            tareas_realizadas: indicador.tareas_realizadas.toString(),
            horas_trabajadas: indicador.horas_trabajadas.toString(),
            fecha: indicador.fecha
        });
    };

    // Guardar cambios de edición
    const guardarEdicion = async (e) => {
        e.preventDefault();

        try {
            setCargando(true);
            setError(null);

            const indicadorActualizado = {
                id_empleado: parseInt(formulario.id_empleado),
                tareas_realizadas: parseInt(formulario.tareas_realizadas),
                horas_trabajadas: parseInt(formulario.horas_trabajadas),
                fecha: formulario.fecha
            };

            await apiCall(`/productividad/${editando}`, {
                method: 'PUT',
                body: JSON.stringify(indicadorActualizado)
            });

            // Recargar la lista de indicadores
            await cargarIndicadores();

            setEditando(null);

            // Limpiar formulario
            setFormulario({
                id_empleado: '',
                tareas_realizadas: '',
                horas_trabajadas: '',
                fecha: new Date().toISOString().split('T')[0]
            });

            setError(null);
        } catch (error) {
            setError('Error al actualizar el indicador: ' + error.message);
        } finally {
            setCargando(false);
        }
    };

    // Cancelar edición
    const cancelarEdicion = () => {
        setEditando(null);
        setFormulario({
            id_empleado: '',
            tareas_realizadas: '',
            horas_trabajadas: '',
            fecha: new Date().toISOString().split('T')[0]
        });
        setError(null);
    };

    // Obtener nombre de empleado por ID
    const getNombreEmpleado = (id) => {
        const empleado = empleados.find(emp => emp.id_empleado === id);
        return empleado ? empleado.nombre : 'Desconocido';
    };

    // Calcular estadísticas
    const calcularEstadisticas = () => {
        if (indicadores.length === 0) return { promedio: 0, max: 0, min: 0 };

        // Calcular eficiencia para cada indicador si no viene de la API
        const eficiencias = indicadores.map(item => {
            const eficiencia = item.eficiencia || calcularEficiencia(item.tareas_realizadas, item.horas_trabajadas);
            return parseFloat(eficiencia);
        });

        const promedio = (eficiencias.reduce((a, b) => a + b, 0) / eficiencias.length).toFixed(2);
        const max = Math.max(...eficiencias).toFixed(2);
        const min = Math.min(...eficiencias).toFixed(2);

        return { promedio, max, min };
    };

    const estadisticas = calcularEstadisticas();

    return (
        <div className="productividad-container" style={{ padding: '20px' }}>
            <h1>Indicadores de Productividad</h1>

            {/* Mostrar errores */}
            {error && (
                <div style={{
                    background: '#ffebee',
                    color: '#c62828',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #ffcdd2'
                }}>
                    {error}
                </div>
            )}

            {/* Indicador de carga */}
            {cargando && (
                <div style={{
                    background: '#e3f2fd',
                    color: '#1565c0',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    Cargando...
                </div>
            )}

            {/* Panel de estadísticas */}
            <div className="estadisticas-panel" style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '20px 0',
                background: '#f0f4c3',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div className="estadistica">
                    <h3>Eficiencia Promedio</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{estadisticas.promedio}</p>
                </div>
                <div className="estadistica">
                    <h3>Eficiencia Máxima</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{estadisticas.max}</p>
                </div>
                <div className="estadistica">
                    <h3>Eficiencia Mínima</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{estadisticas.min}</p>
                </div>
            </div>

            {/* Formulario */}
            <div className="form-container" style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <h2>{editando ? 'Editar Indicador' : 'Nuevo Indicador de Productividad'}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label htmlFor="id_empleado">Empleado:</label>
                        <select
                            id="id_empleado"
                            name="id_empleado"
                            value={formulario.id_empleado}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #ccc'
                            }}
                            disabled={cargando}
                        >
                            <option value="">Seleccione empleado</option>
                            {empleados.map(emp => (
                                <option key={emp.id_empleado} value={emp.id_empleado}>
                                    {emp.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: '1', minWidth: '150px' }}>
                        <label htmlFor="tareas_realizadas">Tareas realizadas:</label>
                        <input
                            type="number"
                            id="tareas_realizadas"
                            name="tareas_realizadas"
                            value={formulario.tareas_realizadas}
                            onChange={handleInputChange}
                            min="0"
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #ccc'
                            }}
                            disabled={cargando}
                        />
                    </div>

                    <div style={{ flex: '1', minWidth: '150px' }}>
                        <label htmlFor="horas_trabajadas">Horas trabajadas:</label>
                        <input
                            type="number"
                            id="horas_trabajadas"
                            name="horas_trabajadas"
                            value={formulario.horas_trabajadas}
                            onChange={handleInputChange}
                            min="1"
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #ccc'
                            }}
                            disabled={cargando}
                        />
                    </div>

                    <div style={{ flex: '1', minWidth: '150px' }}>
                        <label htmlFor="fecha">Fecha:</label>
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            value={formulario.fecha}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #ccc'
                            }}
                            disabled={cargando}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={editando ? guardarEdicion : agregarIndicador}
                            disabled={cargando}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: cargando ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {editando ? 'Guardar Cambios' : 'Agregar Indicador'}
                        </button>

                        {editando && (
                            <button
                                onClick={cancelarEdicion}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#ffccbc',
                                    color: '#c63f17',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                disabled={cargando}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabla de indicadores */}
            <div className="table-container">
                <h2>Listado de Indicadores</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Empleado</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tareas</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Horas</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Eficiencia</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Fecha</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {indicadores.length > 0 ? (
                            indicadores.map(indicador => (
                                <tr key={indicador.id_indicador}>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{indicador.id_indicador}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{getNombreEmpleado(indicador.id_empleado)}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{indicador.tareas_realizadas}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{indicador.horas_trabajadas}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        {indicador.eficiencia || calcularEficiencia(indicador.tareas_realizadas, indicador.horas_trabajadas)}
                                    </td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        {new Date(indicador.fecha).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        <button
                                            onClick={() => iniciarEdicion(indicador)}
                                            disabled={cargando}
                                            style={{
                                                marginRight: '5px',
                                                padding: '4px 8px',
                                                backgroundColor: '#2196f3',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: cargando ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarIndicador(indicador.id_indicador)}
                                            style={{
                                                padding: '4px 8px',
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: cargando ? 'not-allowed' : 'pointer'
                                            }}
                                            disabled={cargando}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', border: '1px solid #ddd' }}>
                                    {cargando ? 'Cargando indicadores...' : 'No hay indicadores registrados'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default ProductividadPage;