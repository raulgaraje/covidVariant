export interface Person {
  x: number;
  y: number;
  value: number;
  status: 'vaccinated' | 'infected' | 'safe';
  infections: number;
}
