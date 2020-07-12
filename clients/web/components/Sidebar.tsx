/* eslint-disable jsx-a11y/click-events-have-key-events */
import tw from 'twin.macro';
import React from 'react';
// import Link from 'next/link';

// import Icon from './Icon';

import {useSidebarContext} from '../contexts/sidebar-context';

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useSidebarContext();

  return (
    <>
      <div
        css={[
          tw`lg:hidden fixed inset-0 z-20 block transition-opacity bg-black opacity-50`,

          isSidebarOpen ? tw`block` : tw`hidden`,
        ]}
        onClick={(): void => setIsSidebarOpen(false)}
      />

      <div
        css={[
          tw`lg:translate-x-0 lg:static lg:inset-0 fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-gray-900`,

          isSidebarOpen
            ? tw`ease-out translate-x-0`
            : tw`ease-in -translate-x-full`,
        ]}
      >
        <div tw="flex items-center justify-center mt-8">
          <div tw="flex items-center">
            <svg
              tw="w-12 h-12"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
                fill="#4C51BF"
                stroke="#4C51BF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
                fill="white"
              />
            </svg>

            <span tw="mx-2 text-2xl font-semibold text-white">Dashboard</span>
          </div>
        </div>

        <nav tw="mt-10">
          <a
            tw="flex items-center px-6 py-2 mt-4 text-gray-100 bg-gray-600 bg-opacity-25 border-l-4 border-gray-100"
            href="#"
            target="_blank"
          >
            <svg
              tw="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10C2 5.58172 5.58172 2 10 2V10H18C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
                fill="currentColor"
              />
              <path
                d="M12 2.25195C14.8113 2.97552 17.0245 5.18877 17.748 8.00004H12V2.25195Z"
                fill="currentColor"
              />
            </svg>

            <span tw="mx-4">Dashboard</span>
          </a>

          <a
            tw="hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 flex items-center px-6 py-2 mt-4 text-gray-500 border-l-4 border-gray-900"
            href="#ui-elements/"
            target="_blank"
          >
            <svg
              tw="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5Z"
                fill="currentColor"
              />
              <path
                d="M5 11C3.89543 11 3 11.8954 3 13V15C3 16.1046 3.89543 17 5 17H7C8.10457 17 9 16.1046 9 15V13C9 11.8954 8.10457 11 7 11H5Z"
                fill="currentColor"
              />
              <path
                d="M11 5C11 3.89543 11.8954 3 13 3H15C16.1046 3 17 3.89543 17 5V7C17 8.10457 16.1046 9 15 9H13C11.8954 9 11 8.10457 11 7V5Z"
                fill="currentColor"
              />
              <path
                d="M11 13C11 11.8954 11.8954 11 13 11H15C16.1046 11 17 11.8954 17 13V15C17 16.1046 16.1046 17 15 17H13C11.8954 17 11 16.1046 11 15V13Z"
                fill="currentColor"
              />
            </svg>

            <span tw="mx-4">UI Elements</span>
          </a>

          <a
            tw="hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 flex items-center px-6 py-2 mt-4 text-gray-500 border-l-4 border-gray-900"
            href="#tables/"
            target="_blank"
          >
            <svg
              tw="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H13C13.5523 5 14 4.55228 14 4C14 3.44772 13.5523 3 13 3H7Z"
                fill="currentColor"
              />
              <path
                d="M4 7C4 6.44772 4.44772 6 5 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H5C4.44772 8 4 7.55228 4 7Z"
                fill="currentColor"
              />
              <path
                d="M2 11C2 9.89543 2.89543 9 4 9H16C17.1046 9 18 9.89543 18 11V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V11Z"
                fill="currentColor"
              />
            </svg>

            <span tw="mx-4">Tables</span>
          </a>

          <a
            tw="hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 flex items-center px-6 py-2 mt-4 text-gray-500 border-l-4 border-gray-900"
            href="#forms/"
            target="_blank"
          >
            <svg tw="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>

            <span tw="mx-4">Forms</span>
          </a>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
