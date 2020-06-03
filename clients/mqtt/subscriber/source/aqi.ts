import {
  IResult,
  calculateAQI,
  Substance,
  Interval,
  ISample,
  Unit,
} from 'aqi-calc';

const SMOKE = 'smoke';
const CO = 'CO';
const NOx = 'NOx';

function getIntervalOfCompound(compound: string): Interval {
  if (compound === SMOKE) {
    return Interval.Day;
  }
  if (compound === CO) {
    return Interval.EightHour;
  }
  if (compound === NOx) {
    return Interval.OneHour;
  }

  // default
  return Interval.Day;
}

function getUnitOfCompound(compound: string): Unit {
  if (compound === SMOKE) {
    return Unit.UG_M3;
  }
  if (compound === CO) {
    return Unit.PPM;
  }
  if (compound === NOx) {
    return Unit.PPB;
  }

  // default
  return Unit.PPM;
}

function convertUnitConcentration(
  compound: string,
  concentration: number
): number {
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

function getSubstance(compound: string): Substance {
  if (compound === SMOKE) {
    return Substance.FineParticles;
  }
  if (compound === CO) {
    return Substance.CarbonMonoxide;
  }
  if (compound === NOx) {
    return Substance.NitrousDioxide;
  }

  // default
  return Substance.CoarseParticles;
}

export type AQIResult = {
  aqi: number;
  substance: Substance;
};

export function getCompoundAQI(
  compound: string,
  concentration: number
): AQIResult {
  const substance = getSubstance(compound);
  const unit = getUnitOfCompound(compound);
  const amount = convertUnitConcentration(compound, concentration);
  const interval = getIntervalOfCompound(compound);

  // assign keys only if not null
  const testItemBody: ISample = {
    substance,
    unit,
    amount,
    interval,
  };

  const {aqi}: IResult = calculateAQI(testItemBody);

  return {
    aqi,
    substance,
  };
}
