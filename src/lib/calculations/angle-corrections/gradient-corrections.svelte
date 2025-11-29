<script context="module" lang="ts">
    import { atan, corr, multiply, tan, unit, type Unit } from "mathjs";
    import { flightPathAngleCorrection } from "./flight-path-angle-corrections.svelte";


    /**
     * Corrects a climb gradient for the cold temperature altimeter error. 
     * 
     * First converts the gradient to a flight path angle and then applies the FPA correction and converts
     * it back to a gradient. 
     * 
     * @param uncorrected_gradient Uncorrected climb gradient in V/V for example 3.5% will be: 0.035
     * @param uncorrected_altitude_toc Uncorrected altitude to climb to
     * @param aerodrome_elevation Elevation of the aerodrome
     * @param aerodrome_ground_temperature Temperature at the aerodrome on the ground
     */
    export function climbGradientCorrection(uncorrected_gradient: number, uncorrected_altitude_toc: Unit, 
        aerodrome_elevation: Unit, aerodrome_ground_temperature: Unit) {
            console.debug("Calculating temperature correction for climb gradient %s " + 
            "and top of climb altitude %s aerodrome elevation: %s and aerodrome_ground_temperature: %s",
                uncorrected_gradient, uncorrected_altitude_toc, aerodrome_elevation, aerodrome_ground_temperature
            );

            const uncorrected_flight_path_angle = unit(atan(uncorrected_gradient), "rad");
            console.debug("Input climb gradient %s has been converted to uncorrected angle %s", uncorrected_gradient, uncorrected_flight_path_angle);

            const corrected_flight_path_angle = flightPathAngleCorrection(uncorrected_flight_path_angle, 
                uncorrected_altitude_toc, aerodrome_elevation, aerodrome_ground_temperature);
            console.debug("Corrected flight path angle: %s", corrected_flight_path_angle);

            const corrected_gradient = tan(corrected_flight_path_angle);
            console.debug("Corrected climb gradient: %s", corrected_gradient);

            return corrected_gradient;
        }
</script>