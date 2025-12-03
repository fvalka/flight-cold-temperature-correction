<script context="module" lang="ts">
    import { add, parse, subtract, unit, type Unit } from "mathjs";

    const isa_temperature_lapse_rate = unit("0.00198 K/ft");

    const equation_t0 = parse("tAerodrome + L0 * HAerodrome");
    const equation_height_correction = parse("H * ((15K - t0)/(273K + t0 - 0.5 * L0 * (H + HSS)))");

    export function simplifiedAltitudeCorrection (input_altitude: Unit, aerodrome_elevation: Unit, aerodrome_ground_temperature: Unit) {
        let input_height = subtract(input_altitude, aerodrome_elevation);

        const calculation_parameters_t0 = {
            tAerodrome: aerodrome_ground_temperature,
            HAerodrome: aerodrome_elevation,
            L0: isa_temperature_lapse_rate
        };
        const t0 = equation_t0.evaluate(calculation_parameters_t0);

        const calculation_parameters_height_correction = {
            H: input_height, 
            t0: t0,
            L0: isa_temperature_lapse_rate,
            HSS: aerodrome_elevation,
        };

        const height_correction = equation_height_correction.evaluate(calculation_parameters_height_correction);

        return add(input_altitude, height_correction);
    }
</script>