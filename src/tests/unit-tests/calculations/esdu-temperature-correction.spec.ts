import { altitudeCorrectionESDU } from '$lib/calculations/temperature-correction/esdu-temperature-correction.svelte';
import { simplifiedAltitudeCorrection } from '$lib/calculations/temperature-correction/simplified-temperature-correction.svelte';
import { abs, subtract, unit } from 'mathjs';
import { expect, test } from 'vitest';

test.each([
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 20, input_altitude_ft: 17000, assertion_corrected_altitude_ft: 15940 }, 
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 20, input_altitude_ft: 16000, assertion_corrected_altitude_ft: 15010 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 20, input_altitude_ft: 13610, assertion_corrected_altitude_ft: 12790 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 20, input_altitude_ft: 11690, assertion_corrected_altitude_ft: 11010 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 20, input_altitude_ft:  8630, assertion_corrected_altitude_ft:  8160 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 20, input_altitude_ft:  7100, assertion_corrected_altitude_ft:  6730 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 20, input_altitude_ft:  4030, assertion_corrected_altitude_ft:  3870 },
    
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 10, input_altitude_ft: 17000, assertion_corrected_altitude_ft: 16450 }, 
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 10, input_altitude_ft: 16000, assertion_corrected_altitude_ft: 15490 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 10, input_altitude_ft: 13610, assertion_corrected_altitude_ft: 13190 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 10, input_altitude_ft: 11690, assertion_corrected_altitude_ft: 11340 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 10, input_altitude_ft:  8630, assertion_corrected_altitude_ft:  8390 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 10, input_altitude_ft:  7100, assertion_corrected_altitude_ft:  6910 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 10, input_altitude_ft:  4030, assertion_corrected_altitude_ft:  3950 },
    
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 0, input_altitude_ft: 17000, assertion_corrected_altitude_ft: 17000 }, 
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 0, input_altitude_ft: 16000, assertion_corrected_altitude_ft: 16000 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 0, input_altitude_ft: 13610, assertion_corrected_altitude_ft: 13610 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 0, input_altitude_ft: 11690, assertion_corrected_altitude_ft: 11690 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 0, input_altitude_ft:  8630, assertion_corrected_altitude_ft:  8630 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 0, input_altitude_ft:  7100, assertion_corrected_altitude_ft:  7100 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: 0, input_altitude_ft:  4030, assertion_corrected_altitude_ft:  4030 },
    
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -10, input_altitude_ft: 17000, assertion_corrected_altitude_ft: 17600 }, 
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -10, input_altitude_ft: 16000, assertion_corrected_altitude_ft: 16550 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -10, input_altitude_ft: 13610, assertion_corrected_altitude_ft: 14070 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -10, input_altitude_ft: 11690, assertion_corrected_altitude_ft: 12070 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -10, input_altitude_ft:  8630, assertion_corrected_altitude_ft:  8890 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -10, input_altitude_ft:  7100, assertion_corrected_altitude_ft:  7300 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -10, input_altitude_ft:  4030, assertion_corrected_altitude_ft:  4120 },
    
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -20, input_altitude_ft: 17000, assertion_corrected_altitude_ft: 18240 }, 
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -20, input_altitude_ft: 16000, assertion_corrected_altitude_ft: 17160 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -20, input_altitude_ft: 13610, assertion_corrected_altitude_ft: 14560 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -20, input_altitude_ft: 11690, assertion_corrected_altitude_ft: 12490 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -20, input_altitude_ft:  8630, assertion_corrected_altitude_ft:  9180 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -20, input_altitude_ft:  7100, assertion_corrected_altitude_ft:  7530 },
    { aerodrome_elevation_ft: 1582, isa_deviation_degC: -20, input_altitude_ft:  4030, assertion_corrected_altitude_ft:  4220 },
])('Tests to ensure that the calculation matches the AIP table from LSGS AD 2- 19: $aerodrome_elevation_ft ft, ground isa_deviation_degC: $isa_deviation_degC degC ' + 
    'and altitude: $input_altitude_ft ft',
    ({ aerodrome_elevation_ft, isa_deviation_degC, input_altitude_ft, assertion_corrected_altitude_ft }) => {
        const comparisonIsaAtAirport = 15 - 0.0019812 * aerodrome_elevation_ft;
        const ground_temperature_degC = comparisonIsaAtAirport  + isa_deviation_degC;

        const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_ft, "ft");

        const corrected_altitude = altitudeCorrectionESDU(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
        const corrected_altitude_ft = corrected_altitude.toNumber("ft");

        // 5 ft are allowed for the rounding to nearest 10 degrees in the AIP table
        expect(abs(corrected_altitude_ft - assertion_corrected_altitude_ft)).toBeLessThanOrEqual(5);
    });



test.each([
    { aerodrome_elevation_ft: 0, isa_deviation_degC: -80, input_altitude_ft: 36000, assertion_corrected_altitude_ft: 55332 }, 
])('Ensure convergence for extreme values of the iterative method: $aerodrome_elevation_ft ft, ground isa_deviation_degC: $isa_deviation_degC degC ' + 
    'and altitude: $input_altitude_ft ft',
    ({ aerodrome_elevation_ft, isa_deviation_degC, input_altitude_ft, assertion_corrected_altitude_ft }) => {
        const comparisonIsaAtAirport = 15 - 0.0019812 * aerodrome_elevation_ft;
        const ground_temperature_degC = comparisonIsaAtAirport  + isa_deviation_degC;

        const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_ft, "ft");

        const corrected_altitude = altitudeCorrectionESDU(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
        const corrected_altitude_ft = corrected_altitude.toNumber("ft");

        expect(abs(corrected_altitude_ft - assertion_corrected_altitude_ft)).toBeLessThanOrEqual(5);
    });


test('Check convergence of the iterative method for the whole range of valid inputs', 
    {
        timeout: 120000
    },
    () => {

    for (let isa_deviation_degC = -80; isa_deviation_degC <=0; isa_deviation_degC += 20 ) {
        for (let aerodrome_elevation_ft = -1000; aerodrome_elevation_ft <= 36000; aerodrome_elevation_ft += 2000) {
            for (let input_altitude_ft = aerodrome_elevation_ft; input_altitude_ft <= 36000; input_altitude_ft += 2000) {
                const comparisonIsaAtAirport = 15 - 0.0019812 * aerodrome_elevation_ft;
                const ground_temperature_degC = comparisonIsaAtAirport  + isa_deviation_degC;

                const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
                const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
                const input_altitude = unit(input_altitude_ft, "ft");

                const corrected_altitude = altitudeCorrectionESDU(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
                const corrected_altitude_ft = corrected_altitude.toNumber("ft");

                const simplified_correction = simplifiedAltitudeCorrection(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
                const simplified_correction_ft = simplified_correction.toNumber("ft");

                const relative_difference = abs(corrected_altitude_ft - simplified_correction_ft)/corrected_altitude_ft;

                // The simplified equation is valid up to aerodromes elevation of 10000ft and heights of 5000ft above the aerodrome
                // therefore in those cases a tighter tolerance can be used
                let relative_tolerance = 0.05;
                if(aerodrome_elevation_ft <= 10000 && input_altitude_ft-aerodrome_elevation_ft <= 5000) {
                    relative_tolerance = 0.01;
                }

                expect(relative_difference).toBeLessThanOrEqual(relative_tolerance);
                expect(corrected_altitude_ft + 10).toBeGreaterThanOrEqual(simplified_correction_ft);
            }
        }
    }
})