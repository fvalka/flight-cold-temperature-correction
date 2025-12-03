<script context="module" lang="ts">
  import { isaDeviation } from "$lib/calculations/atmosphere/isa-atmosphere.svelte";
  import { subtract, parse, Unit, unit, add, compare, compareNatural, divide, abs, multiply } from 'mathjs'

  // Iteration method options
  const iteration_maxIter = 50;
  const iteration_tolerance = unit(0.000001, "ft");

  // Constants and equations used in the calculation
  const lapse_rate = unit(-0.0019812,"K/ft");
  const sea_level_temperature = unit(288.15, "K");
  const correction_function = parse("(-DeltaTstd / L0) * log(1 + (L0 * hPAirplane)/(T0 + L0 * hPAerodrome)) + hGAirplane - hPAirplane");
  const correction_function_derivative = parse("-(L0 * hPAerodrome + T0 + L0 * hPAirplane + DeltaTstd)/(L0 * hPAerodrome + T0 + L0 * hPAirplane)");

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

      console.debug("Calculating altitude correction using iterative method.");

      const calculation_parameters = {
          DeltaTstd: aerodrome_isa_deviation_degC,
          L0: lapse_rate,
          T0: sea_level_temperature,
          hGAirplane: input_height,
          hPAerodrome: aerodrome_elevation
        };

      let initial_value = input_height;
      const hPAirplane = findIterativeSolution(calculation_parameters, initial_value);

      // start an additional iterative solution search from 0 ft to cross check for convergence 
      const hPAirplaneSecondCheck = findIterativeSolution(calculation_parameters, unit(0, "ft"));
      if(compareNatural(abs(subtract(hPAirplane, hPAirplaneSecondCheck)), multiply(iteration_tolerance, 100)) > 0) {
        throw new Error("The convergence crosscheck has failed between the iterative solution starting from the input height and from 0ft!");
      }

      console.debug("Resulting correction to be added to the elevation: hPAirplane %s", hPAirplane);
      return add(aerodrome_elevation, hPAirplane);
    }

    function findIterativeSolution(calculation_parameters: any, hPAirplane: Unit ): Unit {
      console.debug("Starting to search for iterative solution");
      console.debug("Equation to solve: 0 == %s", correction_function.toString());
      console.debug("Derivative of the right hand side equation to solve: %s", correction_function_derivative.toString());

      let hPAirplaneNew: Unit;

      let iter = 0;
      while(iter++ < iteration_maxIter) {
        calculation_parameters["hPAirplane"] = hPAirplane;

        console.debug("Performing the next step in the ESDU based iterative altitude temperature " + 
          "correction calculation");
        console.debug("Using the calculation parameters:");
        console.debug(calculation_parameters);
        
        const value = correction_function.evaluate(calculation_parameters).to("ft");
        const derivative_value = correction_function_derivative.evaluate(calculation_parameters);

        if (abs(derivative_value) < Number.EPSILON) {
          throw new Error("Iterative height correction solution didn't converge since the derivative value was too small!");
        }

        hPAirplaneNew = <Unit>subtract(hPAirplane, divide(value, derivative_value));
        console.debug("New function value: %s new derivative value: %s and new guess: %s",value, derivative_value, hPAirplaneNew);

        // Check if we reached the convergance level
        const stepDelta = abs(subtract(hPAirplane, hPAirplaneNew));
        if (compareNatural(stepDelta, iteration_tolerance) < 0) {
          console.debug("Found new iterative solution in %d iterations, difference: %s", iter, stepDelta);
          return hPAirplaneNew;
        }

        hPAirplane = hPAirplaneNew;
      }

      throw new Error("Iterative solution search for altitude correction didn't converge!");
    }
</script> 