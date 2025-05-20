from hsr_simulations.simulations.characters.remembrance.hyacine import Hyacine
from hsr_simulations.simulations.data_transformer import output_df
from simulations.characters.base_character import Character
from simulations.logger_config import get_default_logger


logger = get_default_logger()


def main() -> None:
    # Initialize characters
    character_list: list[Character] = [Hyacine()]

    for character in character_list:
        output_df(character)


if __name__ == "__main__":
    main()
