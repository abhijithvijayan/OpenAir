export enum ApiRoutes {
  SAVE_PLACE_DATA = 'savePlaceData',
}

export type RequestProps = {
  path: string;
  method?: 'GET' | 'POST';
};

// ToDo:
type EndpointObjectProps = {
  [key: string]: RequestProps;
};

const endpoints: EndpointObjectProps = {
  // Main Endpoints
  savePlaceData: {
    path: '/save_place_data',
    method: 'POST',
  },
};

export default endpoints;
