
def calculate_discount(age: int, experience: int) -> int:
    """
    Calculate insurance discount rate based on driver's age and experience.
    
    Business Rules:
    - Base discount: 0%
    - Age 25+: +5%
    - Experience 5+: +5% 
    - Age 40+: +5% (additional)
    - Experience 10+: +5% (additional)
    - Maximum discount: 20%
    
    Args:
        age (int): Driver's age in years
        experience (int): Years of driving experience
        
    Returns:
        int: Discount rate as percentage (0-20)
        
    Raises:
        ValueError: If age or experience is negative
    """

    if age < 0 or experience <0:
        raise ValueError("Invalid input: negative values are not allowed ")
    
    if experience > age:
        raise ValueError("Invalid input: experience cannot exceed age")
    
    discount = 0 

    # #   age-based  and exerienced-based discounts
    if age >= 25:
        discount += 5
    if experience >= 5:
            discount += 5
    if age >= 40:
        discount += 5
    if experience >= 10:
            discount += 5

    # #cap out at 20% - maximum discount
    return min(discount, 20)