import { useState } from 'react';
import { ColDef } from 'ag-grid-community';
import { DataGrid } from '../../common-components/data-grid';

export function Trace() {

  const [rowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 }
  ]);

  const [columnDefs] = useState<ColDef[]>([
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
  ]);

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-label">Trace</span>
      </div>

      <div className="widget-content">
        <DataGrid
          rowData={rowData}
          columnDefs={columnDefs}
          height={400}>
        </DataGrid>
      </div>
    </div>
  );
} 