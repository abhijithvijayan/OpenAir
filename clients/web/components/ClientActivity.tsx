import Link from 'next/link';
import React from 'react';
import 'twin.macro';

import Icon, {Icons} from './Icon';

import {formatTimeDistance} from '../util/date';
import {getClientUUID} from '../util/client';
import {
  ActivityType,
  useWebSocket,
  ClientActivityProps,
} from '../contexts/web-socket-context';

function getActivityMessage(type: number): string {
  if (type === ActivityType.CLIENT_CONNECTED) {
    return 'Connected to server';
  }

  if (type === ActivityType.CLIENT_DISCONNECTED) {
    return 'Disconnected from server';
  }

  if (type === ActivityType.CLIENT_PUBLISHED) {
    return 'Published data packet';
  }

  return 'Something went wrong';
}

function getActivityIcon(type: number): Icons {
  if (type === ActivityType.CLIENT_CONNECTED) {
    return 'activity';
  }

  if (type === ActivityType.CLIENT_DISCONNECTED) {
    return 'frown-face';
  }

  if (type === ActivityType.CLIENT_PUBLISHED) {
    return 'hash';
  }

  return 'alert-circle';
}

const ActivityCard: React.FC<{activity: ClientActivityProps}> = ({
  activity,
}) => {
  return (
    <>
      <div tw="max-w-4xl border-b px-8 py-4">
        <div tw="flex">
          <Icon
            tw="pr-3 flex items-center"
            name={getActivityIcon(activity.type)}
          />
          <div tw="w-full">
            <div tw="flex justify-between items-center">
              <span tw="text-gray-700 font-semibold text-sm pr-1">
                {getClientUUID(activity.clientId)}
              </span>

              <p tw="text-gray-500 text-sm mb-0">
                {formatTimeDistance(activity.timestamp)} ago
              </p>
            </div>
            <div tw="flex justify-between items-center mt-1">
              <p tw="text-gray-600 text-sm mb-0 pr-1">
                {getActivityMessage(activity.type)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ClientActivity: React.FC = () => {
  const [state] = useWebSocket();

  return (
    <>
      <div tw="pt-4 pb-3 border-b">
        <p tw="text-base font-semibold leading-tight px-10 mb-0">
          Recent activity
        </p>
      </div>

      <div>
        {state.activity.map((activity, index) => {
          const key: string = activity.clientId + index;

          return <ActivityCard key={key} activity={activity} />;
        })}
      </div>

      <div>
        <Link href="/activity/all">
          <a tw="text-gray-700 text-sm hover:text-gray-600 border-b pb-1 border-gray-300 hover:border-gray-500 cursor-pointer inline-flex items-center mx-10 mt-4">
            View all activity
            <Icon name="arrow-right" tw="ml-1" />
          </a>
        </Link>
      </div>
    </>
  );
};

export default ClientActivity;
