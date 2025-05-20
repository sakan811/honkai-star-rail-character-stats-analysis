from simulations.characters.remembrance.hyacine import Hyacine
from simulations.data_transformer import output_df
from simulations.characters.base_character import Character
from simulations.logger_config import get_default_logger
import os


logger = get_default_logger()


def main() -> None:
    # Initialize characters
    character_list: list[Character] = [Hyacine()]
    
    # Create the base directory if it doesn't exist
    base_dir = "visual_dashboard/public"
    os.makedirs(base_dir, exist_ok=True)
    
    for character in character_list:
        # Get character name from class name
        character_name = character.__class__.__name__.lower()
        
        # Create character-specific directory
        character_dir = os.path.join(base_dir, character_name)
        os.makedirs(character_dir, exist_ok=True)
        
        # Get dataframe and save to CSV
        df = output_df(character)
        
        # Create the CSV file path
        csv_path = os.path.join(character_dir, f"{character_name}_data.csv")
        
        # Save the dataframe to CSV
        df.to_csv(csv_path, index=False)
        
        logger.info(f"Saved {character_name} data to {csv_path}")


if __name__ == "__main__":
    main()