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
    isInputValid,
  } = $props();

  let input_altitude_ft = $state(undefined);

  function altitudeCorrectionFormatted(input_altitude_ft: any) {
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

<NumericalInputField {label} bind:value={input_altitude_ft} unit="ft"
></NumericalInputField>
<NumericalOutputLabel
  label={"Corrected " + label}
  value={altitudeCorrectionFormatted(input_altitude_ft)}
  unit="ft"
  isInputValid={ isInputValid }
></NumericalOutputLabel>

<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
