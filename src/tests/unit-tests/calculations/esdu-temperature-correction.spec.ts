import { altitudeCorrectionESDU } from '$lib/calculations/temperature-correction/esdu-temperature-correction.svelte';
import { abs, unit } from 'mathjs';
import { expect, test } from 'vitest';


test.each([
    { aerodrome_elevation_ft: 3000, ground_temperature_degC: -45, input_altitude_ft: 5000, assertion_corrected_altitude_ft: 5385.8133 }, // Based on ESDU and Wiley
    { aerodrome_elevation_ft: 0, ground_temperature_degC: -10, input_altitude_ft: 150, assertion_corrected_altitude_ft: 163.0208 }, // Based on ESDU and Wiley
    { aerodrome_elevation_ft: 1000, ground_temperature_degC: -10, input_altitude_ft: 3000, assertion_corrected_altitude_ft: 3162.09 }, // Based on Transport Canda AC 500-020
    { aerodrome_elevation_ft: 12000, ground_temperature_degC: -70, input_altitude_ft: 25000, assertion_corrected_altitude_ft:  28167.5} // Based on Transport Canda AC 500-020
])('correcting altitude using aerodrome elevation: $aerodrome_elevation_ft ft, ground temperature: $ground_temperature_degC degC ' + 
    'and altitude: $input_altitude_ft ft',
    ({ aerodrome_elevation_ft, ground_temperature_degC, input_altitude_ft, assertion_corrected_altitude_ft }) => {
        const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_ft, "ft");

        const corrected_altitude = altitudeCorrectionESDU(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
        const corrected_altitude_ft = corrected_altitude.toNumber("ft");

        expect(corrected_altitude_ft).toBeCloseTo(assertion_corrected_altitude_ft, 0.1);
    })



test.each([
    { aerodrome_elevation_ft: 3000, ground_temperature_degC: -45, input_altitude_ft: 5000 },
    { aerodrome_elevation_ft: 0, ground_temperature_degC: -10, input_altitude_ft: 150 }, 
    { aerodrome_elevation_ft: 1000, ground_temperature_degC: -10, input_altitude_ft: 1000 }, 
    { aerodrome_elevation_ft: 1000, ground_temperature_degC: -10, input_altitude_ft: 3000 }, 
    { aerodrome_elevation_ft: 2000, ground_temperature_degC: -20, input_altitude_ft: 8000 }, 
    { aerodrome_elevation_ft: 2000, ground_temperature_degC: -30, input_altitude_ft: 8000 }, 
    { aerodrome_elevation_ft: 2000, ground_temperature_degC: -40, input_altitude_ft: 8000 }, 
    { aerodrome_elevation_ft: 2000, ground_temperature_degC: -50, input_altitude_ft: 8000 }, 
    { aerodrome_elevation_ft: 7999, ground_temperature_degC: -50, input_altitude_ft: 8000 }, 
    { aerodrome_elevation_ft: 17000, ground_temperature_degC: -80, input_altitude_ft: 36000 }, 
    { aerodrome_elevation_ft: 0, ground_temperature_degC: 15, input_altitude_ft: 36000 }, 
    { aerodrome_elevation_ft: -1000, ground_temperature_degC: 16, input_altitude_ft: 5000 } 
])('comparing altitude correction result to Air Canda AC 500-020 calculation for aerodrome elevation: $aerodrome_elevation_ft ft,' + 
    ' ground temperature: $ground_temperature_degC degC and altitude: $input_altitude_ft ft',
    ({ aerodrome_elevation_ft, ground_temperature_degC, input_altitude_ft }) => {
        // The comparison equation has been implemented based on:
        // Flight Management System (FMS) Barometric Vertical Navigation (VNAV) Temperature Compensation, 
        // Advisory Circular (AC) No. 500-020, Transport Candada, 2025
        // https://tc.canada.ca/en/aviation/reference-centre/advisory-circulars/advisory-circular-ac-no-500-020#toc4-8
        const comparisonIsaAtAirport = 15 - 0.0019812 * aerodrome_elevation_ft;
        const comparisonIsaDeviation = ground_temperature_degC - comparisonIsaAtAirport;
        const lapseRate = 0.0019812;
        const transportCanadaACResult = input_altitude_ft + 
            (comparisonIsaDeviation/lapseRate) * Math.log(1 - (lapseRate * (input_altitude_ft - aerodrome_elevation_ft))/(273.15 + 15 - lapseRate * aerodrome_elevation_ft));


        const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_ft, "ft");

        const corrected_altitude = altitudeCorrectionESDU(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
        const corrected_altitude_ft = corrected_altitude.toNumber("ft");


        expect(corrected_altitude_ft).toBeCloseTo(transportCanadaACResult, 0.1);
    })

