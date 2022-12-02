export enum Game {
  START,
  BETTING,
  ROLLING,
  WINNER,
  STATS
}
export enum BetAmount {
    INCREMENT,
    DECREMENT
}
export type DiceNums = "1" | "2" | "3" | "4" | "5" | "6";
export type Amount = number;
export const availableBets = {
  ["1"]: 0,
  ["2"]: 0,
  ["3"]: 0,
  ["4"]: 0,
  ["5"]: 0,
  ["6"]: 0,
};
export type AllBets = typeof availableBets;
export type Bet = {
  [K in string]: { // FIX MY TYPE
    [K2 in K]: Amount;
  };
}[keyof AllBets];

export interface WinnerStats  { 
    won:Amount,
    lost:Amount,
}
export interface GameStats extends WinnerStats { 
    allBets: Bet,
    wonPosition:number,
    balance: Amount
}