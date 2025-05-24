import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AgregarColaboradorPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [confirmarBajaId, setConfirmarBajaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    apellido: '',
    puesto: '',
    salario_base: '',
    fecha_ingreso: '',
    estado: 'activo'
  });

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/empleado');
        setEmpleados(res.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener empleados:', err);
        setError('Error al cargar empleados: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const handleChange = (e) => {
    setNuevoEmpleado({ ...nuevoEmpleado, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validación básica
      if (!nuevoEmpleado.nombre.trim() || !nuevoEmpleado.apellido.trim()) {
        throw new Error('Nombre y apellido son requeridos');
      }
      
      console.log('Enviando datos:', nuevoEmpleado); // Para debug
      
      const res = await axios.post('http://localhost:3000/api/empleado', nuevoEmpleado);
      
      console.log('Empleado agregado exitosamente:', res.data); // Para debug
      
      // Refrescar la lista completa desde el servidor
      await fetchEmpleados();
      
      // Resetear formulario
      setNuevoEmpleado({
        nombre: '',
        apellido: '',
        puesto: '',
        salario_base: '',
        fecha_ingreso: '',
        estado: 'activo'
      });
      
      setMostrarFormulario(false);
      
    } catch (error) {
      console.error('Error al agregar colaborador:', error);
      setError('Error al agregar colaborador: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const confirmarBaja = (id) => {
    setConfirmarBajaId(id);
  };

  const cancelarBaja = () => {
    setConfirmarBajaId(null);
  };

  const darDeBaja = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Corregir la URL del endpoint - usar la misma base que para obtener empleados
      await axios.patch(`http://localhost:3000/api/empleado/${confirmarBajaId}/baja`);
      
      const actualizado = empleados.map(emp =>
        emp.id_empleado === confirmarBajaId ? { ...emp, estado: 'inactivo' } : emp
      );
      setEmpleados(actualizado);
      
    } catch (error) {
      console.error('Error al dar de baja al colaborador:', error);
      setError('Error al dar de baja: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }

    setConfirmarBajaId(null);
  };

  return (
    <div>
      <h2>Colaboradores Activos</h2>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <button 
        onClick={() => {
          console.log('Botón clickeado'); // Para debug
          setMostrarFormulario(true);
        }}
        disabled={loading}
      >
        {loading ? 'Cargando...' : '+ Agregar Colaborador'}
      </button>

      {loading && <p>Cargando...</p>}

      <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Apellido</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Puesto</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Base</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha Ingreso</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados
            .filter(emp => emp.estado === 'activo')
            .map(emp => (
              <tr key={emp.id_empleado}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{emp.nombre}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{emp.apellido}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{emp.puesto}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>${emp.salario_base}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{emp.fecha_ingreso}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    style={{ backgroundColor: '#ef9a9a', color: '#b71c1c' }}
                    onClick={() => confirmarBaja(emp.id_empleado)}
                    disabled={loading}
                  >
                    Dar de baja
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {mostrarFormulario && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Nuevo Colaborador</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input 
                type="text" 
                name="nombre" 
                placeholder="Nombre" 
                value={nuevoEmpleado.nombre} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
              <input 
                type="text" 
                name="apellido" 
                placeholder="Apellido" 
                value={nuevoEmpleado.apellido} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
              <input 
                type="text" 
                name="puesto" 
                placeholder="Puesto" 
                value={nuevoEmpleado.puesto} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
              <input 
                type="number" 
                name="salario_base" 
                placeholder="Salario Base" 
                value={nuevoEmpleado.salario_base} 
                onChange={handleChange} 
                required 
                min="0"
                step="0.01"
                disabled={loading}
              />
              <input 
                type="date" 
                name="fecha_ingreso" 
                value={nuevoEmpleado.fecha_ingreso} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
              <div style={{ marginTop: '1rem' }}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setMostrarFormulario(false)} 
                  style={{ marginLeft: '1rem', backgroundColor: '#ccc' }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmarBajaId !== null && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Confirmar baja</h3>
            <p>¿Estás seguro que deseas dar de baja a este colaborador?</p>
            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={darDeBaja} 
                style={{ backgroundColor: '#d32f2f', color: 'white' }}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Sí, dar de baja'}
              </button>
              <button 
                onClick={cancelarBaja} 
                style={{ marginLeft: '1rem' }}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  }
};

export default AgregarColaboradorPage;