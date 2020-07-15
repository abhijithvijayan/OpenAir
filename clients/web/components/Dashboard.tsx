import tw, {css} from 'twin.macro';
import React from 'react';

import ClientActivity from './ClientActivity';
import ClientList from './ClientList';

const DashboardPage: React.FC = () => {
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
