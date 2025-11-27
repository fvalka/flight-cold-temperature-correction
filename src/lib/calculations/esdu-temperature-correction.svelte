<script context="module" lang="ts">
  import { isaDeviation } from "$lib/calculations/isa-atmosphere.svelte";
  const lapse_rate_degC_per_ft: number = -0.0019812;
  const sea_level_temperature_degC: number = 15.0;
  const sea_level_temperature_degK: number = 288.15;

  export function altitudeCorrection(input_altitude_ft: number, aerodrome_elevation_ft: number, aerodrome_ground_temperature_degC: number) {
      if (input_altitude_ft < aerodrome_elevation_ft) {
        console.error("The altitude to be corrected needs to be above the aerodrome elevation!");
        return NaN;
      }

      if (input_altitude_ft > 36000) {
        console.error("This equation is only valid for altitudes up to the ISA tropopause!")
        return NaN;
      }
      
      let input_height_ft = input_altitude_ft - aerodrome_elevation_ft;

      let aerodrome_isa_deviation_degC = isaDeviation(aerodrome_elevation_ft, aerodrome_ground_temperature_degC);

      let height_correction_ft = (-aerodrome_isa_deviation_degC / lapse_rate_degC_per_ft) * 
        Math.log(1 + (lapse_rate_degC_per_ft * input_height_ft)/(sea_level_temperature_degK + lapse_rate_degC_per_ft * aerodrome_elevation_ft));

      return Math.ceil(input_altitude_ft + height_correction_ft);

    }
</script>