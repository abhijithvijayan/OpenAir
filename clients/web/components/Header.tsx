import 'twin.macro';
import React from 'react';

import Icon from './Icon/Icon';

const Header: React.FC = () => {
  return (
    <>
      <nav tw="flex justify-between h-16 px-4 bg-white border-b-2">
        <ul tw="flex items-center">
          <li>
            <h1 tw="lg:pl-0 pl-10 mb-0 text-2xl font-bold text-gray-700">
              OpenAir
            </h1>
          </li>
        </ul>

        <ul tw="flex items-center">
          <li tw="pr-4">
            <Icon name="bell" />
          </li>

          <li tw="w-8 h-8">
            <img
              tw="w-full h-full mx-auto rounded-full"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
              alt="profile woman"
            />
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
