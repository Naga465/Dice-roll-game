import React, { FC, useCallback } from "react";
import Appbar from "./Appbar";
import "../styles/Gameboard.css";
import { PlayButton } from "./Button";
import { BetAmount, DiceNums, Game } from "../types/game";
import useGame from "../hooks/useGame";
import { WALLET_AMOUNT } from "../constant";
import {
  calculateTotalBetAmount,
  formatCurrency,
  isTimeUpForBetting,
} from "../services/game";

export const DicePositionColors: { [key in DiceNums]: string } = {
  ["1"]: "#f77a0b",
  ["2"]: "#2a8dfe",
  ["3"]: "#fe2a62",
  ["4"]: "#2afeac",
  ["5"]: "#d7fe2a",
  ["6"]: "#fe772a",
};

const Gameboard: FC<{}> = () => {
  const {
    bets,
    status,
    wallet,
    time,
    winnerPostion,
    setBets,
    onPlay,
    getGameStats,
  } = useGame({
    initBets: null,
    initWalletAmount: WALLET_AMOUNT,
    initStatus: Game.START,
  });
  const timeUp = isTimeUpForBetting(time);

  const updateBet = (dice: DiceNums, action: BetAmount) => () => {
    const totalBetAmount = calculateTotalBetAmount(bets);
    const balance = wallet - totalBetAmount;
    if ((balance <= 0 && action === BetAmount.INCREMENT) || timeUp) return; // Empty balance
    if (!bets) {
      setBets({ [dice]: 1 }); // default
      return;
    }
    const betAmount = bets[dice] ? bets[dice] : 0;
    if (betAmount <= 0 && action === BetAmount.DECREMENT) return; // Minimum bet
    const totalAmount =
      action === BetAmount.INCREMENT ? betAmount + 1 : betAmount - 1;
    setBets((prev) => ({ ...prev, [dice]: totalAmount }));
  };
  const Board = useCallback(
    ({
      screen,
      children,
    }: {
      screen: Game;
      children: JSX.Element;
    }): JSX.Element => {
      if (screen === status) return children;
      return <React.Fragment />;
    },
    [status]
  );

  return (
    <div className="gameboard">
      <Appbar wallet_amount={wallet} />
      <main>
        <div>
          <Board screen={Game.START}>
            <div className="game-start">
              <h2>Let's Play</h2>
              <PlayButton onClick={onPlay}>{"START GAME"}</PlayButton>
            </div>
          </Board>
          <Board screen={Game.BETTING}>
            <div className="bet">
              <h2>
                {`${time}`}
                <span>S</span>
              </h2>
              <div className="dice-list">
                {(Object.keys(DicePositionColors) as DiceNums[]).map(
                  (diceNumber) => (
                    <div
                      key={diceNumber}
                      style={{ color: DicePositionColors[diceNumber] }}
                    >
                      <div className={`dice ${timeUp && "dice-disable"} `}>
                        <p>{diceNumber}</p>
                        <div>
                          <img
                            onClick={updateBet(diceNumber, BetAmount.DECREMENT)}
                            src="/icons/minus.png"
                          />
                          <span>{`$${
                            !!bets?.[diceNumber] ? bets[diceNumber] : 0
                          }`}</span>
                          <img
                            onClick={updateBet(diceNumber, BetAmount.INCREMENT)}
                            src="/icons/plus.png"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              {timeUp && (
                <p className="status">Amount locked. No more bets allowed...</p>
              )}
            </div>
          </Board>
          <Board screen={Game.ROLLING}>
            <h2>Rolling dice...</h2>
          </Board>
          <Board screen={Game.WINNER}>
            <h2>{`Winner : ${winnerPostion}`}</h2>
          </Board>
          <Board screen={Game.STATS}>
            <div className="stats">
              <h3 className="won">
                {`Won:`} <span>{formatCurrency(getGameStats()?.won || 0)}</span>{" "}
              </h3>
              <h3 className="lost">
                {`Lost:`}{" "}
                <span>{formatCurrency(getGameStats()?.lost || 0)}</span>{" "}
              </h3>
            </div>
          </Board>
        </div>
      </main>
    </div>
  );
};
export default Gameboard;
