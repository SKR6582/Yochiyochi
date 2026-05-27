import React from 'react';
import { t } from '../utils/i18n';
import { UiLanguage } from './SettingsModal';

type BottomBarProps = {
  onDraw: () => void;
  uiLanguage: UiLanguage;
};

const BottomBar: React.FC<BottomBarProps> = ({ onDraw, uiLanguage }) => {
  return (
    <footer className="bottom-bar">
      <button className="btn-primary" style={{ flex: 1, fontSize: '32px', height: '80px' }} onClick={onDraw}>
        <span style={{ marginRight: '16px' }}>🔀</span> {t('drawBtn', uiLanguage)}
      </button>
    </footer>
  );
};

export default BottomBar;
