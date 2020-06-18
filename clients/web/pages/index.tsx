import 'twin.macro';
import React from 'react';

import BodyWrapper from '../components/BodyWrapper';
import Home from '../components/Home';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const IndexPage: React.FC = () => {
  return (
    <BodyWrapper>
      <div tw="h-screen w-screen">
        <div tw="flex flex-col flex-1">
          <Header />
        </div>

        <div tw="flex w-screen h-full bg-gray-200">
          <aside tw="flex flex-col items-center h-full text-gray-700 bg-gray-800 shadow">
            <Sidebar />
          </aside>

          <div tw="relative flex flex-col flex-1">
            <Home />
          </div>
        </div>
      </div>
    </BodyWrapper>
  );
};

export default IndexPage;
