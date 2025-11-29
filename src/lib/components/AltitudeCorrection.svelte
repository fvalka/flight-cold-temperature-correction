<script lang="ts">
  import { altitudeCorrectionESDU } from "$lib/calculations/temperature-correction/esdu-temperature-correction.svelte";
  import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
  import { unit } from "mathjs";
  import NumericalOutputLabel from "./data-display/NumericalOutputLabel.svelte";
  import { isValidNumber } from "$lib/util/input-checker.svelte";

  let {
    label,
    aerodrome_elevation_ft,
    aerodrome_ground_temperature_degC,
    isInputValid: is_output_enabled,
    input_altitude_ft = $bindable(undefined),
  } = $props();

  let inputErrors: string[] = $state([]);
  let is_input_valid = $state(false);

  function validateInput() {
        console.log("validating input!");
        inputErrors = [];

        // Short circuiting errors 
        if (!isValidNumber(input_altitude_ft)) {
          is_input_valid = false;
          return;
        }

        if (input_altitude_ft > 36000) {
            inputErrors.push("Please input a valid altitude of 36000ft or less!");
        }

        if (input_altitude_ft < -1000) {
            inputErrors.push("Please enter a valid altitude!")
        }

        is_input_valid = inputErrors.length == 0;

    }

  function altitudeCorrectionFormatted(input_altitude_ft: any) {
    if(!is_input_valid) {
      return undefined;
    }

    if (
      !isValidNumber(input_altitude_ft) ||
      !isValidNumber(aerodrome_elevation_ft) ||
      !isValidNumber(aerodrome_ground_temperature_degC)
    ) {
      return undefined;
    }

    if (input_altitude_ft < aerodrome_elevation_ft) {
      return undefined;
    }

    const result = Math.ceil(
      altitudeCorrectionESDU(
        unit(input_altitude_ft, "ft"),
        unit(aerodrome_elevation_ft, "ft"),
        unit(aerodrome_ground_temperature_degC, "degC"),
      ).toNumber("ft"),
    );

    return result;
  }
</script>

<NumericalInputField {label} 
  bind:value={input_altitude_ft} 
  unit="ft"
  oninput={ validateInput }
></NumericalInputField>
<NumericalOutputLabel
  label={label == "" ? "" : "Corrected " + label}
  value={altitudeCorrectionFormatted(input_altitude_ft)}
  unit="ft"
  isInputValid={ is_output_enabled && is_input_valid }
></NumericalOutputLabel>


{#each inputErrors as inputErrorMessage} 
    <div
        class="text-error-700-300 border-2 border-error-300-700 col-span-2 rounded p-1"
    >
        { inputErrorMessage }
    </div>
{/each}


<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
