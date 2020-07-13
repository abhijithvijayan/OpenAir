import Link from 'next/link';
import React from 'react';
import 'twin.macro';

import Icon from './Icon';

const ClientActivity: React.FC = () => {
  return (
    <>
      <div tw="pt-4 pb-3 border-b">
        <p tw="text-base font-semibold leading-tight px-10 mb-0">
          Recent activity
        </p>
      </div>

      <Link href="/activity/all">
        <a tw="text-gray-700 text-sm hover:text-gray-600 border-b pb-1 border-gray-300 hover:border-gray-500 cursor-pointer inline-flex items-center mx-10 mt-4">
          View all activity
          <Icon name="arrow-right" tw="ml-1" />
        </a>
      </Link>
    </>
  );
};

export default ClientActivity;
