import pytest
from discount_logic import calculate_discount

def test_base_discount():
    # Driver age 30, experience 6 → should give 10%
    assert calculate_discount(30, 6) == 10

# failed on purpose as an example of a test case as calculate discount is not implemented yet

# || ----- API 4. Convert "Driver's Age and Experience" to a "Discount Rate" ----- ||
# This API takes 2 parameters as input in JSON format that includes - the "age" (e.g. 30) and "experience" (e.g. 6 years of driving experience). The output is a JSON format with the suggested discount rate for the insurance policy, such as "10%".
# Here are the example specifications and business rules of conversion:
# INPUT	OUTPUT	ERROR OUTPUT
# { age: 30; experience: 6 }	{ discount_rate: 10 }	{ error: "there is an error" }
 
# || ------ BUSINESS RULES ------ ||
# The discount rate starts at 0%. 
# Drivers aged 25 or older get a 5% discount,and those with 5 or more years of driving experience get another 5%. 
# If the driver is 40 or older, they receive an extra 5%, and if they have 10 or more years of experience, they get another 5%. 
# The maximum possible discount is 20%. 
# If the input values are invalid, such as negative numbers or non-numeric values, an error message is returned.


def test_age_25_only():
    # Age 25, no experience → should be 5%
    assert calculate_discount(25, 0) == 5

def calculate_discount(age:int, experience: int) -> int:
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
    return min(discount,20)