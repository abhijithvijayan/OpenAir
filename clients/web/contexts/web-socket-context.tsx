import React, {createContext, useEffect, useReducer, useContext} from 'react';
import io from 'socket.io-client';

export enum ActivityType {
  CLIENT_CONNECTED = 1,
  CLIENT_DISCONNECTED = 2,
  CLIENT_PUBLISHED = 3,
}

export type MqttClient = {
  id: string;
  uuid: string;
  prefix: string;
  type: string;
  category: string;
  connected_at: number;
  closed: boolean;
  connecting: boolean;
  connected: boolean;
  clean: boolean;
  version: number;
};

type DataPacket = {
  name: string;
  location: {
    type: string;
    coordinates: {lat: string; lng: string};
  };
  readings: {
    id: string;
    type: string;
    unit: string;
    compound: string;
    value: number;
  }[];
  timestamp: number;
};

// datatype of the packet received by socket client
export type PublishedPacket = {
  clientId: string;
  data: DataPacket;
};

export type ClientPacketCollection = {
  clientId: string;
  packets: DataPacket[];
};

export type ClientActivityProps = {
  clientId: string;
  type: number;
  timestamp: number;
};

export enum WebSocketActionTypes {
  SET_LOADING = 'set-loading',
}

export enum MqttClientsActionTypes {
  NEW_MQTT_CLIENT = 'new-mqtt-client',
  NEW_PACKET_PUBLISH = 'new-packet-publish',
  NEW_CLIENT_ACTIVITY = 'new-client-activity',
}

type SET_LOADING = {
  type: WebSocketActionTypes.SET_LOADING;
  payload: boolean;
};

type NEW_MQTT_CLIENT = {
  type: MqttClientsActionTypes.NEW_MQTT_CLIENT;
  payload: MqttClient;
};

type NEW_PACKET_PUBLISH = {
  type: MqttClientsActionTypes.NEW_PACKET_PUBLISH;
  payload: PublishedPacket;
};

type NEW_CLIENT_ACTIVITY = {
  type: MqttClientsActionTypes.NEW_CLIENT_ACTIVITY;
  payload: ClientActivityProps;
};

type Action =
  | SET_LOADING
  | NEW_MQTT_CLIENT
  | NEW_PACKET_PUBLISH
  | NEW_CLIENT_ACTIVITY;

type InitialValues = {
  loading: boolean;
  clients: MqttClient[];
  published: ClientPacketCollection[]; // array of objects of array
  activity: ClientActivityProps[];
};

const initialValues: InitialValues = {
  loading: false,
  clients: [],
  published: [],
  activity: [],
};

type State = InitialValues;
type Dispatch = (action: Action) => void;

const WebSocketStateContext = createContext<State | undefined>(undefined);
const WebSocketDispatchContext = createContext<Dispatch | undefined>(undefined);

function webSocketReducer(state: State, action: Action): State {
  switch (action.type) {
    case WebSocketActionTypes.SET_LOADING: {
      return {...state, loading: action.payload};
    }

    case MqttClientsActionTypes.NEW_CLIENT_ACTIVITY: {
      return {...state, activity: [action.payload, ...state.activity]};
    }

    case MqttClientsActionTypes.NEW_MQTT_CLIENT: {
      // Check if client already exist
      const existingIndex: number = state.clients.findIndex(
        (existing) => existing.uuid === action.payload.uuid
      );

      // not found
      if (existingIndex === -1) {
        return {...state, clients: [action.payload, ...state.clients]};
      }

      // replace with new entry
      return {
        ...state,
        clients: [
          action.payload,
          ...state.clients.filter(
            (_client) => _client.uuid !== action.payload.uuid
          ),
        ],
      };
    }

    case MqttClientsActionTypes.NEW_PACKET_PUBLISH: {
      const publishedPacketCollection: ClientPacketCollection[] =
        state.published;

      const {
        clientId: newPacketClientId,
        data: newPacketData,
      }: PublishedPacket = action.payload;

      // Check if client has existing packets
      const existingIndex: number = publishedPacketCollection.findIndex(
        (existing) => existing.clientId === newPacketClientId
      );

      if (existingIndex !== -1) {
        // Append to existing array in object
        publishedPacketCollection[existingIndex] = {
          ...publishedPacketCollection[existingIndex],
          packets: [
            newPacketData,
            ...publishedPacketCollection[existingIndex].packets,
          ],
        };
      } else {
        publishedPacketCollection.push({
          clientId: newPacketClientId,
          packets: [newPacketData],
        });
      }

      return {...state, published: publishedPacketCollection};
    }

    default:
      return state;
  }
}

function useWebSocketState(): State {
  const context = useContext(WebSocketStateContext);

  if (context === undefined) {
    throw new Error(
      'useWebSocketState must be used within a WebSocketProvider'
    );
  }

  return context;
}

function useWebSocketDispatch(): Dispatch {
  const context = useContext(WebSocketDispatchContext);

  if (context === undefined) {
    throw new Error(
      'useWebSocketDispatch must be used within a WebSocketProvider'
    );
  }

  return context;
}

function useWebSocket(): [State, Dispatch] {
  // To access const [state, dispatch] = useWebSocket()
  return [useWebSocketState(), useWebSocketDispatch()];
}

type WebSocketProviderProps = {
  children: React.ReactNode;
};

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(webSocketReducer, initialValues);

  // Web socket connection
  useEffect(() => {
    // ToDo: Enable loader while connecting
    const socket: SocketIOClient.Socket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL || 'http://localhost:8000'
    );

    // ********************************************* //
    // **** NEW MQTT CLIENT CONNECTED TO BROKER **** //
    // ********************************************* //
    socket.on('mqtt-client', (payload: MqttClient) => {
      // new activity
      dispatch({
        type: MqttClientsActionTypes.NEW_CLIENT_ACTIVITY,
        payload: {
          type: ActivityType.CLIENT_CONNECTED,
          clientId: payload.id,
          timestamp: payload.connected_at,
        },
      });
      // add client to collection
      dispatch({type: MqttClientsActionTypes.NEW_MQTT_CLIENT, payload});
    });

    // ******************************************* //
    // **** MQTT CLIENT PUBLISHED DATA PACKET **** //
    // ******************************************* //
    socket.on('mqtt-publish', (payload: PublishedPacket) => {
      // new activity
      dispatch({
        type: MqttClientsActionTypes.NEW_CLIENT_ACTIVITY,
        payload: {
          type: ActivityType.CLIENT_PUBLISHED,
          clientId: payload.clientId,
          timestamp: payload.data.timestamp,
        },
      });
      dispatch({type: MqttClientsActionTypes.NEW_PACKET_PUBLISH, payload});
    });

    return (): void => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <>
      <WebSocketStateContext.Provider value={state}>
        <WebSocketDispatchContext.Provider value={dispatch}>
          {children}
        </WebSocketDispatchContext.Provider>
      </WebSocketStateContext.Provider>
    </>
  );
};

export {WebSocketProvider, useWebSocket};
