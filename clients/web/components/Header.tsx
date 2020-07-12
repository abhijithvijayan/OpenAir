/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useState} from 'react';
import 'twin.macro';

import {useSidebarContext} from '../contexts/sidebar-context';

const Header: React.FC = () => {
  const setIsSidebarOpen = useSidebarContext()[1];
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  return (
    <>
      <header tw="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
        <div tw="flex items-center">
          <button
            onClick={(): void => setIsSidebarOpen(true)}
            type="button"
            tw="focus:outline-none lg:hidden text-gray-500"
          >
            <svg
              tw="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div tw="lg:mx-0 relative mx-4">
            <span tw="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg tw="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <input
              tw="sm:w-64 focus:border-indigo-600 w-32 pl-10 pr-4 rounded-md"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>

        <div tw="flex items-center">
          <button type="button" tw="focus:outline-none flex mx-4 text-gray-600">
            <svg
              tw="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div tw="relative">
            <button
              onClick={(): void => setDropdownOpen(!dropdownOpen)}
              type="button"
              tw="focus:outline-none relative z-10 block w-8 h-8 overflow-hidden rounded-full shadow"
            >
              <img
                tw="object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80"
                alt="Your avatar"
              />
            </button>

            {dropdownOpen && (
              <>
                <div
                  onClick={(): void => setDropdownOpen(false)}
                  tw="fixed inset-0 z-10 w-full h-full"
                />

                <div tw="absolute right-0 z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
                  <a
                    href="#"
                    tw="hover:bg-indigo-600 hover:text-white block px-4 py-2 text-sm text-gray-700"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    tw="hover:bg-indigo-600 hover:text-white block px-4 py-2 text-sm text-gray-700"
                  >
                    Logout
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
