# Honkai: Star Rail Eidolon Value Analysis

This project analyzes the value proposition of different Eidolon levels for characters in Honkai: Star Rail, helping players make informed decisions about whether to pull for additional copies of characters.

## Overview

Eidolons in Honkai: Star Rail can significantly boost a character's combat performance, but they require substantial investment in terms of Star Rail Special Passes or Jade. This tool helps quantify the value of each Eidolon level by analyzing:

1. Raw damage increase per Eidolon
2. Damage efficiency per pull
3. Marginal value of each Eidolon upgrade

Data is based on:

- <https://www.prydwen.gg/>
- <https://starrailstation.com/en>

## Generated Plots

This tool generates three different visualizations to help analyze Eidolon value:

1. **Average Damage by Eidolon**: Raw damage increase per Eidolon level
2. **Damage per Pull Efficiency**: Overall value proposition of pulls invested
3. **Marginal Value of Each Eidolon**: Return on investment for each Eidolon upgrade

For detailed explanations of each plot with examples, see [VISUALS.md](docs/VISUALS.md).

## Usage

1. Run the analysis:

    ```bash
    make run
    ```

2. Generated plots will be saved to the `output/` directory
