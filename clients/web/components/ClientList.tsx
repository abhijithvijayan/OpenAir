import Link from 'next/link';
import React from 'react';
import 'twin.macro';

import Icon from './Icon';

import {useWebSocket, MqttClient} from '../contexts/web-socket-context';
import {formatTimeDistance} from '../util/date';

const Card: React.FC<{client: MqttClient}> = ({client}) => {
  return (
    <>
      <div tw="max-w-4xl border-b px-10 py-6 bg-white">
        <div tw="flex">
          <Icon
            tw="pr-3 sm:pr-4 md:pr-6 flex items-center"
            name={!client.closed ? 'check-circle' : 'cross-circle'}
          />
          <div tw="w-full">
            <div tw="flex justify-between items-center">
              <span tw="text-gray-700 font-medium text-base pr-1">
                {client.uuid}
              </span>

              <Link href={`/clients/${client.uuid}/activity`}>
                <a tw="text-gray-700 text-sm hover:text-gray-600 border-b pb-1 border-gray-300 hover:border-gray-500 cursor-pointer inline-flex items-center">
                  View activity
                  <Icon name="arrow-right" tw="ml-1" />
                </a>
              </Link>
            </div>
            <div tw="flex justify-between items-center mt-3">
              <p tw="text-gray-600 text-base mb-0 pr-1">
                {client.category.toUpperCase()}
              </p>
              <p tw="text-gray-500 text-sm mb-0">
                Last activity {formatTimeDistance(client.connected_at)} ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ClientList: React.FC = () => {
  const [state] = useWebSocket();

  return (
    <>
      <div tw="py-4 bg-white border-b">
        <p tw="text-xl font-semibold leading-tight px-10 mb-0">Clients</p>
      </div>

      {state.clients.map((client) => (
        <Card key={client.id} client={client} />
      ))}
    </>
  );
};

export default ClientList;
