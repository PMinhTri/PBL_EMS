import React from "react";
import { Alert, Space } from "antd";

export type Props = {
  message: string;
  type: "success" | "info" | "warning" | "error";
};

const AlertComponent: React.FunctionComponent<Props> = (props: Props) => {
  const { message, type } = props;

  return (
    <Space direction="vertical" style={{ width: "30%" }}>
      <Alert message={message} type={type} showIcon closable />
    </Space>
  );
};

export default AlertComponent;
