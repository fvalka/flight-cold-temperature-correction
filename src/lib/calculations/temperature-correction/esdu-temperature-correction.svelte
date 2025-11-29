<script context="module" lang="ts">
  import { isaDeviation } from "$lib/calculations/atmosphere/isa-atmosphere.svelte";
  import { subtract, parse, Unit, unit, add, compare, compareNatural } from 'mathjs'

  // Constants and equations used in the calculation
  const lapse_rate = unit(-0.0019812,"K/ft");
  const sea_level_temperature = unit(288.15, "K");
  const equation_node = parse("(-DeltaTstd / L0) * log(1 + (L0 * hPAirplane)/(T0 + L0 * hPAerodrome))");

  /**
   * Performs an altitude temperature correction calculation using the 
   * "Accurate corrections" Equation in ICAO Doc 8168 Volume III
   * 
   * See also:
   * https://github.com/fvalka/flight-cold-temperature-correction?tab=readme-ov-file#altitude-correction-equation-using-the-accurate-corrections-equation-in-icao-doc-8168-volume-iii
   * 
   * @param input_altitude Input altitude in a mathjs units object
   * @param aerodrome_elevation Elevation of the aerodrome 
   * @param aerodrome_ground_temperature Temperature on the ground at the aerodrome, measured at aerodrome_elevation
   */
  export function altitudeCorrectionESDU(input_altitude: Unit, aerodrome_elevation: Unit, aerodrome_ground_temperature: Unit) {
      if (compareNatural(input_altitude, aerodrome_elevation) < 0) {
        throw new Error("The altitude to be corrected needs to be above the aerodrome elevation!");
      }

      if (compareNatural(input_altitude, unit(36000, "ft")) > 0 ) {
        throw new Error("This equation is only valid for altitudes up to the ISA tropopause!");
      } 

      let input_height = subtract(input_altitude, aerodrome_elevation);
      let aerodrome_isa_deviation_degC = isaDeviation(aerodrome_elevation, aerodrome_ground_temperature);

      const calculation_parameters = {
        DeltaTstd: aerodrome_isa_deviation_degC,
        L0: lapse_rate,
        T0: sea_level_temperature,
        hPAirplane: input_height,
        hPAerodrome: aerodrome_elevation
      };

      console.debug("Performing the ESDU based altitude temperature correction calculation using the equation: %s", equation_node.toString());
      console.debug("Using the calculation parameters:");
      console.debug(calculation_parameters);
      
      const height_correction = equation_node.evaluate(calculation_parameters).to("ft");
      console.debug("Resulting height correction to be added to altitude: %s", height_correction.toString());

      return add(input_altitude, height_correction);
    }
</script>