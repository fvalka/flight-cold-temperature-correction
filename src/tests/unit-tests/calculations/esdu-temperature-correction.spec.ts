import { altitudeCorrectionESDU } from '$lib/calculations/temperature-correction/esdu-temperature-correction.svelte';
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

        expect(abs(corrected_altitude_ft - assertion_corrected_altitude_ft)).toBeLessThanOrEqual(5);
    })


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
    { aerodrome_elevation_m:0, ground_temperature_degC: 50, input_altitude_m: 300, assertion_corrected_altitude_m: 300-37 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 40, input_altitude_m: 300, assertion_corrected_altitude_m: 300-26 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 30, input_altitude_m: 300, assertion_corrected_altitude_m: 300-16 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 20, input_altitude_m: 300, assertion_corrected_altitude_m: 300-5 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 10, input_altitude_m: 300, assertion_corrected_altitude_m: 300+5 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 0, input_altitude_m: 300, assertion_corrected_altitude_m: 300+16 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -10, input_altitude_m: 300, assertion_corrected_altitude_m: 300+26 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -20, input_altitude_m: 300, assertion_corrected_altitude_m: 300+37 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -30, input_altitude_m: 300, assertion_corrected_altitude_m: 300+47 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -40, input_altitude_m: 300, assertion_corrected_altitude_m: 300+57 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -50, input_altitude_m: 300, assertion_corrected_altitude_m: 300+68 },

    { aerodrome_elevation_m:0, ground_temperature_degC: 50, input_altitude_m:  900, assertion_corrected_altitude_m: 900-110 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 40, input_altitude_m:  900, assertion_corrected_altitude_m: 900-79 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 30, input_altitude_m:  900, assertion_corrected_altitude_m: 900-47 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 20, input_altitude_m:  900, assertion_corrected_altitude_m: 900-16 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 10, input_altitude_m:  900, assertion_corrected_altitude_m: 900+16 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 0, input_altitude_m:   900, assertion_corrected_altitude_m: 900+47 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -10, input_altitude_m: 900, assertion_corrected_altitude_m: 900+79 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -20, input_altitude_m: 900, assertion_corrected_altitude_m: 900+110 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -30, input_altitude_m: 900, assertion_corrected_altitude_m: 900+142 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -40, input_altitude_m: 900, assertion_corrected_altitude_m: 900+174 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -50, input_altitude_m: 900, assertion_corrected_altitude_m: 900+205 },

    { aerodrome_elevation_m:0, ground_temperature_degC: 50, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500-185 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 40, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500-132 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 30, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500-79 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 20, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500-26 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 10, input_altitude_m:  1500, assertion_corrected_altitude_m: 1500+26 },
    { aerodrome_elevation_m:0, ground_temperature_degC: 0, input_altitude_m:   1500, assertion_corrected_altitude_m: 1500+79 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -10, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+132 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -20, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+185 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -30, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+238 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -40, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+291 },
    { aerodrome_elevation_m:0, ground_temperature_degC: -50, input_altitude_m: 1500, assertion_corrected_altitude_m: 1500+344 },


    
    { aerodrome_elevation_m:900, ground_temperature_degC: 50, input_altitude_m:  900 + 300, assertion_corrected_altitude_m: 900 + 300-44 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 40, input_altitude_m:  900 + 300, assertion_corrected_altitude_m: 900 + 300-33 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 30, input_altitude_m:  900 + 300, assertion_corrected_altitude_m: 900 + 300-22 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 20, input_altitude_m:  900 + 300, assertion_corrected_altitude_m: 900 + 300-12 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 10, input_altitude_m:  900 + 300, assertion_corrected_altitude_m: 900 + 300-1 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 0, input_altitude_m:   900 + 300, assertion_corrected_altitude_m: 900 + 300+10 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -10, input_altitude_m: 900 + 300, assertion_corrected_altitude_m: 900 + 300+20 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -20, input_altitude_m: 900 + 300, assertion_corrected_altitude_m: 900 + 300+31 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -30, input_altitude_m: 900 + 300, assertion_corrected_altitude_m: 900 + 300+42 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -40, input_altitude_m: 900 + 300, assertion_corrected_altitude_m: 900 + 300+52 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -50, input_altitude_m: 900 + 300, assertion_corrected_altitude_m: 900 + 300+63 },
    
    { aerodrome_elevation_m:900, ground_temperature_degC: 50, input_altitude_m:  900 + 900, assertion_corrected_altitude_m: 900 + 900-132 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 40, input_altitude_m:  900 + 900, assertion_corrected_altitude_m: 900 + 900-99 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 30, input_altitude_m:  900 + 900, assertion_corrected_altitude_m: 900 + 900-67 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 20, input_altitude_m:  900 + 900, assertion_corrected_altitude_m: 900 + 900-35 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 10, input_altitude_m:  900 + 900, assertion_corrected_altitude_m: 900 + 900-3 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 0, input_altitude_m:   900 + 900, assertion_corrected_altitude_m: 900 + 900+29 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -10, input_altitude_m: 900 + 900, assertion_corrected_altitude_m: 900 + 900+62 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -20, input_altitude_m: 900 + 900, assertion_corrected_altitude_m: 900 + 900+94 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -30, input_altitude_m: 900 + 900, assertion_corrected_altitude_m: 900 + 900+126 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -40, input_altitude_m: 900 + 900, assertion_corrected_altitude_m: 900 + 900+158 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -50, input_altitude_m: 900 + 900, assertion_corrected_altitude_m: 900 + 900+191 },
    
    { aerodrome_elevation_m:900, ground_temperature_degC: 50, input_altitude_m:  900 + 1500, assertion_corrected_altitude_m: 900 + 1500-221 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 40, input_altitude_m:  900 + 1500, assertion_corrected_altitude_m: 900 + 1500-167 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 30, input_altitude_m:  900 + 1500, assertion_corrected_altitude_m: 900 + 1500-113 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 20, input_altitude_m:  900 + 1500, assertion_corrected_altitude_m: 900 + 1500-59 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 10, input_altitude_m:  900 + 1500, assertion_corrected_altitude_m: 900 + 1500-5 },
    { aerodrome_elevation_m:900, ground_temperature_degC: 0, input_altitude_m:   900 + 1500, assertion_corrected_altitude_m: 900 + 1500+49 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -10, input_altitude_m: 900 + 1500, assertion_corrected_altitude_m: 900 + 1500+104 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -20, input_altitude_m: 900 + 1500, assertion_corrected_altitude_m: 900 + 1500+158 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -30, input_altitude_m: 900 + 1500, assertion_corrected_altitude_m: 900 + 1500+212 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -40, input_altitude_m: 900 + 1500, assertion_corrected_altitude_m: 900 + 1500+266 },
    { aerodrome_elevation_m:900, ground_temperature_degC: -50, input_altitude_m: 900 + 1500, assertion_corrected_altitude_m: 900 + 1500+320 },



    
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 50, input_altitude_m:  1800 + 300, assertion_corrected_altitude_m: 1800 + 300-51 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 40, input_altitude_m:  1800 + 300, assertion_corrected_altitude_m: 1800 + 300-40 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 30, input_altitude_m:  1800 + 300, assertion_corrected_altitude_m: 1800 + 300-29 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 20, input_altitude_m:  1800 + 300, assertion_corrected_altitude_m: 1800 + 300-18 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 10, input_altitude_m:  1800 + 300, assertion_corrected_altitude_m: 1800 + 300-7 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 0, input_altitude_m:   1800 + 300, assertion_corrected_altitude_m: 1800 + 300+4 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -10, input_altitude_m: 1800 + 300, assertion_corrected_altitude_m: 1800 + 300+14 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -20, input_altitude_m: 1800 + 300, assertion_corrected_altitude_m: 1800 + 300+25 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -30, input_altitude_m: 1800 + 300, assertion_corrected_altitude_m: 1800 + 300+36 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -40, input_altitude_m: 1800 + 300, assertion_corrected_altitude_m: 1800 + 300+47 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -50, input_altitude_m: 1800 + 300, assertion_corrected_altitude_m: 1800 + 300+58 },
    
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 50, input_altitude_m:  1800 + 900, assertion_corrected_altitude_m: 1800 + 900-154 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 40, input_altitude_m:  1800 + 900, assertion_corrected_altitude_m: 1800 + 900-121 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 30, input_altitude_m:  1800 + 900, assertion_corrected_altitude_m: 1800 + 900-88 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 20, input_altitude_m:  1800 + 900, assertion_corrected_altitude_m: 1800 + 900-55 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 10, input_altitude_m:  1800 + 900, assertion_corrected_altitude_m: 1800 + 900-22 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 0, input_altitude_m:   1800 + 900, assertion_corrected_altitude_m: 1800 + 900+11 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -10, input_altitude_m: 1800 + 900, assertion_corrected_altitude_m: 1800 + 900+44 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -20, input_altitude_m: 1800 + 900, assertion_corrected_altitude_m: 1800 + 900+77 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -30, input_altitude_m: 1800 + 900, assertion_corrected_altitude_m: 1800 + 900+110 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -40, input_altitude_m: 1800 + 900, assertion_corrected_altitude_m: 1800 + 900+142 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -50, input_altitude_m: 1800 + 900, assertion_corrected_altitude_m: 1800 + 900+175 },
    
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 50, input_altitude_m:  1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500-258 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 40, input_altitude_m:  1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500-203 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 30, input_altitude_m:  1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500-147 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 20, input_altitude_m:  1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500-92 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 10, input_altitude_m:  1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500-37 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: 0, input_altitude_m:   1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500+18 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -10, input_altitude_m: 1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500+73 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -20, input_altitude_m: 1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500+129 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -30, input_altitude_m: 1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500+184 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -40, input_altitude_m: 1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500+239 },
    { aerodrome_elevation_m: 1800, ground_temperature_degC: -50, input_altitude_m: 1800 + 1500, assertion_corrected_altitude_m: 1800 + 1500+294 },
])('Comparing the results to the ICAO Doc 8168 Volume II, Seventh edition 2020, table III-3-4-App A1 ' + 
    'for 0 ft aerodrome elevation, aerodrome_temperature_degC: $aerodrome_temperature_degC input_altitude_m: $input_altitude_m ' + 
    'assertion_corrected_altitude_m: $assertion_corrected_altitude_m',
    ({aerodrome_elevation_m, ground_temperature_degC, input_altitude_m, assertion_corrected_altitude_m}) => {
        const aerodrome_elevation = unit(aerodrome_elevation_m, "m");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_m, "m");

        const corrected_altitude = altitudeCorrectionESDU(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
        const corrected_altitude_ft = corrected_altitude.toNumber("m");

        expect(abs(corrected_altitude_ft - assertion_corrected_altitude_m)).toBeLessThan(1.0);
    })
