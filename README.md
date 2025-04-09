# Honkai: Star Rail Eidolon Value Analysis

This project analyzes the value proposition of different Eidolon levels for characters in Honkai: Star Rail, helping players make informed decisions about whether to pull for additional copies of characters.

## Overview

Eidolons in Honkai: Star Rail can significantly boost a character's combat performance, but they require substantial investment in terms of Star Rail Special Passes or Jade. This tool helps quantify the value of each Eidolon level by analyzing:

1. Raw damage increase per Eidolon
2. Damage efficiency per pull
3. Marginal value of each Eidolon upgrade

References:

- <https://www.prydwen.gg/>

## How It Works

### Data Structure

The analysis uses character data stored in JSON files under the `data/` directory. Each character file contains damage percentages for different Eidolon levels under various target scenarios (single-target, 3-target, 5-target).

Example data format:

```json
{
    "1-target": {
        "dmg-percent": {
            "E0": 100,
            "E1": 123,
            "E2": 169,
            ...
        }
    },
    "3-target": {
        "dmg-percent": {
            ...
        }
    }
}
```

### Calculation Methodology

1. **Average Damage Calculation**: For each Eidolon level, damage percentages are averaged across all target scenarios (1-target, 3-target, 5-target), with E0 normalized to 100%.

2. **Pull Estimation**: The system estimates an average of 108 pulls per copy, taking into account:
   - 50/50 chance to get the rate-up character
   - Guarantee system (guaranteed rate-up character after losing a 50/50)
   - Hard pity at 90 pulls

3. **Damage per Pull**: Calculated by dividing the damage percentage by the cumulative number of pulls required.

4. **Marginal Value**: Calculated as the additional damage gained per additional pull required when upgrading from one Eidolon level to the next.

## Generated Plots

This tool generates three different visualizations to help analyze Eidolon value:

1. **Average Damage by Eidolon**: Raw damage increase per Eidolon level
2. **Damage per Pull Efficiency**: Overall value proposition of pulls invested 
3. **Marginal Value of Each Eidolon**: Return on investment for each Eidolon upgrade

For detailed explanations of each plot with examples, see [VISUALS.md](docs/VISUALS.md).

## Usage

1. Place character data in the `data/` directory in the correct JSON format
2. Run the analysis:

```bash
make run
```

3. Generated plots will be saved to the `output/` directory
