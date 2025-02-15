import React from 'react';

import type { CustomCellRendererProps } from 'ag-grid-react';

export interface IconCellRendererProps extends CustomCellRendererProps {
  className?: string;
  onClickHandler?: () => void;
}

export function IconCellRenderer(params: IconCellRendererProps) {
  return (
    <div className='cursor-pointer p-1 fs-14' onClick={params.onClickHandler}>
      <i className={params.className}></i>
    </div>
  )
}