import {useRouter} from 'next/router';
import React from 'react';
import 'twin.macro';

import BodyWrapper from '../../components/BodyWrapper';
import TablePage from '../../components/Table';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import {SidebarContextProvider} from '../../contexts/sidebar-context';

const IndexPage: React.FC = () => {
  const router = useRouter();
  const {id}: {id: string} = router.query;

  return (
    <>
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
    </>
  );
};

export default IndexPage;
