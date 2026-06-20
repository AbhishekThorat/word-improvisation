export interface IPlayer {
  name: string;
  id: number;
  active: boolean;
  prediction: string;
  isRoot?: boolean;
}
