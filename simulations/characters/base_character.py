class Character:
    def __init__(
        self,
        hp: float = 3000,
        atk: float = 2000,
        crit_rate: float = 0.5,
        crit_dmg: float = 1,
        ult_energy: float = 160,
    ):
        self.hp = hp
        self.atk = atk
        self.crit_rate = crit_rate
        self.crit_dmg = crit_dmg
        self.ult_energy = ult_energy
        
    
    def calculate_dmg(self, atk, multiplier) -> float:
        """
        Calculate damage based on attack and a multiplier.
        
        Args:
            atk (float): The attack value.
            multiplier (float): The damage multiplier.
            
        Returns:
            float: The calculated damage.
        """
        return atk * multiplier
    
    
    def calculate_break_dmg(self, base_break_dmg: float = 2000, break_effect: float = 1.0) -> float:
        """
        Calculate break damage or super break damage based on base break damage and break effect.
        
        Args:
            base_break_dmg (float): The base break damage.
            break_effect (float): The break effect multiplier.
            
        Returns:
            float: The calculated break damage.
        """
        return base_break_dmg * break_effect
    
