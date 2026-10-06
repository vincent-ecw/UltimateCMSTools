import catalog from '../../../shared/icons/catalog.json';

export const iconOptions = Object.entries(catalog).map(([value, icon]) => ({ value, label: icon.label }));

export function iconMarkup(name) {
    if (!name || name === 'none' || name === 'custom') return '';
    const key = name.startsWith('regular-') || name.startsWith('solid-') ? name : `regular-${name}`;
    return Object.hasOwn(catalog, key) ? catalog[key].svg : catalog['regular-question-circle'].svg;
}
