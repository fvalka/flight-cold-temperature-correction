<script context="module" lang="ts">
    import { add, multinomial, multiply, subset, subtract, Unit, unit } from "mathjs";

    export function isaTemperatureForElevation(elevation_ft: Unit) {
        console.log("isaTemperatureForElevation %s", elevation_ft);

        const lapse_rate = unit(-0.0019812, "degC/ft");
        const sea_level_temperature: Unit = unit(15.0, "degC");

        const calculation_parameters = {
            T0: sea_level_temperature,
            L0: lapse_rate,
            h: elevation_ft
        };

        console.log("Calculating ISA Temperature for elevation using parmaters %s", JSON.stringify(calculation_parameters, null, 2));

        return add(sea_level_temperature, multiply(lapse_rate, elevation_ft));
    }

    export function isaDeviation(elevation_ft: Unit, temperature_degC: Unit) {
        console.log("Calculating ISA deviation for %s and %s", elevation_ft, temperature_degC);

        return subtract(temperature_degC, isaTemperatureForElevation(elevation_ft));
    }
</script>