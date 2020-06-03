import 'twin.macro';
import React, {useEffect} from 'react';
import io from 'socket.io-client';

const HomePage: React.FC = () => {
  const socket = io('http://localhost:8000');

  useEffect(() => {
    // console.dir(socket);
    // dispatch loadInitialDataSocket
  }, [socket]);

  useEffect(() => {
    socket.on('nice', (payload: string) => {
      console.log(`Socket server: ${payload}`); // eslint-disable-line no-console
    });

    socket.on('echo', (payload: string) => {
      console.log(`Socket server echoes: ${payload}`); // eslint-disable-line no-console
    });
  });

  const handleClick = (): SocketIOClient.Socket => {
    return socket.emit('some-event', {
      msg: 'Hello broker',
    });
  };

  return (
    <>
      <section tw="h-screen">
        <div tw="flex flex-col items-center justify-center h-full">
          <button
            type="button"
            tw="text-3xl font-bold text-pink-700"
            onClick={(): SocketIOClient.Socket => {
              return handleClick();
            }}
          >
            Emit Message
          </button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
