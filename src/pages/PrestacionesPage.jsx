import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const PrestacionesPage = () => {
  const [prestaciones, setPrestaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    id_prestacion: null,
    id_empleado: '',
    tipo_prestacion: '',
    monto: '',
    fecha: ''
  });
  const [editando, setEditando] = useState(false);

  const API_URL = 'http://localhost:3000/api/prestacion';

  const cargarPrestaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setPrestaciones(response.data);
    } catch (error) {
      console.error('Error al obtener prestaciones:', error);
      setError('Error al cargar las prestaciones: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const calcularPrestaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/`);
      alert('Prestaciones calculadas correctamente');
      // Recargar las prestaciones después del cálculo
      await cargarPrestaciones();
    } catch (error) {
      console.error('Error al calcular prestaciones:', error);
      setError('Error al calcular prestaciones: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPrestaciones();
  }, []);

  const manejarCambio = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editando) {
        await axios.put(`${API_URL}/${form.id_prestacion}`, {
          tipo_prestacion: form.tipo_prestacion,
          monto: form.monto,
          fecha: form.fecha
        });
        alert('Prestación actualizada correctamente');
      } else {
        await axios.post(API_URL, {
          id_empleado: parseInt(form.id_empleado),
          tipo_prestacion: form.tipo_prestacion,
          monto: parseFloat(form.monto),
          fecha: form.fecha
        });
        alert('Prestación agregada correctamente');
      }
      
      setForm({ id_prestacion: null, id_empleado: '', tipo_prestacion: '', monto: '', fecha: '' });
      setEditando(false);
      await cargarPrestaciones();
    } catch (error) {
      console.error('Error al guardar la prestación:', error);
      setError('Error al guardar: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const editarPrestacion = prestacion => {
    setForm({
      ...prestacion,
      fecha: prestacion.fecha ? prestacion.fecha.split('T')[0] : '' // Formatear fecha para input date
    });
    setEditando(true);
  };

  const eliminarPrestacion = async id => {
    const confirmar = window.confirm('¿Estás seguro de eliminar esta prestación?');
    if (!confirmar) return;

    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_URL}/${id}`);
      alert('Prestación eliminada correctamente');
      await cargarPrestaciones();
    } catch (error) {
      console.error('Error al eliminar prestación:', error);
      setError('Error al eliminar: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const buscarPorEmpleado = async () => {
    const idEmpleado = prompt('Ingrese el ID del empleado:');
    if (!idEmpleado || isNaN(parseInt(idEmpleado))) {
      alert('ID de empleado inválido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/empleado/${idEmpleado}`);
      setPrestaciones(response.data);
    } catch (error) {
      console.error('Error al buscar por empleado:', error);
      setError('Error al buscar por empleado: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = () => {
    if (prestaciones.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(prestaciones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Prestaciones');
    XLSX.writeFile(workbook, 'prestaciones.xlsx');
  };

  const cancelarEdicion = () => {
    setForm({ id_prestacion: null, id_empleado: '', tipo_prestacion: '', monto: '', fecha: '' });
    setEditando(false);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const formatearMoneda = (monto) => {
    if (!monto) return 'Q.0.00';
    return `Q.${parseFloat(monto).toFixed(2)}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Prestaciones de trabajo</h2>

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '10px',
          backgroundColor: '#e3f2fd',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          Cargando...
        </div>
      )}

      <form onSubmit={manejarSubmit} style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}>
        <div style={{ marginTop: '10px' }}>
          {editando && (
            <button type="button" onClick={cancelarEdicion} disabled={loading}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div style={{ marginBottom: '20px' }}>
        {/* <button onClick={exportarExcel} disabled={loading} style={{ marginRight: '10px' }}>
          Exportar a Excel
        </button>
        <button onClick={cargarPrestaciones} disabled={loading} style={{ marginRight: '10px' }}>
          Actualizar Lista
        </button>
        <button onClick={buscarPorEmpleado} disabled={loading} style={{ marginRight: '10px' }}>
          Buscar por Empleado
        </button> */}
        <button onClick={calcularPrestaciones} disabled={loading} style={{ 
          backgroundColor: '#4CAF50', 
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px'
        }}>
          Calcular Prestaciones
        </button> 
      </div>

      {prestaciones.length === 0 && !loading ? (
        <p>No hay prestaciones disponibles.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre Empleado</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tipo</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Monto</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prestaciones.map(p => (
              <tr key={p.id_prestacion}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.id_prestacion}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.nombre_completo}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.tipo_prestacion}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                  {formatearMoneda(p.monto)}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {formatearFecha(p.fecha)}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button 
                    onClick={() => editarPrestacion(p)} 
                    disabled={loading}
                    style={{ marginRight: '5px' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarPrestacion(p.id_prestacion)} 
                    disabled={loading}
                    style={{ backgroundColor: '#f44336', color: 'white' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PrestacionesPage;