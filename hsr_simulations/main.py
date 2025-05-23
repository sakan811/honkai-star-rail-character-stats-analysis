from simulations.characters.remembrance.hyacine import Hyacine
from simulations.data_transformer import output_df
from simulations.characters.base_character import Character
from simulations.logger_config import get_default_logger
from pathlib import Path


logger = get_default_logger()


def main() -> None:
    # Initialize characters
    character_list: list[Character] = [Hyacine()]

    # Get the workspace root directory (parent of the hsr_simulations directory)
    # This assumes the script is in hsr_simulations/main.py
    current_file = Path(__file__).resolve()
    workspace_root = current_file.parent.parent  # Go up two levels from hsr_simulations/main.py
    
    # Create the base directory path relative to workspace root
    base_dir = workspace_root / "visual_dashboard" / "public"
    base_dir.mkdir(parents=True, exist_ok=True)

    for character in character_list:
        # Get character name from class name
        character_name = character.__class__.__name__.lower()

        # Create character-specific directory
        character_dir = base_dir / character_name
        character_dir.mkdir(parents=True, exist_ok=True)

        # Get dataframe and save to CSV
        df = output_df(character)

        # Create the CSV file path
        csv_path = character_dir / f"{character_name}_data.csv"

        # Save the dataframe to CSV
        df.to_csv(csv_path, index=False)

        logger.info(f"Saved {character_name} data to {csv_path}")


if __name__ == "__main__":
    main()