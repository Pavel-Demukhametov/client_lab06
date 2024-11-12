
import React from 'react';

const Spinner = ({ size = 120, backgroundColor = '#ffffff', overlay = true }) => {
  if (overlay) {
    return (
      <div style={{ ...styles.overlay, backgroundColor: `rgba(${hexToRgb(backgroundColor)}, 0.7)` }}>
        <div style={{ ...styles.spinner, width: size, height: size, borderWidth: size / 15 }}></div>
      </div>
    );
  } else {
    return (
      <div style={styles.inlineSpinner}>
        <div style={{ ...styles.spinner, width: size, height: size, borderWidth: size / 15 }}></div>
      </div>
    );
  }
};

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  spinner: {
    border: '16px solid #f3f3f3',
    borderTop: '16px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 2s linear infinite',
  },
  inlineSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  const keyframes =
  `@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
  let alreadyAdded = false;

  for (let i = 0; i < styleSheet.cssRules.length; i++) {
    if (styleSheet.cssRules[i].name === 'spin') {
      alreadyAdded = true;
      break;
    }
  }

  if (!alreadyAdded) {
    try {
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch (e) {
      console.error("Не удалось вставить keyframes для спиннера", e);
    }
  }
}

export default Spinner;
