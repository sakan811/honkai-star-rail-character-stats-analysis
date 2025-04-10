from simulations.characters.ruan_mei import RuanMei
from simulations.simulation import run_simulations


def main():
    ruan_mei = RuanMei()

    data = run_simulations(ruan_mei)

    for key, value in data.items():
        print(f"{key}: {value:.2f}")


if __name__ == "__main__":
    main()
