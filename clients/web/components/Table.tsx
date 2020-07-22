import Link from 'next/link';
import React from 'react';
import 'twin.macro';

import Icon from './Icon';

import {formatTimeDistance} from '../util/date';
import {getClientUUID} from '../util/client';
import {
  useWebSocket,
  ClientPacketCollection,
} from '../contexts/web-socket-context';

const Table: React.FC<{clientUUId: string}> = ({clientUUId}) => {
  const [state] = useWebSocket();
  const clientPacketCollection: ClientPacketCollection = state.published.filter(
    (_published) => getClientUUID(_published.clientId) === clientUUId
  )[0];

  if (!clientPacketCollection) {
    return (
      <>
        <p tw="pt-4 font-medium px-10">No client activity reported yet!</p>
        <div tw="px-10">
          <Link href="/">
            <a tw="text-gray-700 text-sm hover:text-gray-600 border-b pb-1 border-gray-300 hover:border-gray-500 cursor-pointer inline-flex items-center mt-4">
              <Icon name="arrow-left" tw="mr-1" />
              Go Home
            </a>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div tw="py-4 bg-white border-b flex">
        <Link href="/">
          <a tw="text-gray-700 text-sm hover:text-gray-600 hover:border-b hover:border-gray-300 cursor-pointer inline-flex items-center">
            <Icon name="arrow-left" tw="ml-1" />
          </a>
        </Link>

        <p tw="text-xl font-semibold leading-tight px-3 mb-0">
          Client Activity
        </p>
      </div>

      <div tw="flex mb-4">
        <div tw="flex items-center px-6 py-2 mt-4 text-gray-900 cursor-pointer">
          <Icon name="cast" />

          <span tw="mx-3">{clientUUId}</span>
        </div>
        <div tw="flex items-center px-6 py-2 mt-4 text-gray-900 cursor-pointer">
          <Icon name="map-pin" />

          <span tw="mx-3">{clientPacketCollection.packets[0].name}</span>
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
          {clientPacketCollection.packets.map((packet) => {
            return (
              <tr key={packet.timestamp}>
                <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  <div tw="text-sm font-medium leading-5 text-gray-700">
                    Published {formatTimeDistance(packet.timestamp)} ago
                  </div>
                </td>

                <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-gray-600 capitalize">
                  <div tw="flex flex-col">
                    <span tw="mb-2">Sensor</span>
                    {packet.readings.map(({type}) => (
                      <span tw="text-gray-900 uppercase">{type}</span>
                    ))}
                  </div>
                </td>

                <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-gray-600 capitalize">
                  <div tw="flex flex-col">
                    <span tw="mb-2">Compound</span>
                    {packet.readings.map(({compound}) => (
                      <span tw="text-gray-900">{compound}</span>
                    ))}
                  </div>
                </td>

                <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-gray-600 capitalize">
                  <div tw="flex flex-col">
                    <span tw="mb-2">Value</span>
                    {packet.readings.map(({value}) => (
                      <span tw="text-gray-900">{value}</span>
                    ))}
                  </div>
                </td>

                <td tw="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-gray-600 capitalize">
                  <div tw="flex flex-col">
                    <span tw="mb-2">Unit</span>
                    {packet.readings.map(({unit}) => (
                      <span tw="text-gray-900 uppercase">{unit}</span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Table;
