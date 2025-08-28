
def calculate_discount(age: int, experience: int) -> int:
    if age < 0 or experience <0:
        raise ValueError("Invalid input: negative values are not allowed ")
    
    discount = 0 
      
    if age >= 25:
        discount += 5
    if experience >= 5:
            discount += 5
    if age >= 40:
        discount += 5
    if experience >= 10:
            discount += 5

    #cap out at 20% - maximum discount
    return min(discount, 20)