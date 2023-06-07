import { Modal } from "antd";
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import React from "react";

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  type?: "error" | "warning" | "success" | "info"; // Add a type prop
  children?: React.ReactNode;
};

export const ModalAlert: React.FunctionComponent<Props> = (props: Props) => {
  const { isOpen, onClose, title, type } = props;

  const getIcon = () => {
    switch (type) {
      case "error":
        return <ExclamationCircleOutlined />;
      case "warning":
        return <WarningOutlined />;
      case "success":
        return <CheckCircleOutlined />;
      case "info":
        return <InfoCircleOutlined />;
      default:
        return null;
    }
  };

  const getModalClassName = () => {
    let className = "modal-alert w-full flex-row";
    if (type) {
      className += ` modal-alert-${type}`;
    }
    return className;
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className="w-full flex justify-end">
          <button className="modal-button" onClick={onClose}>
            <span>Cancel</span>
          </button>
        </div>
      }
      className={getModalClassName()}
    >
      <div className="modal-alert-content">
        <div className="modal-alert-icon">{getIcon()}</div>
        <div className="modal-alert-title">{title}</div>
      </div>
    </Modal>
  );
};
