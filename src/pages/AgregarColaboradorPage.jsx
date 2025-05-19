import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AgregarColaboradorPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [confirmarBajaId, setConfirmarBajaId] = useState(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    apellido: '',
    puesto: '',
    salario_base: '',
    fecha_ingreso: '',
    estado: 'activo'
  });

  useEffect(() => {
    const empleadosSimulados = [
      {
        id_empleado: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        puesto: 'Analista',
        salario_base: 5000,
        fecha_ingreso: '2022-03-10',
        estado: 'activo',
      },
    ];
    setEmpleados(empleadosSimulados);
  }, []);

  const handleChange = (e) => {
    setNuevoEmpleado({ ...nuevoEmpleado, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevo = {
      id_empleado: empleados.length + 1,
      ...nuevoEmpleado
    };

    try {
      // await axios.post('/api/empleados', nuevo);
      setEmpleados([...empleados, nuevo]);
    } catch (error) {
      console.error('Error al agregar colaborador', error);
    }

    setMostrarFormulario(false);
    setNuevoEmpleado({
      nombre: '',
      apellido: '',
      puesto: '',
      salario_base: '',
      fecha_ingreso: '',
      estado: 'activo'
    });
  };

  const confirmarBaja = (id) => {
    setConfirmarBajaId(id);
  };

  const cancelarBaja = () => {
    setConfirmarBajaId(null);
  };

  const darDeBaja = async () => {
    const actualizado = empleados.map(emp =>
      emp.id_empleado === confirmarBajaId ? { ...emp, estado: 'inactivo' } : emp
    );

    try {
      // await axios.put(`/api/empleados/${confirmarBajaId}/baja`);
      setEmpleados(actualizado);
    } catch (error) {
      console.error('Error al dar de baja al colaborador', error);
    }

    setConfirmarBajaId(null);
  };

  return (
    <div>
      <h2>Colaboradores Activos</h2>
      <button onClick={() => setMostrarFormulario(true)}>+ Agregar Colaborador</button>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Puesto</th>
            <th>Salario Base</th>
            <th>Fecha Ingreso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados
            .filter(emp => emp.estado === 'activo')
            .map(emp => (
              <tr key={emp.id_empleado}>
                <td>{emp.nombre}</td>
                <td>{emp.apellido}</td>
                <td>{emp.puesto}</td>
                <td>${emp.salario_base}</td>
                <td>{emp.fecha_ingreso}</td>
                <td>
                  <button
                    style={{ backgroundColor: '#ef9a9a', color: '#b71c1c' }}
                    onClick={() => confirmarBaja(emp.id_empleado)}
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
              <input type="text" name="nombre" placeholder="Nombre" value={nuevoEmpleado.nombre} onChange={handleChange} required />
              <input type="text" name="apellido" placeholder="Apellido" value={nuevoEmpleado.apellido} onChange={handleChange} required />
              <input type="text" name="puesto" placeholder="Puesto" value={nuevoEmpleado.puesto} onChange={handleChange} required />
              <input type="number" name="salario_base" placeholder="Salario Base" value={nuevoEmpleado.salario_base} onChange={handleChange} required />
              <input type="date" name="fecha_ingreso" value={nuevoEmpleado.fecha_ingreso} onChange={handleChange} required />
              <div style={{ marginTop: '1rem' }}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setMostrarFormulario(false)} style={{ marginLeft: '1rem', backgroundColor: '#ccc' }}>
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
              <button onClick={darDeBaja} style={{ backgroundColor: '#d32f2f', color: 'white' }}>Sí, dar de baja</button>
              <button onClick={cancelarBaja} style={{ marginLeft: '1rem' }}>Cancelar</button>
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
