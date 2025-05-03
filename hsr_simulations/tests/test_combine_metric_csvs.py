import os
import csv
import tempfile
import pytest
from simulations.data_transformer import export_metric_to_csv, combine_metric_csvs


def create_sample_metric_csvs(tmpdir, metric_name, data_by_character):
    for character_name, metric_data in data_by_character.items():
        export_metric_to_csv(metric_data, character_name, metric_name, out_dir=tmpdir)


def test_combine_metric_csvs_combines_multiple_files():
    metric_name = "avg_dmg"
    data_by_character = {
        "CharA": {"E0": 100, "E1": 120},
        "CharB": {"E0": 90, "E1": 110},
    }
    with tempfile.TemporaryDirectory() as tmpdir:
        create_sample_metric_csvs(tmpdir, metric_name, data_by_character)
        # Combine
        combine_metric_csvs(metric_name, data_dir=tmpdir)
        combined_path = os.path.join(tmpdir, f"all_{metric_name}.csv")
        assert os.path.exists(combined_path)
        with open(combined_path, newline="") as f:
            reader = csv.reader(f)
            rows = list(reader)
        # Header
        assert rows[0] == ["Character", "Eidolon", metric_name]
        # All data rows present
        expected_rows = [
            ["CharA", "E0", "100"],
            ["CharA", "E1", "120"],
            ["CharB", "E0", "90"],
            ["CharB", "E1", "110"],
        ]
        for expected in expected_rows:
            assert expected in rows[1:]


def test_combine_metric_csvs_no_files():
    metric_name = "nonexistent_metric"
    with tempfile.TemporaryDirectory() as tmpdir:
        with pytest.raises(
            ValueError, match=f"No CSV files found for metric: {metric_name}"
        ):
            combine_metric_csvs(metric_name, data_dir=tmpdir)


def test_combine_metric_csvs_custom_out_path():
    metric_name = "avg_dmg"
    data_by_character = {"CharA": {"E0": 100}}
    with tempfile.TemporaryDirectory() as tmpdir:
        create_sample_metric_csvs(tmpdir, metric_name, data_by_character)
        custom_out = os.path.join(tmpdir, "custom_combined.csv")
        combine_metric_csvs(metric_name, data_dir=tmpdir, out_path=custom_out)
        assert os.path.exists(custom_out)
        with open(custom_out, newline="") as f:
            reader = csv.reader(f)
            rows = list(reader)
        assert rows[0] == ["Character", "Eidolon", metric_name]
        assert rows[1] == ["CharA", "E0", "100"]


def test_combine_metric_csvs_handles_empty_files():
    metric_name = "avg_dmg"
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create an empty subdir (no CSVs)
        os.makedirs(os.path.join(tmpdir, "CharA"), exist_ok=True)
        with pytest.raises(ValueError):
            combine_metric_csvs(metric_name, data_dir=tmpdir)
