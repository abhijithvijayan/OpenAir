import React from 'react';

import ChevronDownIcon from './ChevronDown';
import CheckCircleIcon from './CheckCircle';
import CrossCircleIcon from './CrossCircle';
import ArrowRightIcon from './ArrowRight';
import ArrowLeftIcon from './ArrowLeft';
import ChevronUpIcon from './ChevronUp';
import SettingsIcon from './Settings';
import LogOutIcon from './LogOut';
import SearchIcon from './Search';
import BurgerIcon from './Burger';
import InboxIcon from './Inbox';
import BellIcon from './Bell';

const icons = {
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  bell: BellIcon,
  burger: BurgerIcon,
  'check-circle': CheckCircleIcon,
  'chevron-down': ChevronDownIcon,
  'chevron-up': ChevronUpIcon,
  'cross-circle': CrossCircleIcon,
  inbox: InboxIcon,
  'log-out': LogOutIcon,
  search: SearchIcon,
  settings: SettingsIcon,
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
