<script lang="ts">
  import AerodromeInput from '../lib/components/AerodromeInput.svelte';

  import AltitudeCorrection from '../lib/components/AltitudeCorrection.svelte';

  import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
  import NumericalOutputLabel from '../lib/components/data-display/NumericalOutputLabel.svelte';
    import ResetAllInputs from '$lib/components/ResetAllInputs.svelte';
    import FlightPathAngleCorrection from '$lib/components/FlightPathAngleCorrection.svelte';


  let aerodrome_elevation_ft: number | null = $state(null);
  let aerodrome_ground_temperature_degC: number | null = $state(null);
  let isAerodromeInputValid = $state(false);

  let faf_altitude_ft: number | null = $state(null);

</script>
<div class="lg:flex lg:flex-row lg:min-h-screen lg:justify-center lg:place-items-start bg-gradient-to-br from-surface-600 to-secondary-800 dark:from-surface-900 dark:to-surface-950">
    <div class="bg-white dark:bg-surface-950 w-full grid grid-cols-4 max-w-md lg:max-w-7xl gap-4 p-4 lg:border-gray-200 lg:shadow-2xl 2xl:ml-5 2xl:mt-5">
        <div class="col-span-4 border-b-1 border-b-surface-100-900">
            <h1 class="text-2xl font-bold mb-3 text-primary-800-200">
                Cold Temperature Altitude Correction
            </h1>

            <p class="text-surface-800-200">
                Calculates the cold temperature correction for altitudes in the approach based on the 
                elevation of the aerodrome and temperature measured on the ground at the aerodrome. 
            </p>

            <p class="border-2 border-warning-300-700 text-warning-900-100 p-2 font-semibold mt-2 mb-2">
                Use at your own risk! Not for operational use!
            </p>
        </div>

        <AerodromeInput 
            bind:aerodrome_elevation_ft={aerodrome_elevation_ft} 
            bind:aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
            bind:isInputValid={isAerodromeInputValid}
            >
        </AerodromeInput>
        

        <div class="col-span-4 lg:col-span-1 border-b-4 lg:border-r-2 lg:border-b-0 border-secondary-700-300 pb-2"> 
            <h2 class="w-full text-center text-xl font-semibold text-primary-800-200">Approach</h2>

            <h3 class="font-semibold w-full text-center mt-3 text-secondary-700-300">Altitudes</h3>
            <div class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
                
                <AltitudeCorrection 
                    label="IAF" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>

                <AltitudeCorrection 
                    bind:input_altitude_ft={faf_altitude_ft}
                    label="FAF / FDP" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>

                <AltitudeCorrection 
                    label="DA / MDA" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>
            </div>

            <h3 class="font-semibold w-full text-center mt-3 text-secondary-700-300">Glide Path</h3>
            <div class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
                <FlightPathAngleCorrection
                    label="DA / MDA" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    faf_altitude_ft={faf_altitude_ft}
                    isInputValid={isAerodromeInputValid}>
                </FlightPathAngleCorrection>
            </div>
        </div>

        <div class="col-span-4 lg:col-span-1 border-b-4 lg:border-r-2 lg:border-b-0 border-secondary-700-300 pb-2"> 
            <h2 class="w-full text-center text-xl font-semibold text-primary-800-200">Go Around</h2>
            
            <h3 class="font-semibold w-full text-center mt-3 text-secondary-700-300">Altitudes</h3>
            <div class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
                <AltitudeCorrection 
                    label="Altitude" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>
            </div>

            <h3 class="font-semibold w-full text-center mt-3 text-secondary-700-300">Climb</h3>
            <div class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
                
                <NumericalInputField label="Climb Gradient" value="" unit="%"></NumericalInputField>
                <NumericalOutputLabel label="Corrected Climb Gradient" value="" unit="%"></NumericalOutputLabel>
            </div>
        </div>


        <div class="col-span-4 lg:col-span-1"> 
            <h2 class="w-full text-center text-xl font-semibold text-primary-800-200">Additional Altitudes</h2>

            <div class="w-full max-w-sm p-2 gap-2 grid grid-cols-2">
                
                <AltitudeCorrection 
                    label="Input" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>

                <AltitudeCorrection 
                    label="" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>

                <AltitudeCorrection 
                    label="" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>

                <AltitudeCorrection 
                    label="" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>

                <AltitudeCorrection 
                    label="" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>

                <AltitudeCorrection 
                    label="" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>

                <AltitudeCorrection 
                    label="" 
                    aerodrome_elevation_ft={aerodrome_elevation_ft} 
                    aerodrome_ground_temperature_degC={aerodrome_ground_temperature_degC}
                    isInputValid={isAerodromeInputValid}>
                </AltitudeCorrection>
            </div>

        </div>
        
        <div class="col-span-4 lg:col-span-2">
            <ResetAllInputs></ResetAllInputs>
        </div>
        
        <div class="col-span-4 lg:col-span-2 lg:text-right">
            <p>     
                <a class="btn preset-tonal-primary bg-surface-300-700 text-surface-50 mt-2" 
                href="https://github.com/fvalka/flight-cold-temperature-correction" target="_blank">
                    Documentation & Source code
                </a> 
                <a class="btn preset-tonal-primary bg-surface-300-700 text-surface-50 mt-2" 
                    href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection">Privacy policy</a>
                <a class="btn preset-tonal-primary bg-surface-300-700 text-surface-50 mt-2" 
                href="https://aviatorsbot.com/imprint.html">Imprint</a>
            </p>
        </div>
        
    </div>
</div>

<style lang="postcss">
    @reference "tailwindcss";
    :global(html) {
        background-color: theme(--color-gray-100);
    }
</style>
