import json
from pathlib import Path
from typing import Dict, Any


class ValueCalculator:
    def __init__(self, data_path: str | Path):
        """
        Initialize the ValueCalculator with the path to JSON data file.

        Args:
            data_path: Path to the JSON data file
        """
        self.data_path = Path(data_path)
        self.data = self._load_data()

    def _load_data(self) -> Dict[str, Any]:
        """Load data from JSON file."""
        with open(self.data_path, "r") as f:
            return json.load(f)

    def calculate_average_dmg_by_eidolon(self) -> Dict[str, float]:
        """
        Calculate the average damage percentage for each eidolon across all target scenarios.

        Returns:
            Dictionary mapping eidolon levels to average damage percentages
        """
        result = {}
        target_scenarios = list(self.data.keys())
        eidolon_levels = self.data[target_scenarios[0]]["dmg-percent"].keys()

        for eidolon in eidolon_levels:
            total_dmg = 0
            count = 0

            for scenario in target_scenarios:
                dmg_percent = self.data[scenario]["dmg-percent"].get(eidolon)
                if dmg_percent is not None:
                    total_dmg += dmg_percent
                    count += 1

            result[eidolon] = total_dmg / count if count > 0 else 0

        return result

    def calculate_dmg_increase_per_eidolon(self) -> Dict[str, float]:
        """
        Calculate the damage increase percentage between consecutive eidolon levels.

        Returns:
            Dictionary mapping eidolon transitions (e.g., 'E0-E1') to damage increase percentages
        """
        avg_dmg = self.calculate_average_dmg_by_eidolon()
        eidolon_levels = list(avg_dmg.keys())
        result = {}

        for i in range(1, len(eidolon_levels)):
            prev_eidolon = eidolon_levels[i - 1]
            curr_eidolon = eidolon_levels[i]

            prev_dmg = avg_dmg[prev_eidolon]
            curr_dmg = avg_dmg[curr_eidolon]

            increase_percent = ((curr_dmg - prev_dmg) / prev_dmg) * 100
            result[f"{prev_eidolon}-{curr_eidolon}"] = increase_percent

        return result
