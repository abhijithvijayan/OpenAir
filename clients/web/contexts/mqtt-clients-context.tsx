import React, {createContext, useReducer, useContext} from 'react';

export type MqttClient = {
  id: string;
  type: string;
  connected_at: Date;
  closed: boolean;
  connecting: boolean;
  connected: boolean;
  clean: boolean;
  version: number;
};

export enum MqttClientsActionTypes {
  SET_LOADING = 'set-loading',
  ADD_MQTT_CLIENT = 'add-mqtt-client',
}

type SET_LOADING = {
  type: MqttClientsActionTypes.SET_LOADING;
  payload: boolean;
};

type ADD_MQTT_CLIENT = {
  type: MqttClientsActionTypes.ADD_MQTT_CLIENT;
  payload: MqttClient;
};

type Action = SET_LOADING | ADD_MQTT_CLIENT;

type InitialValues = {
  loading: boolean;
  clients: MqttClient[];
};

const initialValues: InitialValues = {
  loading: false,
  clients: [],
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

    case MqttClientsActionTypes.ADD_MQTT_CLIENT: {
      return {...state, clients: [...state.clients, action.payload]};
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
