import 'twin.macro';
import React from 'react';

import BodyWrapper from '../components/BodyWrapper';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Home from '../components/Home';

import {MqttClientsProvider} from '../contexts/mqtt-clients-context';
import {SidebarContextProvider} from '../contexts/sidebar-context';

const IndexPage: React.FC = () => {
  return (
    <MqttClientsProvider>
      <SidebarContextProvider>
        <BodyWrapper>
          <div tw="flex h-screen bg-gray-200">
            <Sidebar />
            <div tw="flex flex-col flex-1 overflow-hidden">
              <Header />
              <Home />
            </div>
          </div>
        </BodyWrapper>
      </SidebarContextProvider>
    </MqttClientsProvider>
  );
};

export default IndexPage;
