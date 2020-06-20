import 'twin.macro';
import io from 'socket.io-client';
import React, {useEffect} from 'react';

import {
  useMqttClients,
  MqttClient,
  MqttClientsActionTypes,
} from '../contexts/mqtt-clients-context';
import {formatTime} from '../util/date';

const HomePage: React.FC = () => {
  const [state, dispatch] = useMqttClients();

  useEffect(() => {
    const socket = io('http://localhost:8000');

    // console.dir(socket);
    socket.on('client', (payload: MqttClient) => {
      dispatch({type: MqttClientsActionTypes.ADD_MQTT_CLIENT, payload});
    });

    socket.on('echo', (payload: string) => {
      console.log(`Socket server echoes: ${payload}`); // eslint-disable-line no-console
    });
  }, [dispatch]);

  // const handleClick = (): SocketIOClient.Socket => {
  //   return socket.emit('some-event', {
  //     msg: 'Hello broker',
  //   });
  // };

  return (
    <>
      <section tw="flex bg-gray-200">
        <div tw="sm:px-8 container px-4 mx-auto">
          <div tw="py-8">
            <div>
              <h2 tw="text-2xl font-semibold leading-tight">Nodes</h2>
            </div>

            <div tw="sm:-mx-8 sm:px-8 px-4 py-4 -mx-4 overflow-x-auto">
              <div tw="inline-block min-w-full overflow-hidden rounded-lg shadow">
                <table tw="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th tw="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                        ID
                      </th>
                      <th tw="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                        Type
                      </th>
                      <th tw="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                        Connected at
                      </th>
                      <th tw="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.clients.map((client) => {
                      return (
                        <tr key={client.id}>
                          <td tw="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <div tw="flex items-center">
                              <div>
                                <p tw="text-gray-900 whitespace-no-wrap">
                                  {client.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td tw="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <p tw="text-gray-900 whitespace-no-wrap">
                              {client.type.toUpperCase()}
                            </p>
                          </td>
                          <td tw="px-5 py-5 text-sm bg-white border-b border-gray-200">
                            <p tw="text-gray-900 whitespace-no-wrap">
                              {formatTime(client.connected_at)}
                            </p>
                          </td>
                          <td tw="px-5 py-5 text-sm bg-white border-b border-gray-200">
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
                <div tw="sm:flex-row sm:justify-between flex flex-col items-center px-5 py-5 bg-white border-t">
                  <span tw="sm:text-sm text-xs text-gray-900">
                    Showing {state.clients.length} Entries
                  </span>
                  <div tw="sm:mt-0 inline-flex mt-2">
                    <button
                      type="button"
                      tw="hover:bg-gray-400 px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      tw="hover:bg-gray-400 px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
