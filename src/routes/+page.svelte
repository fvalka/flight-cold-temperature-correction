<script lang="ts">
  import AltitudeCorrection from '../lib/components/data-display/AltitudeCorrection.svelte';

  import NumericalOutputLabel from '../lib/components/data-display/NumericalOutputLabel.svelte';
  import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
  import { Switch } from "@skeletonlabs/skeleton-svelte";
  import { isaDeviation } from "../lib/calculations/isa-atmosphere.svelte";


  let aerodrome_elevation_ft: number = $state(NaN);
  let aerodrome_ground_temperature_degC: number = $state(NaN);

</script>

<div class="w-full grid grid-cols-4 max-w-md lg:max-w-full gap-4 p-4">
    <div class="col-span-4 border-b-1 border-b-surface-100-900">
        <h1 class="text-2xl font-bold mb-3 text-primary-800-200">
            Cold Temperature Altitude Correction
        </h1>

        <p class="text-surface-700-300">
            Calculates the cold temperature correction for various altitudes based upon the 
            elevation of the aerodrome and temperature measured at the aerodrome on the ground. 
        </p>

        <p class="border-2 border-warning-300-700 text-warning-900-100 p-2 font-semibold mt-2 mb-2">
            Use at your own risk! Not for operational use!
        </p>
    </div>

    <div class="col-span-4 lg:col-span-1 border-b-4 lg:border-r-2 lg:border-b-0 border-secondary-700-300"> 
        <h2 class="w-full text-center text-xl font-semibold text-primary-800-200">Aerodrome</h2>
        <div class="w-full grid grid-cols-2 p-2 gap-2">
            <NumericalInputField label="Elevation" bind:value={aerodrome_elevation_ft} unit="ft"></NumericalInputField>
            <NumericalInputField label="Ground Temperature" bind:value={aerodrome_ground_temperature_degC} unit="°C"></NumericalInputField>

            <NumericalOutputLabel label="ISA Devation" value={Math.round(isaDeviation(aerodrome_elevation_ft, aerodrome_ground_temperature_degC))} unit="°C"></NumericalOutputLabel>

            {#if isaDeviation(aerodrome_elevation_ft, aerodrome_ground_temperature_degC) > 0}
            <div class="text-error-700-300 border-2 border-error-300-700 col-span-2">
                Calculations are only possible for aerodrome ground temperatures colder than ISA!
            </div>
            {/if}

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
    </div>
    

    <div class="col-span-4 lg:col-span-1 border-b-4 lg:border-r-2 lg:border-b-0 border-secondary-700-300"> 
        <h2 class="w-full text-center text-xl font-semibold text-primary-800-200">Approach</h2>

        <h3 class="font-semibold w-full text-center mt-3 text-secondary-700-300">Altitudes</h3>
        <div class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
            
            <AltitudeCorrection 
                label="IAF" 
                aerodrome_elevation_ft={aerodrome_elevation_ft} 
                aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}>
            </AltitudeCorrection>

            <NumericalInputField label="FAF / FDP" value="" unit="ft"></NumericalInputField>
            <NumericalOutputLabel label="Corrected FAF / FPD" value="" unit="ft"></NumericalOutputLabel>

            <NumericalInputField label="DA / MDA" value="" unit="ft"></NumericalInputField>
            <NumericalOutputLabel label="Corrected DA / MDA" value="" unit="ft"></NumericalOutputLabel>
        </div>

        <h3 class="font-semibold w-full text-center mt-3 text-secondary-700-300">Glide Path</h3>
        <div class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
            
            <NumericalInputField label="FPA" value="" unit="°"></NumericalInputField>
            <NumericalOutputLabel label="Corrected FPA" value="" unit="°"></NumericalOutputLabel>
        </div>
    </div>

    <div class="col-span-4 lg:col-span-1 border-b-4 lg:border-r-2 lg:border-b-0 border-secondary-700-300"> 
        <h2 class="w-full text-center text-xl font-semibold text-primary-800-200">Go Around</h2>
        
        <h3 class="font-semibold w-full text-center mt-3 text-secondary-700-300">Altitudes</h3>
        <div class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
            
            <NumericalInputField label="Altitude" value="" unit="ft"></NumericalInputField>
            <NumericalOutputLabel label="Corrected Altitude" value="" unit="ft"></NumericalOutputLabel>
        </div>

        <h3 class="font-semibold w-full text-center mt-3 text-secondary-700-300">Climb</h3>
        <div class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
            
            <NumericalInputField label="Climb Gradient" value="" unit="%"></NumericalInputField>
            <NumericalOutputLabel label="Corrected Climb Gradient" value="" unit="%"></NumericalOutputLabel>
        </div>
    </div>


    <div class="col-span-4 lg:col-span-1"> 
        <h2 class="w-full text-center text-xl font-semibold text-primary-800-200">Additional Altitudes</h2>
    </div>

    
    <div class="col-span-4">
        <p>            
            <a class="btn preset-tonal-primary bg-surface-300-700 text-surface-50" 
            href="https://github.com/fvalka/flight-cold-temperature-correction" target="_blank">
                Documentation & Source code
            </a> 
            <a class="btn preset-tonal-primary bg-surface-300-700 text-surface-50" 
                href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection">Privacy policy</a>
            <a class="btn preset-tonal-primary bg-surface-300-700 text-surface-50" 
            href="https://aviatorsbot.com/imprint.html">Imprint</a>
        </p>
    </div>
    
</div>

<style lang="postcss">
    @reference "tailwindcss";
    :global(html) {
        background-color: theme(--color-gray-100);
    }
</style>
