// StatusPanel.jsx
import React from "react";
import "./StatusPanel.css";

const ICONS = {
  success: "✓",
  warning: "⚠",
  error: "✕",
  info: "ℹ",
};

const StatusPanel = ({
  type = "info",
  title,
  message,
  icon,
  height = "100px",
}) => {
  const classNames = `status-panel ${type}`;
  const defaultIcon = ICONS[type] ?? ICONS.info;

  // Apply the height prop dynamically via inline style
  const panelStyle = { height };

  return (
    <div className={classNames} style={panelStyle}>
      <h3 className="status-panel-title">
        {icon &&  <span className="status-panel-icon">{icon ?? defaultIcon}</span>}
         {title}
      </h3>
      {message && message.map((msg, index) => (
        <div key={index} className="status-panel-message">{msg}</div>
      ))}
    </div>
  );
};

export default StatusPanel;
