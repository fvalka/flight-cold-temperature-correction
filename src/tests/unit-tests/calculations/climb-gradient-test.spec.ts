import { climbGradientCorrection } from '$lib/calculations/angle-corrections/gradient-corrections.svelte';
import { unit } from 'mathjs';
import { expect, test } from 'vitest';


test.each([
    { uncorrected_gradient: 0.025, aerodrome_elevation_ft: 200, ground_temperature_degC: -40, input_altitude_ft: 5000, assertion_corrected_gradient: 0.029635 },
    { uncorrected_gradient: 0.05, aerodrome_elevation_ft: 200, ground_temperature_degC: -40, input_altitude_ft: 5000, assertion_corrected_gradient: 0.05927 },
    { uncorrected_gradient: 0.025, aerodrome_elevation_ft: 1000, ground_temperature_degC: 13.0188, input_altitude_ft: 5000, assertion_corrected_gradient: 0.025 },
])('correcting climb gradient:$uncorrected_gradient using aerodrome elevation: $aerodrome_elevation_ft ft, ' + 
    'ground temperature: $ground_temperature_degC degC and altitude: $input_altitude_ft ft',
    ({ uncorrected_gradient, aerodrome_elevation_ft, ground_temperature_degC, input_altitude_ft, assertion_corrected_gradient }) => {

        const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_ft, "ft");

        const corrected_gradient = climbGradientCorrection(uncorrected_gradient, input_altitude, aerodrome_elevation, aerodrome_ground_temperature);

        expect(corrected_gradient).toBeCloseTo(assertion_corrected_gradient, 2);
    })
