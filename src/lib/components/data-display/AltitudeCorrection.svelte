<script lang="ts">
  import NumericalOutputLabel from './NumericalOutputLabel.svelte';
  import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
  import { Switch } from "@skeletonlabs/skeleton-svelte";
  import { isaDeviation } from "$lib/calculations/isa-atmosphere.svelte";
  import { altitudeCorrection } from "$lib/calculations/esdu-temperature-correction.svelte"


  let {label, aerodrome_elevation_ft, aerodrome_ground_temperature_degC} = $props();

  let input_altitude_ft = $state(NaN);

  function altitudeCorrectionFormatted(input_altitude_ft: number) {
    return altitudeCorrection(input_altitude_ft, aerodrome_elevation_ft, aerodrome_ground_temperature_degC);
  }
  
</script>

<NumericalInputField label={ label } bind:value={input_altitude_ft} unit="ft"></NumericalInputField>
<NumericalOutputLabel label={ "Corrected " + label } value={altitudeCorrectionFormatted(input_altitude_ft)} unit="ft"></NumericalOutputLabel>

<style lang="postcss">
    @reference "tailwindcss";
    :global(html) {
        background-color: theme(--color-gray-100);
    }
</style>

