import { CustomCellRendererProps } from 'ag-grid-react';
import styles from './macro-panel.module.scss';

export function CustomGroupCellRenderer(props: CustomCellRendererProps) {
    const { node, value } = props;
    node.setExpanded(true);

    return (
        <span className={`ag-cell-wrapper ag-row-group`}>
            <span className={`ag-group-value ${styles['group-cell']}`}>{value}</span>
        </span>
    );
}