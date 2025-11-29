<script lang="ts">
    import NumericalOutputLabel from "./data-display/NumericalOutputLabel.svelte";
    import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
    import { isValidNumber } from "$lib/util/input-checker.svelte";
    import { flightPathAngleCorrection } from "$lib/calculations/angle-corrections/flight-path-angle-correction.svelte";
    import { round, unit } from "mathjs";

    let {
        label,
        aerodrome_elevation_ft,
        aerodrome_ground_temperature_degC,
        faf_altitude_ft,
        isInputValid
    } = $props();

    let input_flight_path_angle_deg: number | null = $state(null);

    function flightPathAngleCorrectedFormatted(input_flight_path_angle: any) {
        if (
            !isValidNumber(input_flight_path_angle_deg) ||
            !isValidNumber(faf_altitude_ft) ||
            !isValidNumber(aerodrome_elevation_ft) ||
            !isValidNumber(aerodrome_ground_temperature_degC)
        ) {
            return undefined;
        }

        if (faf_altitude_ft < aerodrome_elevation_ft) {
            return undefined;
        }

        const corrected_flight_path_angle = flightPathAngleCorrection(unit(input_flight_path_angle, "deg"), unit(faf_altitude_ft, "ft"), 
            unit(aerodrome_elevation_ft, "ft"), unit(aerodrome_ground_temperature_degC, "degC"));


        return round(corrected_flight_path_angle.toNumber("deg"), 1);
    }
</script>

<NumericalInputField {label} bind:value={input_flight_path_angle_deg} unit="°"
></NumericalInputField>
<NumericalOutputLabel
  label={label == "" ? "" : "Corrected " + label}
  value={flightPathAngleCorrectedFormatted(input_flight_path_angle_deg)}
  unit="°"
  isInputValid={ isInputValid }
></NumericalOutputLabel>
