import axios, {AxiosInstance, AxiosPromise, AxiosRequestConfig} from 'axios';

import endpoints, {RequestProps} from './constants';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.API_SERVER_URL || ''}/api/v1`,
});

export type ApiRequestProps = {
  key: string;
  route?: string[];
  params?: unknown;
};

function fireUpApiRequest({
  key,
  route = [],
  params = {},
}: ApiRequestProps): AxiosPromise<unknown> {
  const {path, ...other} = endpoints[key];
  const url: string = path;

  const request: RequestProps = {path: url, ...other};

  if (route.length > 0) {
    /**
     *  Append to existing path
     *  request.path => /users, route => ['view', 'id']
     *  new path => '/users/view/id'
     */
    request.path += `/${route.join('/')}`;
  }

  if (request.method === undefined || request.method === 'GET') {
    request.method = 'GET';
  }

  const config: AxiosRequestConfig = {
    headers: {},
    ...(request.method === 'GET' && {params}),
    ...(request.method === 'POST' && {data: params}),
  };

  return axiosInstance({
    ...config,
    method: request.method,
    url: request.path,
  });
}

export default fireUpApiRequest;
