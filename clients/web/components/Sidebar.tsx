import 'twin.macro';
import React from 'react';
import Link from 'next/link';

import Icon from './Icon';

const Sidebar: React.FC = () => {
  return (
    <>
      <nav tw="mt-10">
        <Link href="/">
          <a tw="flex items-center px-8 py-2 text-gray-100 bg-gray-700 border-r-4 border-gray-100">
            <Icon name="inbox" />

            <span tw="mx-4 font-medium">Dashboard</span>
          </a>
        </Link>

        <Link href="/settings">
          <a tw="hover:bg-gray-700 hover:text-gray-100 hover:border-gray-100 flex items-center px-8 py-2 mt-5 text-gray-400 border-r-4 border-gray-800">
            <Icon name="settings" />
            <span tw="mx-4 font-medium">Settings</span>
          </a>
        </Link>
      </nav>

      <div tw="flex items-center w-full h-16 mt-auto">
        <button
          type="button"
          tw="focus:text-orange-500 hover:bg-red-200 focus:outline-none flex items-center justify-center w-10 w-full h-16 mx-auto"
        >
          <Icon name="sign-out" />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
