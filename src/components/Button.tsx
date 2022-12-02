import React, { FC } from "react";

interface PlayButton
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}
export const PlayButton: FC<PlayButton> = (props) => {
  return <button className="play" {...props} />;
};
