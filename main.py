from simulations.characters.ruan_mei import RuanMei
from simulations.simulation import run_simulations
from calculator.plot_eidolon_value import (
    convert_simulation_data_to_avg_dmg,
    calculate_pulls_per_eidolon,
    calculate_dmg_per_pull,
    calculate_marginal_value,
    plot_eidolon_value,
)


def main():
    # Initialize character
    ruan_mei = RuanMei()
    
    # Run simulations
    simulation_data = run_simulations(ruan_mei)
    
    # Print raw simulation results
    print("Raw simulation results:")
    for key, value in simulation_data.items():
        print(f"{key}: {value:.2f}")
    
    print("\nGenerating plots...")
    
    # Convert simulation data to normalized damage percentages
    avg_dmg = convert_simulation_data_to_avg_dmg(simulation_data)
    
    # Calculate the pull efficiency metrics
    pulls_per_eidolon = calculate_pulls_per_eidolon()
    dmg_per_pull = calculate_dmg_per_pull(avg_dmg, pulls_per_eidolon)
    marginal_value = calculate_marginal_value(avg_dmg, pulls_per_eidolon)
    
    # Generate plots
    plot_eidolon_value(avg_dmg, dmg_per_pull, marginal_value, character_name="RuanMei")
    
    print("Analysis complete!")


if __name__ == "__main__":
    main()
