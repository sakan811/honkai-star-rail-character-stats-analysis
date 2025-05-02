import os
import csv
import tempfile
from simulations.data_transformer import export_metric_to_csv


def test_export_metric_to_csv_creates_csv_and_content():
    metric_data = {"E0": 100.0, "E1": 120.0, "E2": 140.0}
    character_name = "TestChar"
    metric_name = "avg_dmg"
    with tempfile.TemporaryDirectory() as tmpdir:
        export_metric_to_csv(metric_data, character_name, metric_name, out_dir=tmpdir)
        out_dir = os.path.join(tmpdir, character_name)
        out_path = os.path.join(out_dir, f"{character_name}_{metric_name}.csv")
        assert os.path.exists(out_path)
        with open(out_path, newline="") as f:
            reader = csv.reader(f)
            rows = list(reader)
        assert rows[0] == ["Character", "Eidolon", metric_name]
        assert rows[1] == [character_name, "E0", "100.0"]
        assert rows[2] == [character_name, "E1", "120.0"]
        assert rows[3] == [character_name, "E2", "140.0"]


def test_export_metric_to_csv_handles_empty_metric_data():
    character_name = "TestChar"
    metric_name = "avg_dmg"
    with tempfile.TemporaryDirectory() as tmpdir:
        export_metric_to_csv({}, character_name, metric_name, out_dir=tmpdir)
        out_dir = os.path.join(tmpdir, character_name)
        out_path = os.path.join(out_dir, f"{character_name}_{metric_name}.csv")
        assert os.path.exists(out_path)
        with open(out_path, newline="") as f:
            reader = csv.reader(f)
            rows = list(reader)
        assert rows == [["Character", "Eidolon", metric_name]]


def test_export_metric_to_csv_non_str_keys_and_values():
    metric_data = {0: 1, 1: 2.5, 2: "3.5"}
    character_name = "TestChar"
    metric_name = "test_metric"
    with tempfile.TemporaryDirectory() as tmpdir:
        export_metric_to_csv(metric_data, character_name, metric_name, out_dir=tmpdir)
        out_dir = os.path.join(tmpdir, character_name)
        out_path = os.path.join(out_dir, f"{character_name}_{metric_name}.csv")
        assert os.path.exists(out_path)
        with open(out_path, newline="") as f:
            reader = csv.reader(f)
            rows = list(reader)
        assert rows[0] == ["Character", "Eidolon", metric_name]
        assert rows[1] == [character_name, "0", "1"]
        assert rows[2] == [character_name, "1", "2.5"]
        assert rows[3] == [character_name, "2", "3.5"]