test.each([
    { aerodrome_elevation_ft:0, ground_temperature_degC: 50, input_altitude_m: 300, assertion_corrected_altitude_m: 300-37 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 40, input_altitude_m: 300, assertion_corrected_altitude_m: 300-26 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 30, input_altitude_m: 300, assertion_corrected_altitude_m: 300-16 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 20, input_altitude_m: 300, assertion_corrected_altitude_m: 300-5 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 10, input_altitude_m: 300, assertion_corrected_altitude_m: 300+5 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 0, input_altitude_m: 300, assertion_corrected_altitude_m: 300+16 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -10, input_altitude_m: 300, assertion_corrected_altitude_m: 300+26 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -20, input_altitude_m: 300, assertion_corrected_altitude_m: 300+37 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -30, input_altitude_m: 300, assertion_corrected_altitude_m: 300+47 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -40, input_altitude_m: 300, assertion_corrected_altitude_m: 300+57 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -50, input_altitude_m: 300, assertion_corrected_altitude_m: 300+68 },

    { aerodrome_elevation_ft:0, ground_temperature_degC: 50, input_altitude_m:  900, assertion_corrected_altitude_m: 900-110 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 40, input_altitude_m:  900, assertion_corrected_altitude_m: 900-79 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 30, input_altitude_m:  900, assertion_corrected_altitude_m: 900-47 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 20, input_altitude_m:  900, assertion_corrected_altitude_m: 900-16 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 10, input_altitude_m:  900, assertion_corrected_altitude_m: 900+16 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 0, input_altitude_m:   900, assertion_corrected_altitude_m: 900+47 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -10, input_altitude_m: 900, assertion_corrected_altitude_m: 900+79 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -20, input_altitude_m: 900, assertion_corrected_altitude_m: 900+110 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -30, input_altitude_m: 900, assertion_corrected_altitude_m: 900+142 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -40, input_altitude_m: 900, assertion_corrected_altitude_m: 900+174 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -50, input_altitude_m: 900, assertion_corrected_altitude_m: 900+205 },

    { aerodrome_elevation_ft:0, ground_temperature_degC: 50, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500-185 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 40, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500-132 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 30, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500-79 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 20, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500-26 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 10, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500+26 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: 0, input_altitude_m:   1500, assertion_corrected_altitude_m: 1500+79 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -10, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+132 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -20, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+185 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -30, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+238 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -40, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+291 },
    { aerodrome_elevation_ft:0, ground_temperature_degC: -50, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+344 },
])('Comparing the results to the ICAO Doc 8168 Volume II, Seventh edition 2020, table III-3-4-App A1 ' + 
    'for 0 ft aerodrome elevation, aerodrome_temperature_degC: $aerodrome_temperature_degC input_altitude_m: $input_altitude_m ' + 
    'assertion_corrected_altitude_m: $assertion_corrected_altitude_m',
    ({aerodrome_elevation_ft, ground_temperature_degC, input_altitude_m, assertion_corrected_altitude_m}) => {
        const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_m, "m");

        const corrected_altitude = altitudeCorrectionESDU(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
        const corrected_altitude_ft = corrected_altitude.toNumber("m");

        expect(abs(corrected_altitude_ft - assertion_corrected_altitude_m)).toBeLessThan(1.0);
    })
