import { useCallback, useEffect, useState } from "react";
import {
  getWinnerStats,
  getWinnerPosition,
  isTimeUpForBetting,
  calculateTotalBetAmount,
} from "../services/game";
import { Amount, Bet, Game, GameStats } from "../types/game";
import useTimer from "./useTimer";

interface GameBoard {
  initBets: Bet | null;
  initWalletAmount: Amount;
  initStatus: Game;
}

function useGame({ initBets, initWalletAmount, initStatus }: GameBoard) {
  const [bets, setBets] = useState<Bet | null>(initBets);
  const [wallet, setWallet] = useState<Amount>(initWalletAmount);
  const [status, setStatus] = useState<Game>(initStatus);
  const [winner, setWinner] = useState<number>();
  const {
    time,
    startTimer,
    reset: resetTimer,
  } = useTimer({ initLimit: 10, initStart: false });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (status === Game.BETTING) {
      const timeup = isTimeUpForBetting(time);
      if (timeup) {
        const totalBetAmount = calculateTotalBetAmount(bets);
        setWallet((wallet) => wallet - totalBetAmount);
        timeout = setTimeout(() => {
          setStatus(Game.ROLLING);
        }, 2 * 1000); // 2 sec
      }
    } else if (status === Game.ROLLING) {
      timeout = setTimeout(() => {
        setStatus(Game.WINNER);
        setWinner(getWinnerPosition());
      }, 5 * 1000); // 5 sec
    } else if (status === Game.WINNER) {
      const { won } = getWinnerStats(bets, winner);
      setWallet((wallet) => wallet + won);
      timeout = setTimeout(() => {
        setStatus(Game.STATS);
      }, 5 * 1000); // 5 sec
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [time, status, bets]);

  const resetGame = useCallback(() => {
    setBets(initBets);
    setStatus(initStatus);
    setWinner(undefined);
    resetTimer();
  }, [initBets, initWalletAmount, initStatus]);

  const onPlay = useCallback(() => {
    if (!wallet) {
        alert('No funds');
        return;
    };
    setStatus(Game.BETTING);
    startTimer();
  }, []);

  const getGameStats = useCallback((): GameStats | null => {
    if (bets && winner) {
      const { won, lost } = getWinnerStats(bets, winner);
      return {
        won,
        lost,
        allBets: bets,
        wonPosition: winner,
        balance: won + wallet,
      };
    }
    return null;
  }, [bets, wallet, winner]);

  return {
    bets,
    wallet,
    status,
    time,
    winnerPostion: winner,
    setWallet,
    setStatus,
    onPlay,
    setBets,
    resetGame,
    getGameStats,
  };
}
export default useGame;
