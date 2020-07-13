import tw, {css} from 'twin.macro';
import io from 'socket.io-client';
import React, {useEffect} from 'react';

import {
  MqttClient,
  useMqttClients,
  PublishedPacket,
  MqttClientsActionTypes,
} from '../contexts/mqtt-clients-context';

import ClientActivity from './ClientActivity';
import ClientList from './ClientList';

const DashboardPage: React.FC = () => {
  const dispatch = useMqttClients()[1];

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL || 'http://localhost:8000'
    );

    // console.dir(socket);
    socket.on('mqtt-client', (payload: MqttClient) => {
      dispatch({type: MqttClientsActionTypes.NEW_MQTT_CLIENT, payload});
    });

    socket.on('mqtt-publish', (payload: PublishedPacket) => {
      dispatch({type: MqttClientsActionTypes.NEW_PACKET_PUBLISH, payload});
      console.log(`Socket server echoes: ${payload.id}`); // eslint-disable-line no-console
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
      <section tw="flex flex-1 flex-col sm:flex-row">
        <div
          css={[
            tw`flex-shrink bg-white`,

            css`
              flex-grow: 2;
              flex-basis: 0%;
            `,
          ]}
        >
          <ClientList />
        </div>

        <div tw="flex-1">
          <ClientActivity />
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
