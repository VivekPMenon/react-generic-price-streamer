import { CustomCellRendererProps } from 'ag-grid-react';
import styles from './macro-panel.module.scss';

export function CustomGroupCellRenderer(props: CustomCellRendererProps) {
    const { node, value } = props;
    node.setExpanded(true);

    return (
        <div className={`${styles['group-cell']}`}>
            {value}
        </div>
    );
}