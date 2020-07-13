import React from 'react';
import Link from 'next/link';
import 'twin.macro';

import Icon from './Icon';

import {useMqttClients, MqttClient} from '../contexts/mqtt-clients-context';
import {formatTime} from '../util/date';

const Card: React.FC<{client: MqttClient}> = ({client}) => {
  return (
    <>
      <div tw="max-w-4xl border-b px-10 py-6 bg-white">
        <div tw="flex justify-between items-center">
          {/* <span tw="relative">{!client.closed ? 'Active' : 'Inactive'}</span> */}
          <span tw="text-gray-700 font-medium text-base">{client.uuid}</span>

          <Link href="/client/id/activity">
            <a tw="text-gray-700 text-sm hover:text-gray-600 border-b pb-1 border-gray-300 hover:border-gray-500 cursor-pointer inline-flex items-center">
              View Activity
              <Icon name="arrow-right" tw="ml-1" />
            </a>
          </Link>
        </div>
        <div tw="flex justify-between items-center mt-3">
          <p tw="text-gray-600 text-base mb-0">
            {client.category.toUpperCase()}
          </p>
          <p tw="text-gray-500 text-sm mb-0">
            Last activity {formatTime(client.connected_at)} ago
          </p>
        </div>
      </div>
    </>
  );
};

const ClientList: React.FC = () => {
  const [state] = useMqttClients();

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
