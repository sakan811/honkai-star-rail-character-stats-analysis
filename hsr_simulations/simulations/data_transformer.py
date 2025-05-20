import pandas as pd
from simulations.characters.base_character import Character


def output_df(character: Character) -> pd.DataFrame:
    data = character.output_data()

    return pd.DataFrame(data)
