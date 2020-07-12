import React from 'react';

import SettingsIcon from './Settings';
import ArrowRight from './ArrowRight';
import ArrowLeft from './ArrowLeft';
import SignOutIcon from './SignOut';
import ArrowDown from './ArrowDown';
import ArrowUp from './ArrowUp';
import InboxIcon from './Inbox';
import BellIcon from './Bell';

const icons = {
  'arrow-left': ArrowLeft,
  'arrow-down': ArrowDown,
  'arrow-up': ArrowUp,
  'arrow-right': ArrowRight,
  bell: BellIcon,
  inbox: InboxIcon,
  settings: SettingsIcon,
  'sign-out': SignOutIcon,
};

export type Icons = keyof typeof icons;

type Props = {
  name: Icons;
  title?: string;
  stroke?: string;
  fill?: string;
  hoverFill?: string;
  hoverStroke?: string;
  strokeWidth?: string;
  className?: string;
  style?: unknown;
  onClick?: (e?: unknown) => void;
};

const Icon: React.FC<Props> = ({name, ...rest}) => {
  return <div {...rest}>{React.createElement(icons[name])}</div>;
};

export default Icon;
