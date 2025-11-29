<script lang="ts">
    import NumericalOutputLabel from "./data-display/NumericalOutputLabel.svelte";
    import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
    import { isValidNumber } from "$lib/util/input-checker.svelte";
    import { ceil, round, unit } from "mathjs";
    import { climbGradientCorrection } from "$lib/calculations/angle-corrections/gradient-corrections.svelte";

    let {
        label,
        aerodrome_elevation_ft,
        aerodrome_ground_temperature_degC,
        altitude_climb_to_ft,
        isInputValid
    } = $props();

    let inpunt_climb_gradient: number | null = $state(null);

    let is_altitude_climb_to_valid = $derived.by(() => isValidNumber(altitude_climb_to_ft) && altitude_climb_to_ft >= aerodrome_elevation_ft)

    function climbGradientCorrectedFormatted(input_climb_gradient: any) {
        if (
            !isValidNumber(inpunt_climb_gradient) ||
            !isValidNumber(altitude_climb_to_ft) ||
            !isValidNumber(aerodrome_elevation_ft) ||
            !isValidNumber(aerodrome_ground_temperature_degC) ||
            inpunt_climb_gradient === null
        ) {
            return undefined;
        }

        if (altitude_climb_to_ft < aerodrome_elevation_ft) {
            return undefined;
        }

        const corrected_climb_gradient = climbGradientCorrection(inpunt_climb_gradient/100, 
            unit(altitude_climb_to_ft, "ft"), unit(aerodrome_elevation_ft, "ft"), unit(aerodrome_ground_temperature_degC, "degC"));


        return ceil(corrected_climb_gradient * 100, 1).toFixed(1);
    }
</script>

<NumericalInputField {label} bind:value={inpunt_climb_gradient} unit="%" step="0.1"
></NumericalInputField>
<NumericalOutputLabel
  label={label == "" ? "" : "Corrected " + label}
  value={climbGradientCorrectedFormatted(inpunt_climb_gradient)}
  unit="%"
  isInputValid={ isInputValid }
></NumericalOutputLabel>

{#if isValidNumber(inpunt_climb_gradient) && !is_altitude_climb_to_valid} 
<div
    class="text-error-700-300 border-2 border-error-300-700 col-span-2 rounded p-1"
>
    Please enter a valid go around altitude!
</div>
{/if}
