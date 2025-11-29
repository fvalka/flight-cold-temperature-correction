<script context="module" lang="ts">
    import {
        compareNatural,
        parse,
        subtract,
        Unit,
        unit
    } from "mathjs";
    import { altitudeCorrectionESDU } from "../temperature-correction/esdu-temperature-correction.svelte";

    // rad is added in the end since the result of atan will be in radians but math.js drops the unit
    const equation_node = parse("atan( tan(gammaUncorrected) * hCorrected / hUncorrected ) rad");

    export function flightPathAngleCorrection(uncorrect_flight_path_angle: Unit, uncorrected_altitude_at_faf: Unit, 
        aerodrome_elevation: Unit, aerodrome_ground_temperature: Unit) {

        let corrected_altitiude_at_faf = altitudeCorrectionESDU(uncorrected_altitude_at_faf, aerodrome_elevation, aerodrome_ground_temperature);

        if (compareNatural(corrected_altitiude_at_faf, uncorrected_altitude_at_faf,) < 0) {
            throw new Error("The corrected altitude at the FAF/FDP needs to be at or above the uncorrected altitude. ");
        }

        let hCorrected = subtract(corrected_altitiude_at_faf, aerodrome_elevation);
        let hUncorrected = subtract(uncorrected_altitude_at_faf, aerodrome_elevation);

        const calculation_parameters = {
            gammaUncorrected: uncorrect_flight_path_angle.to("deg"),
            hCorrected: hCorrected.to("ft"),
            hUncorrected: hUncorrected.to("ft")
        };

        console.debug( "Performing the flight path angle correction using the equation: %s", equation_node.toString());
        console.debug(equation_node.toTex());
        console.debug("Using the calculation parameters:");
        console.debug(calculation_parameters);

        const corrected_flight_path_angle = equation_node.evaluate(calculation_parameters);

        console.debug("The corrected flight path angle is: %s", corrected_flight_path_angle.to("deg"))

        return corrected_flight_path_angle;
    }
</script>
