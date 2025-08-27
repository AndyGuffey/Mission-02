
def calculate_discount(age: int, experience: int) -> int:
    discount = 0 
    if age >= 25:
        discount += 5
        if experience >= 5:
            discount += 5

    return discount # this must be at the same indentation level as the if statement
