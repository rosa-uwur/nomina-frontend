import React, { useState, useEffect } from 'react';

const ProductividadPage = () => {
    // Estados para manejar los datos
    const [indicadores, setIndicadores] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [editando, setEditando] = useState(null);

    // Estado para el formulario
    const [formulario, setFormulario] = useState({
        id_empleado: '',
        tareas_realizadas: '',
        horas_trabajadas: '',
        fecha: new Date().toISOString().split('T')[0]
    });

    // Cargar datos iniciales (simulado)
    useEffect(() => {
        // Simulación de carga de empleados
        const empleadosMock = [
            { id_empleado: 1, nombre: 'Ana García' },
            { id_empleado: 2, nombre: 'Luis Rodríguez' },
            { id_empleado: 3, nombre: 'Carmen Pérez' },
            { id_empleado: 4, nombre: 'Javier López' }
        ];

        // Simulación de carga de indicadores
        const indicadoresMock = [
            { id_indicador: 1, id_empleado: 1, tareas_realizadas: 20, horas_trabajadas: 8, eficiencia: 2.50, fecha: '2025-05-15' },
            { id_indicador: 2, id_empleado: 2, tareas_realizadas: 15, horas_trabajadas: 8, eficiencia: 1.88, fecha: '2025-05-15' },
            { id_indicador: 3, id_empleado: 3, tareas_realizadas: 18, horas_trabajadas: 7, eficiencia: 2.57, fecha: '2025-05-16' },
            { id_indicador: 4, id_empleado: 4, tareas_realizadas: 22, horas_trabajadas: 8, eficiencia: 2.75, fecha: '2025-05-16' }
        ];

        setEmpleados(empleadosMock);
        setIndicadores(indicadoresMock);
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
    const agregarIndicador = (e) => {
        e.preventDefault();

        // Validar campos obligatorios
        if (!formulario.id_empleado || !formulario.tareas_realizadas || !formulario.horas_trabajadas) {
            alert('Por favor complete todos los campos');
            return;
        }

        const nuevoIndicador = {
            id_indicador: indicadores.length + 1,
            id_empleado: parseInt(formulario.id_empleado),
            tareas_realizadas: parseInt(formulario.tareas_realizadas),
            horas_trabajadas: parseInt(formulario.horas_trabajadas),
            eficiencia: calcularEficiencia(formulario.tareas_realizadas, formulario.horas_trabajadas),
            fecha: formulario.fecha
        };

        setIndicadores([...indicadores, nuevoIndicador]);

        // Limpiar formulario
        setFormulario({
            id_empleado: '',
            tareas_realizadas: '',
            horas_trabajadas: '',
            fecha: new Date().toISOString().split('T')[0]
        });
    };

    // Eliminar indicador
    const eliminarIndicador = (id) => {
        if (window.confirm('¿Está seguro de eliminar este indicador?')) {
            setIndicadores(indicadores.filter(item => item.id_indicador !== id));
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
    const guardarEdicion = (e) => {
        e.preventDefault();

        const indicadoresActualizados = indicadores.map(item => {
            if (item.id_indicador === editando) {
                return {
                    ...item,
                    id_empleado: parseInt(formulario.id_empleado),
                    tareas_realizadas: parseInt(formulario.tareas_realizadas),
                    horas_trabajadas: parseInt(formulario.horas_trabajadas),
                    eficiencia: calcularEficiencia(formulario.tareas_realizadas, formulario.horas_trabajadas),
                    fecha: formulario.fecha
                };
            }
            return item;
        });

        setIndicadores(indicadoresActualizados);
        setEditando(null);

        // Limpiar formulario
        setFormulario({
            id_empleado: '',
            tareas_realizadas: '',
            horas_trabajadas: '',
            fecha: new Date().toISOString().split('T')[0]
        });
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
    };

    // Obtener nombre de empleado por ID
    const getNombreEmpleado = (id) => {
        const empleado = empleados.find(emp => emp.id_empleado === id);
        return empleado ? empleado.nombre : 'Desconocido';
    };

    // Calcular estadísticas
    const calcularEstadisticas = () => {
        if (indicadores.length === 0) return { promedio: 0, max: 0, min: 0 };

        const eficiencias = indicadores.map(item => parseFloat(item.eficiencia));
        const promedio = (eficiencias.reduce((a, b) => a + b, 0) / eficiencias.length).toFixed(2);
        const max = Math.max(...eficiencias).toFixed(2);
        const min = Math.min(...eficiencias).toFixed(2);

        return { promedio, max, min };
    };

    const estadisticas = calcularEstadisticas();

    return (
        <div className="productividad-container" style={{ padding: '20px' }}>
            <h1>Indicadores de Productividad</h1>

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
                <form onSubmit={editando ? guardarEdicion : agregarIndicador} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
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
                            required
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
                            required
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
                            required
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
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit">
                            {editando ? 'Guardar Cambios' : 'Agregar Indicador'}
                        </button>

                        {editando && (
                            <button
                                type="button"
                                onClick={cancelarEdicion}
                                style={{ backgroundColor: '#ffccbc', color: '#c63f17' }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tabla de indicadores */}
            <div className="table-container">
                <h2>Listado de Indicadores</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Empleado</th>
                            <th>Tareas</th>
                            <th>Horas</th>
                            <th>Eficiencia</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {indicadores.length > 0 ? (
                            indicadores.map(indicador => (
                                <tr key={indicador.id_indicador}>
                                    <td>{indicador.id_indicador}</td>
                                    <td>{getNombreEmpleado(indicador.id_empleado)}</td>
                                    <td>{indicador.tareas_realizadas}</td>
                                    <td>{indicador.horas_trabajadas}</td>
                                    <td>{indicador.eficiencia}</td>
                                    <td>{indicador.fecha}</td>
                                    <td>
                                        <button onClick={() => iniciarEdicion(indicador)}>Editar</button>
                                        <button
                                            onClick={() => eliminarIndicador(indicador.id_indicador)}
                                            style={{ backgroundColor: '#ffccbc', color: '#c63f17' }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No hay indicadores registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductividadPage;