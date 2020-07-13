import React, {createContext, useReducer, useContext} from 'react';

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
};

// datatype of the packet received by socket client
export type PublishedPacket = {
  id: string;
  data: DataPacket;
};

type ClientPacketCollection = {
  id: string;
  packets: DataPacket[];
};

export type ClientActivityProps = {
  clientId: string;
  type: number;
  timestamp: number;
};

export enum MqttClientsActionTypes {
  SET_LOADING = 'set-loading',
  NEW_MQTT_CLIENT = 'new-mqtt-client',
  NEW_PACKET_PUBLISH = 'new-packet-publish',
  NEW_CLIENT_ACTIVITY = 'new-client-activity',
}

type SET_LOADING = {
  type: MqttClientsActionTypes.SET_LOADING;
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
  published: ClientPacketCollection[];
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

const MqttClientsStateContext = createContext<State | undefined>(undefined);
const MqttClientsDispatchContext = createContext<Dispatch | undefined>(
  undefined
);

function mqttClientsReducer(state: State, action: Action): State {
  switch (action.type) {
    case MqttClientsActionTypes.SET_LOADING: {
      return {...state, loading: action.payload};
    }

    case MqttClientsActionTypes.NEW_MQTT_CLIENT: {
      return {...state, clients: [...state.clients, action.payload]};
    }

    case MqttClientsActionTypes.NEW_PACKET_PUBLISH: {
      const existingPublishedPacketCollection: ClientPacketCollection[] =
        state.published;
      const {
        id: newPacketClientId,
        data: newPacketData,
      }: PublishedPacket = action.payload;

      // ToDo: verify
      const updatedPacketCollection: ClientPacketCollection[] = existingPublishedPacketCollection.filter(
        ({id: existingPacketClientId, packets: existingClientPackets}) =>
          newPacketClientId === existingPacketClientId
            ? [
                ...existingPublishedPacketCollection,
                {
                  id: existingPacketClientId,
                  packets: [...existingClientPackets, newPacketData],
                },
              ]
            : existingPublishedPacketCollection.push({
                id: newPacketClientId,
                packets: [newPacketData],
              })
      );

      return {...state, published: updatedPacketCollection};
    }

    case MqttClientsActionTypes.NEW_CLIENT_ACTIVITY: {
      return {...state, activity: [...state.activity, action.payload]};
    }

    default:
      return state;
  }
}

function useMqttClientsState(): State {
  const context = useContext(MqttClientsStateContext);

  if (context === undefined) {
    throw new Error(
      'useMqttClientsState must be used within a MqttClientsProvider'
    );
  }

  return context;
}

function useMqttClientsDispatch(): Dispatch {
  const context = useContext(MqttClientsDispatchContext);

  if (context === undefined) {
    throw new Error(
      'useMqttClientsDispatch must be used within a MqttClientsProvider'
    );
  }

  return context;
}

function useMqttClients(): [State, Dispatch] {
  // To access const [state, dispatch] = useMqttClients()
  return [useMqttClientsState(), useMqttClientsDispatch()];
}

type MqttClientsProviderProps = {
  children: React.ReactNode;
};

const MqttClientsProvider: React.FC<MqttClientsProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(mqttClientsReducer, initialValues);

  return (
    <>
      <MqttClientsStateContext.Provider value={state}>
        <MqttClientsDispatchContext.Provider value={dispatch}>
          {children}
        </MqttClientsDispatchContext.Provider>
      </MqttClientsStateContext.Provider>
    </>
  );
};

export {MqttClientsProvider, useMqttClients};
