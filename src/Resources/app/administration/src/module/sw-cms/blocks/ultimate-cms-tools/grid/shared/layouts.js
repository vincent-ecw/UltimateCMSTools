import layouts from '../../../../../../../../shared/grid-layouts.json';

export { layouts };

export function getColumns(type) {
    const layout = layouts[type] || layouts['uct-grid-12'];
    return layout.widths.map((width, offset) => ({
        index: offset + 1,
        class: width === 12 ? 'col-12' : `col-12 col-md-${width}`,
        label: `${Math.round(width / 12 * 100)}%`,
        width,
    }));
}
