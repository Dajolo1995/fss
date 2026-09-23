const clampChannel = (value: number): number => Math.max(0, Math.min(255, Math.round(value)));

const parseHex = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3 ? normalized.split('').map((char) => char + char).join('') : normalized;
  return [
    Number.parseInt(full.slice(0, 2), 16) || 0,
    Number.parseInt(full.slice(2, 4), 16) || 0,
    Number.parseInt(full.slice(4, 6), 16) || 0,
  ];
};

const toHex = (channels: [number, number, number]): string =>
  `#${channels.map((channel) => clampChannel(channel).toString(16).padStart(2, '0')).join('')}`;

/** Mezcla dos colores hex. `ratio` 0 devuelve el origen y 1 el destino. */
export const mixHex = (from: string, to: string, ratio: number): string => {
  const source = parseHex(from);
  const target = parseHex(to);
  const amount = Math.max(0, Math.min(1, ratio));
  return toHex([0, 1, 2].map((index) => source[index] + (target[index] - source[index]) * amount) as [number, number, number]);
};
