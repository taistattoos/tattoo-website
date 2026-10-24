export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const VIEWPORT = { once: true, amount: 0.2 } as const;

export type TriggerType = 'mount' | 'inView';