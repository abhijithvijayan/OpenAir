import { AQIResult, getCompoundAQI } from './aqi';

type CompoundSensorReading = {
    id: string;
    type: string;
    compound: string;
    value: number; // ToDo: this may cause some auto type conversions which may break computation(fix from source itself)
};

type LocationDataProperties = {
    name: string;
    location: {
        type: string;
        coordinates: {
            lat: string;
            lng: string;
        };
    };
};

interface AirDataPacketProperties extends LocationDataProperties {
    readings: CompoundSensorReading[];
}

export interface PollutionDataProperties extends LocationDataProperties {
    pollution: {
        main: string;
        aqi: number;
    };
}

export function generateAqiDataPacket(context: string): PollutionDataProperties {
    // ToDo: add validator to data body
    const packet: AirDataPacketProperties = JSON.parse(context);

    const { readings, ...otherProps } = packet;
    // build up aqi data per sensor
    const aqiData: AQIResult[] = readings.map(({ compound, value }) => {
        return getCompoundAQI(compound, value);
    });

    // find the one with largest aqi
    const { aqi, substance } = aqiData.reduce((previousAqi, currentAqi) => {
        return previousAqi.aqi > currentAqi.aqi ? previousAqi : currentAqi;
    });

    // data to send to backend
    const pollutionData: PollutionDataProperties = {
        ...otherProps,
        pollution: {
            main: substance,
            aqi,
        },
    };

    return pollutionData;
}
