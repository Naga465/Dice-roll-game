import { FC } from "react";
import { formatCurrency } from "../services/game";

interface Appbar { 
    wallet_amount : number;
}
const Appbar: FC<Appbar> = ({ wallet_amount }) => {
  return (
      <header className="app-bar">
        <h1>
          <span>DICE</span>{' ROLL'}</h1> 
        <div className="balance">
          <img src="/icons/wallet.png"/>
          <span>{`${formatCurrency(wallet_amount)}`}</span>
        </div>
      </header>
  );
};
export default Appbar;
