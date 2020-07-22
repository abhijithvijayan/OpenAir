import React from 'react';

import ChevronDownIcon from './ChevronDown';
import CheckCircleIcon from './CheckCircle';
import CrossCircleIcon from './CrossCircle';
import AlertCircleIcon from './AlertCircle';
import ArrowRightIcon from './ArrowRight';
import ArrowLeftIcon from './ArrowLeft';
import FrownFaceIcon from './FrownFace';
import ChevronUpIcon from './ChevronUp';
import ActivityIcon from './Activity';
import SettingsIcon from './Settings';
import LogOutIcon from './LogOut';
import SearchIcon from './Search';
import MapPinIcon from './MapPin';
import BurgerIcon from './Burger';
import InboxIcon from './Inbox';
import BellIcon from './Bell';
import CastIcon from './Cast';
import HashIcon from './Hash';

const icons = {
  activity: ActivityIcon,
  'alert-circle': AlertCircleIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  bell: BellIcon,
  burger: BurgerIcon,
  cast: CastIcon,
  'check-circle': CheckCircleIcon,
  'chevron-down': ChevronDownIcon,
  'chevron-up': ChevronUpIcon,
  'cross-circle': CrossCircleIcon,
  'frown-face': FrownFaceIcon,
  hash: HashIcon,
  inbox: InboxIcon,
  'log-out': LogOutIcon,
  'map-pin': MapPinIcon,
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
