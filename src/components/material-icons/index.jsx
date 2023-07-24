import React from 'react';
import 'material-icons/iconfont/material-icons.css';

function MaterialIcon({ iconName, iconClass }) {
  return <i className={`material-icons-outlined ${iconClass}`}>{iconName}</i>;
}

export default MaterialIcon;