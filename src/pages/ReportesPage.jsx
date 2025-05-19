import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ReportesPage = () => {
  // Estado para controlar qué reporte se muestra
  const [reporteActivo, setReporteActivo] = useState('plantilla');
  
  // Estados para almacenar los datos de cada reporte
  const [plantillaActual, setPlantillaActual] = useState([]);
  const [rotacionPersonal, setRotacionPersonal] = useState({
    altas: [],
    // bajas: [] // Comentado porque no tenemos fecha_baja en la estructura
  });
  const [distribucionSalarial, setDistribucionSalarial] = useState({
    porPuesto: [],
    porAntiguedad: [],
    porPercentil: []
  });
  
  // Estado para controlar la carga de datos
  const [cargando, setCargando] = useState(true);

  // Efecto para cargar los datos al iniciar
  useEffect(() => {
    // Simulación de carga de datos desde la API
    setTimeout(() => {
      cargarDatosDePrueba();
      setCargando(false);
    }, 1000);
  }, []);

  // Función para cargar datos de prueba (simulando respuestas de la API)
  const cargarDatosDePrueba = () => {
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
      currency: 'EUR'
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
            fontWeight: reporteActivo === 'plantilla' ? 'bold' : 'normal'
          }}
        >
          Plantilla Actual
        </button>
        <button 
          onClick={() => setReporteActivo('rotacion')}
          style={{ 
            backgroundColor: reporteActivo === 'rotacion' ? '#81c784' : '#a5d6a7',
            fontWeight: reporteActivo === 'rotacion' ? 'bold' : 'normal'
          }}
        >
          Rotación de Personal
        </button>
        <button 
          onClick={() => setReporteActivo('distribucion')}
          style={{ 
            backgroundColor: reporteActivo === 'distribucion' ? '#81c784' : '#a5d6a7',
            fontWeight: reporteActivo === 'distribucion' ? 'bold' : 'normal'
          }}
        >
          Distribución Salarial
        </button>
      </div>
      
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando datos...</p>
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
                <button onClick={() => exportarExcel(plantillaActual, 'Plantilla_Actual')}>
                  Exportar a Excel
                </button>
              </div>
              
              <div className="reporte-content">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Puesto</th>
                      <th>Salario Base</th>
                      <th>Fecha Ingreso</th>
                      <th>Antigüedad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plantillaActual.map(empleado => (
                      <tr key={empleado.id_empleado}>
                        <td>{empleado.id_empleado}</td>
                        <td>{empleado.nombre}</td>
                        <td>{empleado.apellido}</td>
                        <td>{empleado.puesto}</td>
                        <td>{formatearDinero(empleado.salario_base)}</td>
                        <td>{formatearFecha(empleado.fecha_ingreso)}</td>
                        <td>{`${empleado.años_antiguedad} años ${empleado.meses_adicionales > 0 ? `y ${empleado.meses_adicionales} meses` : ''}`}</td>
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
                    (plantillaActual.reduce((sum, emp) => sum + emp.años_antiguedad, 0) / plantillaActual.length).toFixed(1)
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
                <button onClick={() => exportarExcel(rotacionPersonal.altas, 'Rotacion_Personal')}>
                  Exportar a Excel
                </button>
              </div>
              
              <div className="reporte-content">
                <h3>Nuevas Contrataciones (Último Año)</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Año</th>
                      <th>Mes</th>
                      <th>Nuevas Contrataciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rotacionPersonal.altas.map((item, index) => (
                      <tr key={index}>
                        <td>{item.año}</td>
                        <td>{obtenerNombreMes(item.mes)}</td>
                        <td>{item.nuevas_contrataciones}</td>
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
                  <h3>Resumen de Contrataciones</h3>
                  <p><strong>Total de nuevas contrataciones:</strong> {
                    rotacionPersonal.altas.reduce((sum, item) => sum + item.nuevas_contrataciones, 0)
                  }</p>
                  <p><strong>Promedio mensual:</strong> {
                    (rotacionPersonal.altas.reduce((sum, item) => sum + item.nuevas_contrataciones, 0) / rotacionPersonal.altas.length).toFixed(1)
                  }</p>
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
                <button onClick={() => exportarMultiplesHojas({
                  "Por_Puesto": distribucionSalarial.porPuesto,
                  "Por_Antiguedad": distribucionSalarial.porAntiguedad,
                  "Por_Percentil": distribucionSalarial.porPercentil
                }, 'Distribucion_Salarial')}>
                  Exportar a Excel
                </button>
              </div>
              
              <div className="reporte-content">
                {/* Selector de sub-reportes */}
                <div className="tabs" style={{ 
                  display: 'flex', 
                  borderBottom: '1px solid #ddd',
                  marginBottom: '15px'
                }}>
                  <button 
                    onClick={() => setDistribucionSalarial({...distribucionSalarial, activoTab: 'puesto'})}
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
                    onClick={() => setDistribucionSalarial({...distribucionSalarial, activoTab: 'antiguedad'})}
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
                    onClick={() => setDistribucionSalarial({...distribucionSalarial, activoTab: 'percentil'})}
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
                    <table>
                      <thead>
                        <tr>
                          <th>Puesto</th>
                          <th>Nº Empleados</th>
                          <th>Salario Mínimo</th>
                          <th>Salario Máximo</th>
                          <th>Salario Promedio</th>
                          <th>Desviación Estándar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {distribucionSalarial.porPuesto.map((item, index) => (
                          <tr key={index}>
                            <td>{item.puesto}</td>
                            <td>{item.num_empleados}</td>
                            <td>{formatearDinero(item.salario_minimo)}</td>
                            <td>{formatearDinero(item.salario_maximo)}</td>
                            <td>{formatearDinero(item.salario_promedio)}</td>
                            <td>{formatearDinero(item.desviacion_estandar)}</td>
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
                    <table>
                      <thead>
                        <tr>
                          <th>Rango de Antigüedad</th>
                          <th>Nº Empleados</th>
                          <th>Salario Mínimo</th>
                          <th>Salario Máximo</th>
                          <th>Salario Promedio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {distribucionSalarial.porAntiguedad.map((item, index) => (
                          <tr key={index}>
                            <td>{item.rango_antiguedad}</td>
                            <td>{item.num_empleados}</td>
                            <td>{item.num_empleados > 0 ? formatearDinero(item.salario_minimo) : '-'}</td>
                            <td>{item.num_empleados > 0 ? formatearDinero(item.salario_maximo) : '-'}</td>
                            <td>{item.num_empleados > 0 ? formatearDinero(item.salario_promedio) : '-'}</td>
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
                    <table>
                      <thead>
                        <tr>
                          <th>Rango Percentil</th>
                          <th>Nº Empleados</th>
                          <th>Salario Mínimo</th>
                          <th>Salario Máximo</th>
                          <th>Salario Promedio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {distribucionSalarial.porPercentil.map((item, index) => (
                          <tr key={index}>
                            <td>{item.rango_percentil}</td>
                            <td>{item.num_empleados}</td>
                            <td>{formatearDinero(item.salario_minimo)}</td>
                            <td>{formatearDinero(item.salario_maximo)}</td>
                            <td>{formatearDinero(item.salario_promedio)}</td>
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
    </div>
  );
};

export default ReportesPage;