import React from "react";

type Props = {
  style?: string;
};

const Footer: React.FunctionComponent<Props> = (props: Props) => {
  const { style } = props;

  return (
    <footer
      className={
        style
          ? `${style}`
          : `py-4 px-6 fixed bottom-0 w-full bg-white text-center`
      }
    ></footer>
  );
};

export default Footer;
