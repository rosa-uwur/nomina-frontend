import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const PrestacionesPage = () => {
  const [prestaciones, setPrestaciones] = useState([]);
  const [form, setForm] = useState({
    id_prestacion: null,
    id_empleado: '',
    tipo_prestacion: '',
    monto: '',
    fecha: ''
  });
  const [editando, setEditando] = useState(false);

  const API_URL = 'http://localhost:8080/api/prestaciones'; // Cambia esto según tu backend

  const cargarPrestaciones = async () => {
    try {
      const response = await axios.get(API_URL);
      setPrestaciones(response.data);
    } catch (error) {
      console.error('Error al obtener prestaciones:', error);
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
      if (editando) {
        await axios.put(`${API_URL}/${form.id_prestacion}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ id_prestacion: null, id_empleado: '', tipo_prestacion: '', monto: '', fecha: '' });
      setEditando(false);
      cargarPrestaciones();
    } catch (error) {
      console.error('Error al guardar la prestación:', error);
    }
  };

  const editarPrestacion = prestacion => {
    setForm(prestacion);
    setEditando(true);
  };

  const eliminarPrestacion = async id => {
    const confirmar = window.confirm('¿Estás seguro de eliminar esta prestación?');
    if (!confirmar) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      cargarPrestaciones();
    } catch (error) {
      console.error('Error al eliminar prestación:', error);
    }
  };

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(prestaciones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Prestaciones');
    XLSX.writeFile(workbook, 'prestaciones.xlsx');
  };

  return (
    <div>
      <h2>Prestaciones de trabajo</h2>

      <form onSubmit={manejarSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="number"
          name="id_empleado"
          placeholder="ID Empleado"
          value={form.id_empleado}
          onChange={manejarCambio}
          required
        />
        <input
          type="text"
          name="tipo_prestacion"
          placeholder="Tipo de Prestación"
          value={form.tipo_prestacion}
          onChange={manejarCambio}
          required
        />
        <input
          type="number"
          step="0.01"
          name="monto"
          placeholder="Monto"
          value={form.monto}
          onChange={manejarCambio}
          required
        />
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={manejarCambio}
          required
        />
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
      </form>

      <button onClick={exportarExcel} style={{ marginBottom: '10px' }}>
        Exportar a Excel
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Empleado</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestaciones.map(p => (
            <tr key={p.id_prestacion}>
              <td>{p.id_prestacion}</td>
              <td>{p.id_empleado}</td>
              <td>{p.tipo_prestacion}</td>
              <td>${parseFloat(p.monto).toFixed(2)}</td>
              <td>{p.fecha}</td>
              <td>
                <button onClick={() => editarPrestacion(p)}>Editar</button>
                <button onClick={() => eliminarPrestacion(p.id_prestacion)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrestacionesPage;
