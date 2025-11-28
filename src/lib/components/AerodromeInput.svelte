<script lang="ts">
    import NumericalOutputLabel from "./data-display/NumericalOutputLabel.svelte";
    import NumericalInputField from "$lib/components/data-display/NumericalInputField.svelte";
    import { Switch } from "@skeletonlabs/skeleton-svelte";
    import { isaDeviation } from "../calculations/atmosphere/isa-atmosphere.svelte";
    import { unit } from "mathjs";
    import { isValidNumber } from "$lib/util/input-checker.svelte";

    let {
        aerodrome_elevation_ft = $bindable(),
        aerodrome_ground_temperature_degC = $bindable(),
        isInputValid = $bindable()
    } = $props();

    let inputErrors: string[] = $state([]);

    let showErrorElevationInput = $state(false);
    let showErrorGroundTemperatureInput = $state(false);
    let calculatedIsaDeviation = $derived(calculateIsaDeviationFormatted());

    /**
     * Validates the aerodrome inputs and updates the errors and
     * isInputValid state variables
     */
    function validateInput() {
        console.log("validating input!");
        inputErrors = [];

        // Early fail errors because the input is not even numeric, 
        // currently no error message is displayed for that
        if (
            !isValidNumber(aerodrome_elevation_ft) ||
            !isValidNumber(aerodrome_ground_temperature_degC)
        ) {
            isInputValid = false;
            return;
        }

        if (calculatedIsaDeviation === undefined) {
            isInputValid = false;
            return;
        }
        
        // Normal errors, all will be shown at once
        if (calculatedIsaDeviation > 0) {
            inputErrors.push("Calculations are only possible for ISA deviations smaller than 0. So temperatures colder than the standard atmosphere.");
        }

        if (aerodrome_elevation_ft > 36000) {
            inputErrors.push("The temperature correction calculation is only valid up to 36000 ft please enter a smaller input value!");
        }

        if (aerodrome_elevation_ft < -1000) {
            inputErrors.push("Please enter a valid aerodrome elevation!")
        }

        if (aerodrome_ground_temperature_degC > 60 || aerodrome_ground_temperature_degC < -100) {
            inputErrors.push("Please enter a valid aerodrome ground temperature!")
        }

        isInputValid = inputErrors.length == 0;

    }

    
    function calculateIsaDeviationFormatted() {
        console.log("Calculating is deviation");
        if (
            !isValidNumber(aerodrome_elevation_ft) ||
            !isValidNumber(aerodrome_ground_temperature_degC)
        ) {
            return NaN;
        }

        return Math.round(
            isaDeviation(
                unit(aerodrome_elevation_ft, "ft"),
                unit(aerodrome_ground_temperature_degC, "degC"),
            ).toNumber("degC"),
        );
    }

</script>

<div
    class="col-span-4 lg:col-span-1 border-b-4 lg:border-r-2 lg:border-b-0 border-secondary-700-300"
>
    <h2 class="w-full text-center text-xl font-semibold text-primary-800-200">
        Aerodrome
    </h2>
    <div class="w-full grid grid-cols-2 p-2 gap-2">
        <NumericalInputField
            label="Elevation"
            bind:value={ aerodrome_elevation_ft }
            unit="ft"
            oninput={ validateInput }
            showerror={ showErrorElevationInput }
        ></NumericalInputField>
        <NumericalInputField
            label="Ground Temperature"
            bind:value={ aerodrome_ground_temperature_degC }
            unit="°C"
            oninput={ validateInput }
            showerror={ showErrorGroundTemperatureInput }
        ></NumericalInputField>

        {#each inputErrors as inputErrorMessage} 
            <div
                class="text-error-700-300 border-2 border-error-300-700 col-span-2 rounded p-1"
            >
                { inputErrorMessage }
            </div>
        {/each}

        <NumericalOutputLabel
            label="ISA Devation"
            value={ calculatedIsaDeviation }
            unit="°C"
            isInputValid={ isInputValid }
        ></NumericalOutputLabel>

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

<style lang="postcss">
    @reference "tailwindcss";
    :global(html) {
        background-color: theme(--color-gray-100);
    }
</style>
