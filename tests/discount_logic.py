
def calculate_discount(age: int, experience: int) -> int:
    discount = 0 
    if age >= 25:
        discount += 5
        if experience >= 5:
            discount += 5

    return discount # this must be at the same indentation level as the if statement

def test_age_40_and_10_expreience():
    # age 40 and 10years experience → should be 20%
    assert calculate_discount(40, 10) == 20

def test_invalid_negative_age():
    # negative age should return an error
    with pytest.raises(ValueError):
        calculate_discount(-5,3)