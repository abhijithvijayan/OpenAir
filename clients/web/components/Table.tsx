import React from 'react';
import 'twin.macro';

import Icon from './Icon';

const Table: React.FC = () => {
  return (
    <>
      <div tw="py-4 bg-white border-b">
        <p tw="text-xl font-semibold leading-tight px-6 mb-0">
          Client Activity
        </p>
      </div>

      <div tw="flex mb-4">
        <div tw="flex items-center px-6 py-2 mt-4 text-gray-900 cursor-pointer">
          <Icon name="cast" />

          <span tw="mx-3">Publisher ID</span>
        </div>
        <div tw="flex items-center px-6 py-2 mt-4 text-gray-900 cursor-pointer">
          <Icon name="map-pin" />

          <span tw="mx-3">College of Engineering Adoor</span>
        </div>
      </div>

      <table tw="min-w-full border-t border-gray-400 border-solid">
        <thead>
          <tr>
            <th tw="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
              Published
            </th>
            <th tw="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
              Sensor
            </th>
            <th tw="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
              Compound
            </th>
            <th tw="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
              Value
            </th>
            <th tw="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200">
              Unit
            </th>
          </tr>
        </thead>

        <tbody tw="bg-white">
          <tr>
            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div tw="text-sm font-medium leading-5 text-gray-900">
                2 hours ago
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-gray-600 capitalize">
              <div tw="flex flex-col">
                <span>Sensor</span>
                <span tw="mt-2 text-black">Aero treck</span>
                <span tw="text-black">Grass Max</span>
                <span tw="text-black">Mental</span>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-gray-600 capitalize">
              <div tw="flex flex-col">
                <span>Compound</span>
                <span tw="mt-2 text-black">Aero treck</span>
                <span tw="text-black">Grass Max</span>
                <span tw="text-black">Mental</span>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-gray-600 capitalize">
              <div tw="flex flex-col">
                <span>Value</span>
                <span tw="mt-2 text-black">Aero treck</span>
                <span tw="text-black">Grass Max</span>
                <span tw="text-black">Mental</span>
              </div>
            </td>

            <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-gray-600 capitalize">
              <div tw="flex flex-col">
                <span>Unit</span>
                <span tw="mt-2 text-black">Aero treck</span>
                <span tw="text-black">Grass Max</span>
                <span tw="text-black">Mental</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Table;
