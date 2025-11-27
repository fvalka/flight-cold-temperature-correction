<script lang="ts">
  import NumericalOutputLabel from '../lib/components/data-display/NumericalOutputLabel.svelte';

    import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
    import { Switch } from "@skeletonlabs/skeleton-svelte";
</script>

<h1 class="text-2xl font-bold p-2">
    Cold Temperature Altitude Correction
</h1>

<div class="w-full max-w-md p-4">

    <p>
        Please enter the elevation of the aerodrome and the temperature on the
        ground at the aerodrome.
    </p>

    <h2 class="text-xl font-semibold">Aerodrome</h2>
    <div class="w-full grid grid-cols-2 p-2 gap-2">
        <NumericalInputField label="Elevation" value="" unit="ft"></NumericalInputField>
        <NumericalInputField label="Ground Temperature" value="" unit="°C"></NumericalInputField>

        <label class="label col-span-2">
            <Switch>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>Advanced Options</Switch.Label>
                <Switch.HiddenInput />
            </Switch>
        </label>
    </div>

    <hr class="hr border-t-4 border-secondary-700" />

    <h2 class="text-xl font-semibold">Approach</h2>

    <h3 class="font-semibold w-full text-center mt-3">Altitudes</h3>
    <fieldset class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
        
        <NumericalInputField label="IAF" value="" unit="ft"></NumericalInputField>
        <NumericalOutputLabel label="Corrected IAF" value="" unit="ft"></NumericalOutputLabel>

        <NumericalInputField label="FAF / FDP" value="" unit="ft"></NumericalInputField>
        <NumericalOutputLabel label="Corrected FAF / FPD" value="" unit="ft"></NumericalOutputLabel>

        <NumericalInputField label="DA / MDA" value="" unit="ft"></NumericalInputField>
        <NumericalOutputLabel label="Corrected DA / MDA" value="" unit="ft"></NumericalOutputLabel>
    </fieldset>

    <h3 class="font-semibold w-full text-center mt-3">Glide Path</h3>
    <fieldset class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
        
        <NumericalInputField label="Flight Path Angle" value="" unit="°"></NumericalInputField>
        <NumericalOutputLabel label="Corrected Flight Path Angle" value="" unit="°"></NumericalOutputLabel>
    </fieldset>

    <hr class="hr border-t-1" />

    <h2 class="text-xl font-semibold">Go Around</h2>

    <hr class="hr border-t-1" />

    
    <h2 class="text-xl font-semibold">Additional Altitudes</h2>

    <hr class="hr border-t-1" />
</div>

<style lang="postcss">
    @reference "tailwindcss";
    :global(html) {
        background-color: theme(--color-gray-100);
    }
</style>
