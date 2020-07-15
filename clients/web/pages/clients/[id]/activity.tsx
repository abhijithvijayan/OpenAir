import 'twin.macro';
import React from 'react';

import BodyWrapper from '../../../components/BodyWrapper';
import TablePage from '../../../components/Table';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';

import {WebSocketProvider} from '../../../contexts/web-socket-context';
import {SidebarContextProvider} from '../../../contexts/sidebar-context';

const IndexPage: React.FC = () => {
  return (
    <WebSocketProvider>
      <SidebarContextProvider>
        <BodyWrapper>
          <div tw="flex h-screen bg-gray-200">
            <Sidebar />

            <div tw="flex flex-col flex-1 overflow-hidden">
              <Header />

              <main tw="flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                <TablePage />
              </main>
            </div>
          </div>
        </BodyWrapper>
      </SidebarContextProvider>
    </WebSocketProvider>
  );
};

export default IndexPage;
