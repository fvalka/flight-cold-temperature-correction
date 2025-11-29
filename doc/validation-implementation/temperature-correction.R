# Unit Conversion Functions
m_to_ft <- function(input) { input*3.28084 }
ft_to_m <- function(input) { input/3.28084 }

# ISA atmosphere, default values are for the first layer
# Source: Computational Modelling and Simulation of Aircraft and the Environment, Volume 1: Platform Kinematics and Synthetic Environment, Diston et. al.
ISA_profile <- function(H, Hn = 0, Tn = 288.15, Ln = -6.5e-3, pn = 1.013250e5, g0divdedByRLn = -5.255880) {
  T_ISA <- function(H) {
    Tn + Ln * (H - Hn) 
  }
  
  p_ISA <- function(T) {
    (T/Tn)**-g0divdedByRLn * pn
  }
  
  data.frame(
    Height=H,
    Temperature=T_ISA(H),
    Pressure=p_ISA(T_ISA(H))
  )
}


# Temperature correction functions

# ESDU from ICAO Pans OPS and Eurocontrol Cold Temperature Correction
temp_correction_esdu <- function(heightToCorrect, heightAerodrome, isaDeviation) {
  ISALapseRate = -0.0019812 # °C/ft
  ISASeaLevelTemperature = 288.15 # °C
  
  (-isaDeviation/ISALapseRate) * log(1 + ((ISALapseRate*heightToCorrect) / (ISASeaLevelTemperature + ISALapseRate * heightAerodrome)))
}

# Alternate correction equation from the book:
# Computational Modelling and Simulation of Aircraft and the Environment, Volume 1: Platform Kinematics and Synthetic Environment, Diston et. al.
temp_correction_wiley_computational_modelling <- function(heightToCorrect, heightAerodrome, isaDeviation) {
  # convert to metric from imperial units
  heightToCorrect_m = ft_to_m(heightToCorrect)
  heightAerodrome_m = ft_to_m(heightAerodrome)
  
  Rconst = 287.05287
  g0const = 9.80665
  
  p_at_airport = ISA_profile(heightAerodrome_m, Tn=288.15)$Pressure
  p_at_altitude = ISA_profile(heightAerodrome_m + heightToCorrect_m, Tn=288.15)$Pressure
  
  correction_m = isaDeviation * Rconst/g0const * log(p_at_altitude/p_at_airport)
  
  # Convert back to imperial
  m_to_ft(correction_m)
  
}

# Combines the two methods and converts the inputs to ones which are equal to the calculator
create_example_problem <- function(aerodrome_elevation, ground_temperature, input_altitude) {
  ISA_for_airport_elevation <- T_ISA(ft_to_m(aerodrome_elevation)) - 273.15
  ISA_deviation <- ground_temperature - ISA_for_airport_elevation
  
  height_above_aerodrome <- input_altitude - aerodrome_elevation
  
  data.frame(
    ISA_deviation = ISA_deviation,
    esdu_result = input_altitude + temp_correction_esdu(height_above_aerodrome, aerodrome_elevation, ISA_deviation),
    wiley_computational_modelling = input_altitude+ temp_correction_wiley_computational_modelling(height_above_aerodrome, aerodrome_elevation, ISA_deviation)
  )
}
