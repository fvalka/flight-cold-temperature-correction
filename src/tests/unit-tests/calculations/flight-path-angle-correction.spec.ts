import { flightPathAngleCorrection } from '$lib/calculations/angle-corrections/flight-path-angle-corrections.svelte';
import { unit } from 'mathjs';
import { expect, test } from 'vitest';


test.each([
    { uncorrected_flight_path_angle: 3, aerodrome_elevation_ft: 200, ground_temperature_degC: -40, input_altitude_ft: 5000, assertion_corrected_flight_path_angle: 3.71942 },
    { uncorrected_flight_path_angle: 3, aerodrome_elevation_ft: 1000, ground_temperature_degC: -67, input_altitude_ft: 5000, assertion_corrected_flight_path_angle: 4.19334 },
    { uncorrected_flight_path_angle: 4.5, aerodrome_elevation_ft: 1000, ground_temperature_degC: -67, input_altitude_ft: 5000, assertion_corrected_flight_path_angle: 6.28317 }, 
    { uncorrected_flight_path_angle: 3, aerodrome_elevation_ft: 1000, ground_temperature_degC: 13.0188, input_altitude_ft: 5000, assertion_corrected_flight_path_angle: 3 }, 
    { uncorrected_flight_path_angle: -3, aerodrome_elevation_ft: 200, ground_temperature_degC: -40, input_altitude_ft: 5000, assertion_corrected_flight_path_angle: -3.71942 },
])('correcting flight path angle: $uncorrected_flight_path_angle using aerodrome elevation: $aerodrome_elevation_ft ft, ' + 
    'ground temperature: $ground_temperature_degC degC and altitude: $input_altitude_ft ft',
    ({ uncorrected_flight_path_angle, aerodrome_elevation_ft, ground_temperature_degC, input_altitude_ft, assertion_corrected_flight_path_angle }) => {

        const aerodrome_elevation = unit(aerodrome_elevation_ft, "ft");
        const aerodrome_ground_temperature = unit(ground_temperature_degC, "degC");
        const input_altitude = unit(input_altitude_ft, "ft");
        const input_flight_path_angle = unit(uncorrected_flight_path_angle, "deg");

        
        const corrected_angle = flightPathAngleCorrection(input_flight_path_angle, input_altitude, aerodrome_elevation, aerodrome_ground_temperature)
        const corrected_angle_deg = corrected_angle.toNumber("deg");

        expect(corrected_angle_deg).toBeCloseTo(assertion_corrected_flight_path_angle, 2);
    })
