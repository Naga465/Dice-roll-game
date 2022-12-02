import {
    MAX_DICE_POSITION,
    MIN_DICE_POSITION,
    WALLET_CURRENCY,
} from "../constant";
import { Amount, Bet, DiceNums, WinnerStats } from "../types/game";

export function formatCurrency(
    amount: number,
    currency = WALLET_CURRENCY,
    maximumFractionDigits = 2
): string {
    return amount.toLocaleString("en-IN", {
        currency,
        style: "currency",
        maximumFractionDigits,
    });
}

export const isTimeUpForBetting = (time: string | number): boolean => time == 0;

export const getWinnerPosition = () => {
    return Math.floor(
        Math.random() * (MAX_DICE_POSITION - MIN_DICE_POSITION + 1) +
        MIN_DICE_POSITION
    );
};

export const calculateTotalBetAmount = (bets: Bet | null): Amount => {
    let totalBetAmount = 0;
    if (!!bets) {
        Object.values(bets).forEach((bet) => {
            totalBetAmount += bet;
        });
    }
    return totalBetAmount;
};

export const getWinnerStats = (bets: Bet | null, wonPosition: number | undefined): WinnerStats => {
    if (!bets  || !wonPosition) return {
        won: 0,
        lost: 0
    }
    let won = bets[wonPosition] ? bets[wonPosition] * 2 : 0;
    let lost = 0;
    Object.keys(bets).forEach((position) => {
        if (position !== `${wonPosition}`) {
            lost += bets[position];
        }
    });
    return {
        won,
        lost,
    };
};
