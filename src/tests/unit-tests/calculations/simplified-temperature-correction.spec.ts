import { simplifiedAltitudeCorrection } from '$lib/calculations/temperature-correction/simplified-temperature-correction.svelte';
import { abs, round, subtract, unit } from 'mathjs';
import { expect, test } from 'vitest';

test.each([
    { aerodrome_elevation_ft:     0, ground_temperature_degC:   0, input_altitude_ft:  5000, assertion_corrected_altitude_ft:  5280 }, 
    { aerodrome_elevation_ft: 10000, ground_temperature_degC: -20, input_altitude_ft: 15000, assertion_corrected_altitude_ft: 15295 }, 
    { aerodrome_elevation_ft: 10000, ground_temperature_degC: -20, input_altitude_ft: 12000, assertion_corrected_altitude_ft: 12117 }, 
    { aerodrome_elevation_ft: 10000, ground_temperature_degC: -20, input_altitude_ft: 10000, assertion_corrected_altitude_ft: 10000 }, 
    { aerodrome_elevation_ft:  5000, ground_temperature_degC: -60, input_altitude_ft: 10000, assertion_corrected_altitude_ft: 11528 }, 
    { aerodrome_elevation_ft:  2500, ground_temperature_degC: -35, input_altitude_ft:  5000, assertion_corrected_altitude_ft:  5473 }, 
])('Testing the simplified correction to make sure it matches the Eurocontrol calculator: $aerodrome_elevation_ft ft, ' + 
    'ground_temperature_degC: $ground_temperature_degC degC and altitude: $input_altitude_ft ft',
    ({ aerodrome_elevation_ft, ground_temperature_degC, input_altitude_ft, assertion_corrected_altitude_ft }) => {
        const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_ft, "ft");

        const corrected_altitude = simplifiedAltitudeCorrection(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
        const corrected_altitude_ft = round(corrected_altitude.toNumber("ft"));

        expect(corrected_altitude_ft).toBeCloseTo(assertion_corrected_altitude_ft, 1.0);
    });