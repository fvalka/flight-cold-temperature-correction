<script context="module" lang="ts">
    import { abs, add, compareNatural, divide, subtract, unit, type Unit } from "mathjs";
    import { altitudeCorrectionESDU } from "./esdu-temperature-correction.svelte";
    import { simplifiedAltitudeCorrection } from "./simplified-temperature-correction.svelte";

    export function altitudeCorrectionCrossChecked(input_altitude: Unit, aerodrome_elevation: Unit, aerodrome_ground_temperature: Unit) {
        if (compareNatural(input_altitude, aerodrome_elevation) < 0) {
            throw new Error("The altitude to be corrected needs to be above the aerodrome elevation!");
        }

        if (compareNatural(input_altitude, unit(36000, "ft")) > 0 ) {
            throw new Error("This equation is only valid for altitudes up to the ISA tropopause!");
        } 

        let input_height = subtract(input_altitude, aerodrome_elevation);

        let altitude_correction_esdu_method = altitudeCorrectionESDU(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);
        let altitude_correction_simplified_method = simplifiedAltitudeCorrection(input_altitude, aerodrome_elevation, aerodrome_ground_temperature);

        
        const relative_difference =  divide(abs(subtract(altitude_correction_esdu_method, altitude_correction_simplified_method)), altitude_correction_esdu_method);

        // The simplified equation is valid up to aerodromes elevation of 10000ft and heights of 5000ft above the aerodrome
        // therefore in those cases a tighter tolerance can be used
        let relative_tolerance = 0.05;
        if(aerodrome_elevation.toNumber("ft") <= 10000 && input_height.toNumber("ft") <= 5000) {
            relative_tolerance = 0.01;
        }

        if(<number>relative_difference >= relative_tolerance) {
            throw new Error("Calculation error: The cross check between the ESDU method and simplified method failed because the relative tolerance was excceded");

        }

        if(compareNatural(add(altitude_correction_esdu_method, unit(10, "ft")), altitude_correction_simplified_method) < 0) {
            throw new Error("Calculation error: The altitude correction calculated with the ESDU method is below the simplified method. Allowing for 10ft of tolerance.");
        }

        return altitude_correction_esdu_method;
    }
</script>