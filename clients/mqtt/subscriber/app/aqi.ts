import { AQSample, calculateAQI, Substance, Interval, Unit, IResult } from 'aqi-calc';

const SMOKE = 'smoke';
const CO = 'CO';
const NOx = 'NOx';

function getIntervalOfCompound(compound: string): string | null {
    if (compound === SMOKE) {
        return Interval.Day;
    }
    if (compound === CO) {
        return Interval.EightHour;
    }
    if (compound === NOx) {
        return Interval.OneHour;
    }

    return null;
}

function getUnitOfCompound(compound: string): string | null {
    if (compound === SMOKE) {
        return Unit.UG_M3;
    }
    if (compound === CO) {
        return Unit.PPM;
    }
    if (compound === NOx) {
        return Unit.PPB;
    }

    return null;
}

function convertUnitConcentration(compound: string, concentration: number): number {
    const unit = getUnitOfCompound(compound);

    if (unit === Unit.PPB) {
        // 1ppm = 1000ppb
        return 1000 * concentration;
    }
    if (unit === Unit.UG_M3) {
        // ToDo: perform conversion and return it
    }

    // default PPM
    return concentration;
}

function getSubstance(compound: string): string | null {
    if (compound === SMOKE) {
        return Substance.FineParticles;
    }
    if (compound === CO) {
        return Substance.CarbonMonoxide;
    }
    if (compound === NOx) {
        return Substance.NitrousDioxide;
    }

    return null;
}

export function getCompoundAQI(compound: string, concentration: number): IResult {
    const substance = getSubstance(compound);
    const unit = getUnitOfCompound(compound);
    const value = convertUnitConcentration(compound, concentration);
    const interval = getIntervalOfCompound(compound);

    // assign keys only if not null
    const testItemBody: AQSample = {
        ...(substance && { substance }),
        ...(unit && { unit }),
        ...(value && { value }),
        ...(interval && { interval }),
    };

    return calculateAQI(testItemBody);
}
