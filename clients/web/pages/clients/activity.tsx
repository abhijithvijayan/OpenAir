import {useRouter} from 'next/router';
import Link from 'next/link';
import React from 'react';
import 'twin.macro';

import BodyWrapper from '../../components/BodyWrapper';
import TablePage from '../../components/Table';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Icon from '../../components/Icon';

import {SidebarContextProvider} from '../../contexts/sidebar-context';
import {useWebSocket} from '../../contexts/web-socket-context';

const IndexPage: React.FC = () => {
  const router = useRouter();
  const {id: uuid}: {uuid: string} = router.query;
  const [state] = useWebSocket();

  return (
    <>
      <SidebarContextProvider>
        <BodyWrapper>
          <div tw="flex h-screen bg-gray-200">
            <Sidebar />

            <div tw="flex flex-col flex-1 overflow-hidden">
              <Header />

              <main tw="flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                {state.clients.findIndex((_client) => _client.uuid === uuid) !==
                -1 ? (
                  <TablePage clientUUId={uuid} />
                ) : (
                  <div tw="py-4 px-10">
                    <p tw="font-bold">Oops!</p>
                    <p>Client not connected</p>
                    <div>
                      <Link href="/">
                        <a tw="text-gray-700 text-sm hover:text-gray-600 border-b pb-1 border-gray-300 hover:border-gray-500 cursor-pointer inline-flex items-center mt-4">
                          <Icon name="arrow-left" tw="mr-1" />
                          Go Home
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </BodyWrapper>
      </SidebarContextProvider>
    </>
  );
};

export default IndexPage;
