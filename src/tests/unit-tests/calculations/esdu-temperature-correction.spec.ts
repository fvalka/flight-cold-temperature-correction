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
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  3400.0, ground_temperature_degC:   20.00, assertion_corrected_altitude_ft:  3340.5 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  3400.0, ground_temperature_degC:   10.00, assertion_corrected_altitude_ft:  3436.3 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  3400.0, ground_temperature_degC:    0.00, assertion_corrected_altitude_ft:  3539.2 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  3400.0, ground_temperature_degC:  -10.00, assertion_corrected_altitude_ft:  3650.2 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  3400.0, ground_temperature_degC:  -20.00, assertion_corrected_altitude_ft:  3770.1 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  3400.0, ground_temperature_degC:  -30.00, assertion_corrected_altitude_ft:  3900.2 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  3400.0, ground_temperature_degC:  -40.00, assertion_corrected_altitude_ft:  4041.8 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  2300.0, ground_temperature_degC:   20.00, assertion_corrected_altitude_ft:  2264.5 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  2300.0, ground_temperature_degC:   10.00, assertion_corrected_altitude_ft:  2321.7 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  2300.0, ground_temperature_degC:    0.00, assertion_corrected_altitude_ft:  2383.1 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  2300.0, ground_temperature_degC:  -10.00, assertion_corrected_altitude_ft:  2449.3 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  2300.0, ground_temperature_degC:  -20.00, assertion_corrected_altitude_ft:  2520.8 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  2300.0, ground_temperature_degC:  -30.00, assertion_corrected_altitude_ft:  2598.2 },
    { aerodrome_elevation_ft:   654.0,	 input_altitude_ft:  2300.0, ground_temperature_degC:  -40.00, assertion_corrected_altitude_ft:  2682.5 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3300.0, ground_temperature_degC:   20.00, assertion_corrected_altitude_ft:  3249.4 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3300.0, ground_temperature_degC:   10.00, assertion_corrected_altitude_ft:  3314.9 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3300.0, ground_temperature_degC:    0.00, assertion_corrected_altitude_ft:  3385.4 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3300.0, ground_temperature_degC:  -10.00, assertion_corrected_altitude_ft:  3461.2 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3300.0, ground_temperature_degC:  -20.00, assertion_corrected_altitude_ft:  3543.2 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3300.0, ground_temperature_degC:  -30.00, assertion_corrected_altitude_ft:  3632.0 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3300.0, ground_temperature_degC:  -40.00, assertion_corrected_altitude_ft:  3728.7 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3000.0, ground_temperature_degC:   20.00, assertion_corrected_altitude_ft:  2957.4 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3000.0, ground_temperature_degC:   10.00, assertion_corrected_altitude_ft:  3012.6 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3000.0, ground_temperature_degC:    0.00, assertion_corrected_altitude_ft:  3071.8 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3000.0, ground_temperature_degC:  -10.00, assertion_corrected_altitude_ft:  3135.5 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3000.0, ground_temperature_degC:  -20.00, assertion_corrected_altitude_ft:  3204.4 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3000.0, ground_temperature_degC:  -30.00, assertion_corrected_altitude_ft:  3279.1 },
    { aerodrome_elevation_ft:  1405.0,	 input_altitude_ft:  3000.0, ground_temperature_degC:  -40.00, assertion_corrected_altitude_ft:  3360.2 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 11600.0, ground_temperature_degC:   20.00, assertion_corrected_altitude_ft: 11365.0 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 11600.0, ground_temperature_degC:   10.00, assertion_corrected_altitude_ft: 11468.3 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 11600.0, ground_temperature_degC:    0.00, assertion_corrected_altitude_ft: 11579.4 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 11600.0, ground_temperature_degC:  -10.00, assertion_corrected_altitude_ft: 11699.1 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 11600.0, ground_temperature_degC:  -20.00, assertion_corrected_altitude_ft: 11828.5 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 11600.0, ground_temperature_degC:  -30.00, assertion_corrected_altitude_ft: 11968.8 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 11600.0, ground_temperature_degC:  -40.00, assertion_corrected_altitude_ft: 12121.6 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 10600.0, ground_temperature_degC:   20.00, assertion_corrected_altitude_ft: 10440.6 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 10600.0, ground_temperature_degC:   10.00, assertion_corrected_altitude_ft: 10510.7 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 10600.0, ground_temperature_degC:    0.00, assertion_corrected_altitude_ft: 10586.0 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 10600.0, ground_temperature_degC:  -10.00, assertion_corrected_altitude_ft: 10667.2 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 10600.0, ground_temperature_degC:  -20.00, assertion_corrected_altitude_ft: 10754.9 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 10600.0, ground_temperature_degC:  -30.00, assertion_corrected_altitude_ft: 10849.9 },
    { aerodrome_elevation_ft:  8468.0,	 input_altitude_ft: 10600.0, ground_temperature_degC:  -40.00, assertion_corrected_altitude_ft: 10953.3 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  3100.0, ground_temperature_degC:   20.00, assertion_corrected_altitude_ft:  3046.1 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  3100.0, ground_temperature_degC:   10.00, assertion_corrected_altitude_ft:  3141.6 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  3100.0, ground_temperature_degC:    0.00, assertion_corrected_altitude_ft:  3244.2 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  3100.0, ground_temperature_degC:  -10.00, assertion_corrected_altitude_ft:  3354.9 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  3100.0, ground_temperature_degC:  -20.00, assertion_corrected_altitude_ft:  3474.4 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  3100.0, ground_temperature_degC:  -30.00, assertion_corrected_altitude_ft:  3604.1 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  3100.0, ground_temperature_degC:  -40.00, assertion_corrected_altitude_ft:  3745.2 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  1600.0, ground_temperature_degC:   20.00, assertion_corrected_altitude_ft:  1575.8 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  1600.0, ground_temperature_degC:   10.00, assertion_corrected_altitude_ft:  1618.7 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  1600.0, ground_temperature_degC:    0.00, assertion_corrected_altitude_ft:  1664.7 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  1600.0, ground_temperature_degC:  -10.00, assertion_corrected_altitude_ft:  1714.2 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  1600.0, ground_temperature_degC:  -20.00, assertion_corrected_altitude_ft:  1767.7 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  1600.0, ground_temperature_degC:  -30.00, assertion_corrected_altitude_ft:  1825.7 },
    { aerodrome_elevation_ft:   368.0,	 input_altitude_ft:  1600.0, ground_temperature_degC:  -40.00, assertion_corrected_altitude_ft:  1888.7 },
])('Compare the resutls to the implementation of lightcivvie: $aerodrome_elevation_ft ft, ground_temperature_degC: $ground_temperature_degC degC ' + 
    'and altitude: $input_altitude_ft ft',
    ({ aerodrome_elevation_ft, ground_temperature_degC, input_altitude_ft, assertion_corrected_altitude_ft }) => {
        const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_ft, "ft");

        const corrected_altitude = altitudeCorrectionESDU(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
        const corrected_altitude_ft = corrected_altitude.toNumber("ft");

        // 5 ft are allowed for the rounding to nearest 10 degrees in the AIP table
        expect(abs(corrected_altitude_ft - assertion_corrected_altitude_ft)).toBeLessThanOrEqual(0.5);
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


test('Compare the esd temperature correction over the full range of valid inputs against the simplified method', 
    {
        timeout: 120000
    },
    () => {

    for (let isa_deviation_degC = -80; isa_deviation_degC <=0; isa_deviation_degC += 20 ) {
        for (let aerodrome_elevation_ft = -1000; aerodrome_elevation_ft <= 36000; aerodrome_elevation_ft += 2000) {
            const comparisonIsaAtAirport = 15 - 0.0019812 * aerodrome_elevation_ft;
            const ground_temperature_degC = comparisonIsaAtAirport  + isa_deviation_degC;

            const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
            const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");

            for (let input_altitude_ft = aerodrome_elevation_ft; input_altitude_ft <= 36000; input_altitude_ft += 2000) {
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