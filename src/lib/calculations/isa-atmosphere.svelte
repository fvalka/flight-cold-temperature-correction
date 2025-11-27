<script context="module" lang="ts">
    export function isaTemperatureForElevation(elevation_ft: number) {
        const lapse_rate_degC_per_ft: number = -0.0019812;
        const sea_level_temperature_degC: number = 15.0;

        return sea_level_temperature_degC + lapse_rate_degC_per_ft * elevation_ft;
    }

    export function isaDeviation(elevation_ft: number, temperature_degC: number) {
        return temperature_degC - isaTemperatureForElevation(elevation_ft);
    }
</script>