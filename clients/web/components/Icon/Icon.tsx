import React from 'react';

import SettingsIcon from './Settings';
import SignOutIcon from './SignOut';
import InboxIcon from './Inbox';
import BellIcon from './Bell';

const icons = {
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
