import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ReportesPage = () => {
  // Estado para controlar qué reporte se muestra
  const [reporteActivo, setReporteActivo] = useState('plantilla');

  // Estados para almacenar los datos de cada reporte
  const [plantillaActual, setPlantillaActual] = useState([]);
  const [rotacionPersonal, setRotacionPersonal] = useState([]);
  const [distribucionSalarial, setDistribucionSalarial] = useState({
    porPuesto: [],
    porAntiguedad: [],
    porPercentil: []
  });

  // Estado para controlar la carga de datos
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Configuración de la API
  const API_BASE_URL = 'http://localhost:3000/api';

  // Efecto para cargar los datos al iniciar
  useEffect(() => {
    cargarDatosDesdeAPI();
  }, []);

  // Función genérica para hacer llamadas a la API
  const llamarAPI = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar token de autenticación si es necesario
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al llamar a ${endpoint}:`, error);
      throw error;
    }
  };

  // Función para cargar todos los datos desde la API
  const cargarDatosDesdeAPI = async () => {
    setCargando(true);
    setError(null);

    try {
      // Llamadas paralelas a todas las APIs
      const [
        plantillaResponse,
        rotacionResponse,
        distribucionPuestoResponse,
        distribucionAntiguedadResponse,
        distribucionPercentilResponse
      ] = await Promise.all([
        llamarAPI('/Planilla'),
        llamarAPI('/Rotacion'),
        //llamarAPI('/Salario'),
        //llamarAPI('/reportes/distribucion-salarial/antiguedad'),
        //llamarAPI('/reportes/distribucion-salarial/percentil')
      ]);

      // Actualizar estados con los datos de la API
      setPlantillaActual(plantillaResponse.data || plantillaResponse);
      setRotacionPersonal(rotacionResponse.data || rotacionResponse || []);
      setDistribucionSalarial({
        porPuesto: distribucionPuestoResponse.data || distribucionPuestoResponse,
        porAntiguedad: distribucionAntiguedadResponse.data || distribucionAntiguedadResponse,
        porPercentil: distribucionPercentilResponse.data || distribucionPercentilResponse
      });

    } catch (error) {
      console.error('Error al cargar datos:', error);
      //setError('Error al cargar los datos. Por favor, inténtelo de nuevo.');

      // Opcional: cargar datos de respaldo en caso de error
      // cargarDatosDePrueba();
    } finally {
      setCargando(false);
    }
  };

  // Función para recargar los datos
  const recargarDatos = () => {
    cargarDatosDesdeAPI();
  };

  // Función alternativa para cargar datos individualmente (útil para refrescar solo un reporte)
  const cargarReporteEspecifico = async (tipoReporte) => {
    setCargando(true);
    setError(null);

    try {
      switch (tipoReporte) {
        case 'plantilla':
          const plantillaData = await llamarAPI('/reportes/plantilla-actual');
          setPlantillaActual(plantillaData.data || plantillaData);
          break;

        case 'rotacion':
          const rotacionData = await llamarAPI('/reportes/rotacion-personal');
          setRotacionPersonal({
            altas: rotacionData.altas || rotacionData.data || rotacionData
          });
          break;

        case 'distribucion':
          const [puestoData, antiguedadData, percentilData] = await Promise.all([
            llamarAPI('/reportes/distribucion-salarial/puesto'),
            llamarAPI('/reportes/distribucion-salarial/antiguedad'),
            llamarAPI('/reportes/distribucion-salarial/percentil')
          ]);

          setDistribucionSalarial({
            porPuesto: puestoData.data || puestoData,
            porAntiguedad: antiguedadData.data || antiguedadData,
            porPercentil: percentilData.data || percentilData
          });
          break;

        default:
          throw new Error('Tipo de reporte no válido');
      }
    } catch (error) {
      console.error(`Error al cargar reporte ${tipoReporte}:`, error);
      setError(`Error al cargar el reporte de ${tipoReporte}. Por favor, inténtelo de nuevo.`);
    } finally {
      setCargando(false);
    }
  };

  // Función de respaldo con datos de prueba (opcional)
  const cargarDatosDePrueba = () => {
    console.warn('Cargando datos de prueba como respaldo');

    // Datos de plantilla actual
    const plantilla = [
      { id_empleado: 1, nombre: 'Ana', apellido: 'García', puesto: 'Desarrollador Senior', salario_base: 45000.00, fecha_ingreso: '2019-05-15', años_antiguedad: 6, meses_adicionales: 0 },
      { id_empleado: 2, nombre: 'Luis', apellido: 'Rodríguez', puesto: 'Diseñador UX', salario_base: 38000.00, fecha_ingreso: '2020-10-03', años_antiguedad: 4, meses_adicionales: 7 },
      { id_empleado: 3, nombre: 'Carmen', apellido: 'Pérez', puesto: 'Gerente de Proyecto', salario_base: 55000.00, fecha_ingreso: '2018-01-22', años_antiguedad: 7, meses_adicionales: 3 },
      { id_empleado: 4, nombre: 'Javier', apellido: 'López', puesto: 'Desarrollador Junior', salario_base: 32000.00, fecha_ingreso: '2023-03-10', años_antiguedad: 2, meses_adicionales: 2 },
      { id_empleado: 5, nombre: 'Elena', apellido: 'Martínez', puesto: 'Analista de Datos', salario_base: 42000.00, fecha_ingreso: '2021-07-08', años_antiguedad: 3, meses_adicionales: 10 },
      { id_empleado: 6, nombre: 'Miguel', apellido: 'Sánchez', puesto: 'Desarrollador Senior', salario_base: 48000.00, fecha_ingreso: '2017-11-15', años_antiguedad: 7, meses_adicionales: 6 },
      { id_empleado: 7, nombre: 'Laura', apellido: 'Díaz', puesto: 'Diseñador UX', salario_base: 37500.00, fecha_ingreso: '2022-09-01', años_antiguedad: 2, meses_adicionales: 8 },
      { id_empleado: 8, nombre: 'Roberto', apellido: 'Fernández', puesto: 'Analista de Datos', salario_base: 43000.00, fecha_ingreso: '2020-05-20', años_antiguedad: 5, meses_adicionales: 0 }
    ];

    // Datos de rotación de personal (altas por mes)
    const altas = [
      { año: 2024, mes: 5, nuevas_contrataciones: 2 },
      { año: 2024, mes: 4, nuevas_contrataciones: 1 },
      { año: 2024, mes: 3, nuevas_contrataciones: 0 },
      { año: 2024, mes: 2, nuevas_contrataciones: 3 },
      { año: 2024, mes: 1, nuevas_contrataciones: 1 },
      { año: 2023, mes: 12, nuevas_contrataciones: 0 },
      { año: 2023, mes: 11, nuevas_contrataciones: 2 },
      { año: 2023, mes: 10, nuevas_contrataciones: 1 },
      { año: 2023, mes: 9, nuevas_contrataciones: 1 },
      { año: 2023, mes: 8, nuevas_contrataciones: 0 },
      { año: 2023, mes: 7, nuevas_contrataciones: 2 },
      { año: 2023, mes: 6, nuevas_contrataciones: 1 }
    ];

    // Datos de distribución salarial por puesto
    const distribucionPorPuesto = [
      { puesto: 'Gerente de Proyecto', num_empleados: 1, salario_minimo: 55000.00, salario_maximo: 55000.00, salario_promedio: 55000.00, desviacion_estandar: 0 },
      { puesto: 'Desarrollador Senior', num_empleados: 2, salario_minimo: 45000.00, salario_maximo: 48000.00, salario_promedio: 46500.00, desviacion_estandar: 2121.32 },
      { puesto: 'Analista de Datos', num_empleados: 2, salario_minimo: 42000.00, salario_maximo: 43000.00, salario_promedio: 42500.00, desviacion_estandar: 707.11 },
      { puesto: 'Diseñador UX', num_empleados: 2, salario_minimo: 37500.00, salario_maximo: 38000.00, salario_promedio: 37750.00, desviacion_estandar: 353.55 },
      { puesto: 'Desarrollador Junior', num_empleados: 1, salario_minimo: 32000.00, salario_maximo: 32000.00, salario_promedio: 32000.00, desviacion_estandar: 0 }
    ];

    // Datos de distribución salarial por antigüedad
    const distribucionPorAntiguedad = [
      { rango_antiguedad: 'Más de 10 años', num_empleados: 0, salario_minimo: 0, salario_maximo: 0, salario_promedio: 0 },
      { rango_antiguedad: '6-10 años', num_empleados: 3, salario_minimo: 45000.00, salario_maximo: 55000.00, salario_promedio: 49333.33 },
      { rango_antiguedad: '3-5 años', num_empleados: 3, salario_minimo: 38000.00, salario_maximo: 43000.00, salario_promedio: 41000.00 },
      { rango_antiguedad: '1-2 años', num_empleados: 2, salario_minimo: 32000.00, salario_maximo: 37500.00, salario_promedio: 34750.00 },
      { rango_antiguedad: 'Menos de 1 año', num_empleados: 0, salario_minimo: 0, salario_maximo: 0, salario_promedio: 0 }
    ];

    // Datos de distribución salarial por percentil
    const distribucionPorPercentil = [
      { rango_percentil: 'Cuartil 1 (0-25%)', num_empleados: 2, salario_minimo: 32000.00, salario_maximo: 37500.00, salario_promedio: 34750.00 },
      { rango_percentil: 'Cuartil 2 (26-50%)', num_empleados: 2, salario_minimo: 38000.00, salario_maximo: 42000.00, salario_promedio: 40000.00 },
      { rango_percentil: 'Cuartil 3 (51-75%)', num_empleados: 2, salario_minimo: 43000.00, salario_maximo: 45000.00, salario_promedio: 44000.00 },
      { rango_percentil: 'Cuartil 4 (76-100%)', num_empleados: 2, salario_minimo: 48000.00, salario_maximo: 55000.00, salario_promedio: 51500.00 }
    ];

    // Actualizar estados con los datos
    setPlantillaActual(plantilla);
    setRotacionPersonal({ altas });
    setDistribucionSalarial({
      porPuesto: distribucionPorPuesto,
      porAntiguedad: distribucionPorAntiguedad,
      porPercentil: distribucionPorPercentil
    });
  };

  // Función para exportar datos a Excel
  const exportarExcel = (datos, nombreArchivo) => {
    // Crear una hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(datos);

    // Crear un libro
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    // Guardar el archivo
    XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
  };

  // Función para exportar múltiples hojas a Excel
  const exportarMultiplesHojas = (reportes, nombreArchivo) => {
    const wb = XLSX.utils.book_new();

    Object.entries(reportes).forEach(([nombreHoja, datos]) => {
      if (datos && datos.length > 0) {
        const ws = XLSX.utils.json_to_sheet(datos);
        XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
      }
    });

    XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
  };

  // Función para formatear fecha
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES');
  };

  // Función para formatear dinero
  const formatearDinero = (cantidad) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'GTQ'
    }).format(cantidad);
  };

  // Función para obtener el nombre del mes
  const obtenerNombreMes = (numeroMes) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril',
      'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[numeroMes - 1];
  };

  return (
    <div className="reportes-container" style={{ padding: '20px' }}>
      <h1>Reportes de Recursos Humanos</h1>

      {/* Botón para recargar datos */}
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={recargarDatos}
          disabled={cargando}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: cargando ? 'not-allowed' : 'pointer',
            opacity: cargando ? 0.6 : 1
          }}
        >
          {cargando ? 'Cargando...' : 'Recargar Datos'}
        </button>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #ef5350'
        }}>
          <strong>Error:</strong> {error}
          <button
            onClick={recargarDatos}
            style={{
              marginLeft: '10px',
              backgroundColor: '#c62828',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Selector de reportes */}
      <div className="selector-reportes" style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setReporteActivo('plantilla')}
          style={{
            backgroundColor: reporteActivo === 'plantilla' ? '#81c784' : '#a5d6a7',
            fontWeight: reporteActivo === 'plantilla' ? 'bold' : 'normal',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Plantilla Actual
        </button>
        <button
          onClick={() => setReporteActivo('rotacion')}
          style={{
            backgroundColor: reporteActivo === 'rotacion' ? '#81c784' : '#a5d6a7',
            fontWeight: reporteActivo === 'rotacion' ? 'bold' : 'normal',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Rotación de Personal
        </button>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando datos...</p>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #81c784',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : (
        <>
          {/* Reporte: Plantilla Actual */}
          {reporteActivo === 'plantilla' && (
            <div className="reporte">
              <div className="reporte-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h2>Reporte de Plantilla Actual</h2>
                <div>
                  <button
                    onClick={() => cargarReporteEspecifico('plantilla')}
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={() => exportarExcel(plantillaActual, 'Plantilla_Actual')}
                    style={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Exportar a Excel
                  </button>
                </div>
              </div>

              <div className="reporte-content">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Apellido</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Puesto</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Base</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha Ingreso</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Antigüedad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plantillaActual.map(empleado => (
                      <tr key={empleado.id_empleado}>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{empleado.id_empleado}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{empleado.nombre}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{empleado.apellido}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{empleado.puesto}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatearDinero(empleado.salario_base)}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatearFecha(empleado.fecha_ingreso)}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{`${empleado.años_antiguedad} años ${empleado.meses_adicionales > 0 ? `y ${empleado.meses_adicionales} meses` : ''}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="resumen-datos" style={{
                  marginTop: '20px',
                  backgroundColor: '#f0f4c3',
                  padding: '15px',
                  borderRadius: '8px'
                }}>
                  <h3>Resumen</h3>
                  <p><strong>Total de empleados:</strong> {plantillaActual.length}</p>
                  <p><strong>Promedio de antigüedad:</strong> {
                    plantillaActual.length > 0 ?
                      (plantillaActual.reduce((sum, emp) => sum + emp.años_antiguedad, 0) / plantillaActual.length).toFixed(1) : 0
                  } años</p>
                </div>
              </div>
            </div>
          )}

          {/* Reporte: Rotación de Personal */}
          {reporteActivo === 'rotacion' && (
            <div className="reporte">
              <div className="reporte-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h2>Reporte de Rotación de Personal</h2>
                <div>
                  <button
                    onClick={() => cargarReporteEspecifico('rotacion')}
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={() => exportarExcel(rotacionPersonal.altas, 'Rotacion_Personal')}
                    style={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Exportar a Excel
                  </button>
                </div>
              </div>


              <div className="reporte-content">
                <h3>Reporte de Rotación de Personal (Último Año)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Año</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Mes</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Altas</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Bajas</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Empleados</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tasa Rotación (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rotacionPersonal.map((item, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.anio}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{obtenerNombreMes(item.mes)}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.altas}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.bajas}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.total_empleados}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.tasa_rotacion}%</td>
                      </tr>
                    ))}
                  </tbody>

                    



                </table>

                <div className="resumen-datos" style={{
                  marginTop: '20px',
                  backgroundColor: '#e3f2fd',
                  padding: '15px',
                  borderRadius: '8px'
                }}>
                  <h3>Resumen de Rotación</h3>
                  <p><strong>Total de altas:</strong> {
                    rotacionPersonal.reduce((sum, item) => sum + item.altas, 0)
                  }</p>
                  <p><strong>Total de bajas:</strong> {
                    rotacionPersonal.reduce((sum, item) => sum + item.bajas, 0)
                  }</p>
                  <p><strong>Promedio de empleados:</strong> {
                    rotacionPersonal.length > 0 ?
                      Math.round(rotacionPersonal.reduce((sum, item) => sum + item.total_empleados, 0) / rotacionPersonal.length) : 0
                  }</p>
                  <p><strong>Tasa de rotación promedio:</strong> {
                    rotacionPersonal.length > 0 ?
                      (rotacionPersonal.reduce((sum, item) => sum + parseFloat(item.tasa_rotacion), 0) / rotacionPersonal.length).toFixed(2) : 0
                  }%</p>
                </div>
              </div>


            </div>
          )}

          {/* Reporte: Distribución Salarial */}
          {reporteActivo === 'distribucion' && (
            <div className="reporte">
              <div className="reporte-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h2>Reporte de Distribución Salarial</h2>
                <div>
                  <button
                    onClick={() => cargarReporteEspecifico('distribucion')}
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Actualizar
                  </button>
                  <button onClick={() => exportarMultiplesHojas({
                    "Por_Puesto": distribucionSalarial.porPuesto,
                    "Por_Antiguedad": distribucionSalarial.porAntiguedad,
                    "Por_Percentil": distribucionSalarial.porPercentil
                  }, 'Distribucion_Salarial')}
                    style={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                    Exportar a Excel
                  </button>
                </div>
              </div>

              <div className="reporte-content">
                {/* Selector de sub-reportes */}
                <div className="tabs" style={{
                  display: 'flex',
                  borderBottom: '1px solid #ddd',
                  marginBottom: '15px'
                }}>
                  <button
                    onClick={() => setDistribucionSalarial({ ...distribucionSalarial, activoTab: 'puesto' })}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: distribucionSalarial.activoTab === 'puesto' ? '#f0f4c3' : 'transparent',
                      border: 'none',
                      borderBottom: distribucionSalarial.activoTab === 'puesto' ? '2px solid #81c784' : 'none',
                      fontWeight: distribucionSalarial.activoTab === 'puesto' ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                  >
                    Por Puesto
                  </button>
                  <button
                    onClick={() => setDistribucionSalarial({ ...distribucionSalarial, activoTab: 'antiguedad' })}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: distribucionSalarial.activoTab === 'antiguedad' ? '#f0f4c3' : 'transparent',
                      border: 'none',
                      borderBottom: distribucionSalarial.activoTab === 'antiguedad' ? '2px solid #81c784' : 'none',
                      fontWeight: distribucionSalarial.activoTab === 'antiguedad' ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                  >
                    Por Antigüedad
                  </button>
                  <button
                    onClick={() => setDistribucionSalarial({ ...distribucionSalarial, activoTab: 'percentil' })}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: distribucionSalarial.activoTab === 'percentil' ? '#f0f4c3' : 'transparent',
                      border: 'none',
                      borderBottom: distribucionSalarial.activoTab === 'percentil' ? '2px solid #81c784' : 'none',
                      fontWeight: distribucionSalarial.activoTab === 'percentil' ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                  >
                    Por Percentil
                  </button>
                </div>

                {/* Distribución por Puesto */}
                {(!distribucionSalarial.activoTab || distribucionSalarial.activoTab === 'puesto') && (
                  <>
                    <h3>Distribución Salarial por Puesto</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Puesto</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nº Empleados</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Mínimo</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Máximo</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Promedio</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Desviación Estándar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {distribucionSalarial.porPuesto.map((item, index) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.puesto}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.num_empleados}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatearDinero(item.salario_minimo)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatearDinero(item.salario_maximo)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatearDinero(item.salario_promedio)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatearDinero(item.desviacion_estandar)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {/* Distribución por Antigüedad */}
                {distribucionSalarial.activoTab === 'antiguedad' && (
                  <>
                    <h3>Distribución Salarial por Antigüedad</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rango de Antigüedad</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nº Empleados</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Mínimo</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Máximo</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Promedio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {distribucionSalarial.porAntiguedad.map((item, index) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.rango_antiguedad}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.num_empleados}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.num_empleados > 0 ? formatearDinero(item.salario_minimo) : '-'}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.num_empleados > 0 ? formatearDinero(item.salario_maximo) : '-'}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.num_empleados > 0 ? formatearDinero(item.salario_promedio) : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {/* Distribución por Percentil */}
                {distribucionSalarial.activoTab === 'percentil' && (
                  <>
                    <h3>Distribución Salarial por Percentil</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rango Percentil</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nº Empleados</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Mínimo</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Máximo</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salario Promedio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {distribucionSalarial.porPercentil.map((item, index) => (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.rango_percentil}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.num_empleados}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatearDinero(item.salario_minimo)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatearDinero(item.salario_maximo)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatearDinero(item.salario_promedio)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Estilos CSS para la animación de carga */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ReportesPage;