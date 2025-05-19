import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const GenerarPagosPage = () => {
    const [pagos, setPagos] = useState([]);

    useEffect(() => {
        const datosSimulados = [
            {
                id_nomina: 1,
                id_empleado: 1,
                nombre_empleado: 'Juan Pérez',
                tipo_periodo: 'Mensual',
                fecha_inicio: '2024-05-01',
                fecha_fin: '2024-05-31',
                total_pago: 5200.00,
                fecha_pago: '2024-05-31',
            },
            {
                id_nomina: 2,
                id_empleado: 2,
                nombre_empleado: 'Ana Gómez',
                tipo_periodo: 'Mensual',
                fecha_inicio: '2024-05-01',
                fecha_fin: '2024-05-31',
                total_pago: 4800.00,
                fecha_pago: '2024-05-31',
            },
        ];
        setPagos(datosSimulados);
    }, []);

    const exportarExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(pagos);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pagos');

        XLSX.writeFile(workbook, 'pagos_mensuales.xlsx');
    };

    return (
        <div>
            <h2>Pagos a realizar este mes</h2>

            <button onClick={exportarExcel} style={{ marginBottom: '10px' }}>
                Exportar a Excel
            </button>

            <table>
                <thead>
                    <tr>
                        <th>Colaborador</th>
                        <th>Periodo</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Total a Pagar</th>
                        <th>Fecha de Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.map(pago => (
                        <tr key={pago.id_nomina}>
                            <td>{pago.nombre_empleado}</td>
                            <td>{pago.tipo_periodo}</td>
                            <td>{pago.fecha_inicio}</td>
                            <td>{pago.fecha_fin}</td>
                            <td>${pago.total_pago.toFixed(2)}</td>
                            <td>{pago.fecha_pago}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GenerarPagosPage;
