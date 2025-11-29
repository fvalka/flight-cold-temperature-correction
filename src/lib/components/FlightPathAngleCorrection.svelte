<script lang="ts">
    import NumericalOutputLabel from "./data-display/NumericalOutputLabel.svelte";
    import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
    import { isValidNumber } from "$lib/util/input-checker.svelte";
    import { flightPathAngleCorrection } from "$lib/calculations/angle-corrections/flight-path-angle-corrections.svelte";
    import { round, unit } from "mathjs";

    let {
        label,
        aerodrome_elevation_ft,
        aerodrome_ground_temperature_degC,
        faf_altitude_ft,
        isInputValid: is_output_enabled
    } = $props();

    let input_flight_path_angle_deg: number | null = $state(null);
    
    let is_faf_altitude_valid = $derived.by(() => isValidNumber(faf_altitude_ft) && 
        faf_altitude_ft > aerodrome_elevation_ft &&
        faf_altitude_ft >= -1000 &&
        faf_altitude_ft <= 36000);

    let inputErrors: string[] = $state([]);
    let is_input_valid = $state(false);

    function validateInput() {
            console.log("validating input!");
            inputErrors = [];

            // Short circuiting errors 
            if (!isValidNumber(input_flight_path_angle_deg) ||
                input_flight_path_angle_deg === null) {
                is_input_valid = false;
                return;
            }

            if (Math.abs(input_flight_path_angle_deg) > 45) {
                inputErrors.push("Please enter a valid flight path angle!")
            }

            is_input_valid = inputErrors.length == 0;

        }

    function flightPathAngleCorrectedFormatted(input_flight_path_angle: any) {
        if(!is_input_valid) {
            return undefined
        }
        if (
            !isValidNumber(input_flight_path_angle_deg) ||
            !isValidNumber(faf_altitude_ft) ||
            !isValidNumber(aerodrome_elevation_ft) ||
            !isValidNumber(aerodrome_ground_temperature_degC)
        ) {
            return undefined;
        }

        if (faf_altitude_ft <= aerodrome_elevation_ft) {
            return undefined;
        }

        const corrected_flight_path_angle = flightPathAngleCorrection(unit(input_flight_path_angle, "deg"), unit(faf_altitude_ft, "ft"), 
            unit(aerodrome_elevation_ft, "ft"), unit(aerodrome_ground_temperature_degC, "degC"));


        return round(corrected_flight_path_angle.toNumber("deg"), 1).toFixed(1);
    }
</script>

<NumericalInputField 
    {label} 
    bind:value={input_flight_path_angle_deg} 
    unit="°" 
    step="0.1"
    oninput={validateInput}
></NumericalInputField>
<NumericalOutputLabel
  label={label == "" ? "" : "Corrected " + label}
  value={flightPathAngleCorrectedFormatted(input_flight_path_angle_deg)}
  unit="°"
  isInputValid={ is_output_enabled && is_input_valid }
></NumericalOutputLabel>

{#if isValidNumber(input_flight_path_angle_deg) && !is_faf_altitude_valid} 
<div
    class="text-error-700-300 border-2 border-error-300-700 col-span-2 rounded p-1"
>
    Please enter a valid FAF altitude above to calculate the FPA!
</div>
{/if}

{#each inputErrors as inputErrorMessage} 
    <div
        class="text-error-700-300 border-2 border-error-300-700 col-span-2 rounded p-1"
    >
        { inputErrorMessage }
    </div>
{/each}
