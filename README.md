# Cold Temperature Altitude Correction Calculator

Calculates the cold temperature correction for altitudes measured using a barometric altimeter. The correction is based upon the elevation of the aerodrome and temperature measured at the aerodrome on the ground.
___ 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

THIS SOFTWARE IS NOT CERTIFIED OR APPROVED FOR ANY OPERATIONAL USE!
USE PURELY AT YOUR OWN RISK!
___

## Calculation Method

### Inputs

As inputs we use:
- the aerodrome elevation, $h_{Aerodrome}$, in ft.
- the temperature on the ground at the aerodrome, $T_{Aerodrome}$, in $°C$
- the altitude (above MSL) which we want to correct, $z_{Airplane}$, in $ft$

### ISA Deviation 

Using these inputs we first calculate the aerodrome ISA temperature deviation, $\Delta T_{std}$, in $°C$ using the following paramters of the standard atmosphere:
- the ISA standard lapse rate, $L_0$ of $-0.0019812 \frac{°C}{ft}$
- the sea level ISA standard temperature, $T_0$, of $15 °C$

```math
T_{ISA}(h_{Aerodrome}) = T_0 + L_0 h_{Aerodrome} 
```

```math
\Delta T_{std} = T_{Aerodrome} - T_{ISA}(h_{Aerodrome})
```


### Altitude Correction Equation using the "Accurate corrections" Equation in ICAO Doc 8168 Volume III

The Eurocontrol Guidelines and ICAO Doc 8168 cites this equations as Equation 24 of the Engineering Sciences Data Unit (ESDU) publication: Performance, Volume 2, Item Number 77022. 

The uncorrected height of the aircraft above the aerodrome is obtained by subtracting the aerodrome elevation from the uncorrected input altitude. 

where we then use the following physical quanitites in the calculation of the height correction $\Delta h_{correction}$ in $ft$:
- aerodrome ISA temperature deviation, $\Delta T_{std}$, in $°C$
- the ISA standard lapse rate, $L_0$ of $-0.0019812 \frac{°C}{ft}$
- the uncorrected height of the aircraft above the aerodrome elevation, $\Delta hP_{Airplane}$ in $ft$
- the sea level ISA standard temperature, $T_0$, of $288.15 K$

```math
\Delta h_{correction} = \frac{-\Delta T_{std}}{L_0} \ln \left( 1 + \frac{L_0 \Delta hP_{Airplane}}{T_0 + L_0 hP_{Aerodrome}} \right)
```

Using the [mathjs](https://mathjs.org/) evaluation parser we can compare the actual equation in the actual program code used to the equation described above:
```math
\left(\frac{- DeltaTstd}{ L0}\right)\cdot\ln\left(1+\frac{\left( L0\cdot hPAirplane\right)}{\left( T0+ L0\cdot hPAerodrome\right)}\right)
```

## Assumptions

- The ISA difference is negative, meaning only temperatures colder than ISA are allowed
- The temperature gradient of the atmosphere follows the ISA gradient of $-0.0019812 \frac{°C}{ft}$
- The calculations are for altitudes lower than the ISA tropopause of $36 000 ft$



## References
1. [EUROCONTROL Guidelines for Cold Temperature Corrections by ATS, 2014](https://www.eurocontrol.int/publication/eurocontrol-guidelines-cold-temperature-corrections-ats)
2. ICAO Doc 8168 Procedures for Air Navigation Services - Aircraft Operations - Volume III - Aircraft Operating Procedures, First Edition, 2018
