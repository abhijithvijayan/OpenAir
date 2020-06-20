import 'twin.macro';
import io from 'socket.io-client';
import React, {useEffect} from 'react';

import {
  useMqttClients,
  MqttClient,
  MqttClientsActionTypes,
} from '../contexts/mqtt-clients-context';
import {formatTime} from '../util/date';

import Icon from './Icon';

const HomePage: React.FC = () => {
  const [state, dispatch] = useMqttClients();

  useEffect(() => {
    const socket = io('http://localhost:8000');

    // console.dir(socket);
    socket.on('mqtt-client', (payload: MqttClient) => {
      dispatch({type: MqttClientsActionTypes.ADD_MQTT_CLIENT, payload});
    });

    socket.on('echo', (payload: string) => {
      console.log(`Socket server echoes: ${payload}`); // eslint-disable-line no-console
    });

    return (): void => {
      socket.disconnect();
    };
  }, [dispatch]);

  // const handleClick = (): SocketIOClient.Socket => {
  //   return socket.emit('some-event', {
  //     msg: 'Hello broker',
  //   });
  // };

  return (
    <>
      <section tw="flex bg-gray-200">
        <div tw="sm:px-8 container px-4 my-6 mx-auto">
          <div tw="bg-white pb-4 px-4 rounded-md w-full">
            <div tw="pt-6">
              <p tw="text-2xl font-semibold leading-tight ml-3">Clients</p>
            </div>

            <div tw="overflow-x-auto mt-6">
              <table tw="table-auto border-collapse w-full">
                <thead>
                  <tr tw="rounded-lg text-sm font-medium text-gray-700 text-left">
                    <th tw="px-4 py-2 bg-gray-200 uppercase">ID</th>
                    <th tw="px-4 py-2 bg-gray-200 uppercase">Role</th>
                    <th tw="px-4 py-2 bg-gray-200 uppercase">Connected At</th>
                    <th tw="px-4 py-2 bg-gray-200 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody tw="text-sm font-normal text-gray-700">
                  {state.clients.map((client) => {
                    return (
                      <tr tw="hover:bg-gray-100 border-gray-200">
                        <td tw="px-4 py-4">{client.id}</td>
                        <td tw="px-4 py-4">{client.type.toUpperCase()}</td>
                        <td tw="px-4 py-4">
                          {formatTime(client.connected_at)}
                        </td>
                        <td>
                          <span tw="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                            <span
                              aria-hidden
                              tw="absolute inset-0 bg-green-200 rounded-full opacity-50"
                            />
                            <span tw="relative">
                              {!client.closed ? 'Active' : 'Inactive'}
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div tw="w-full flex justify-center border-t border-gray-100 pt-4 items-center">
              <Icon name="arrow-left" />
              <p tw="leading-relaxed cursor-pointer mx-2 mb-0 text-blue-600 hover:text-blue-600 text-sm">
                1
              </p>
              <p tw="leading-relaxed cursor-pointer mx-2 mb-0 text-sm hover:text-blue-600">
                2
              </p>
              <p tw="leading-relaxed cursor-pointer mx-2 mb-0 text-sm hover:text-blue-600">
                3
              </p>
              <p tw="leading-relaxed cursor-pointer mx-2 mb-0 text-sm hover:text-blue-600">
                4
              </p>
              <Icon name="arrow-right" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
