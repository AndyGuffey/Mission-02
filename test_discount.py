import pytest
from fastapi.testclient import TestClient
from main import app
from fastapi.exceptions import RequestValidationError
#------------------------------------------------------------------------------------
# || ----- API 4. Convert "Driver's Age and Experience" to a "Discount Rate" ----- ||
# -----------------------------------------------------------------------------------
# This API takes 2 parameters as input in JSON format that includes - the "age" (e.g. 30) and "experience" (e.g. 6 years of driving experience). The output is a JSON format with the suggested discount rate for the insurance policy, such as "10%".
# Here are the example specifications and business rules of conversion:
# INPUT	OUTPUT	ERROR OUTPUT
# { age: 30; experience: 6 }	{ discount_rate: 10 }	{ error: "there is an error" }
 
#  ---------------------------------
# || ------ BUSINESS RULES ------ ||
# ----------------------------------

# The discount rate starts at 0%. 
# Drivers aged 25 or older get a 5% discount,and those with 5 or more years of driving experience get another 5%. 
# If the driver is 40 or older, they receive an extra 5%, and if they have 10 or more years of experience, they get another 5%. 
# The maximum possible discount is 20%. 
# If the input values are invalid, such as negative numbers or non-numeric values, an error message is returned.

# ------------------------------------------
# ||--- UNIT TESTS FOR DISCOUNT LOGIC ----||
# ------------------------------------------

client = TestClient(app)

def test_base_discount():
# Driver age 30, experience 6 → should give 10%
    assert calculate_discount(30, 6) == 10

def test_age_25_only():
# Age 25, no experience → should be 5%
    assert calculate_discount(25, 0) == 5

def test_api_discount_30_6():
    response = client.post("/discount", json={"age": 30, "experience": 6})
    assert response.status_code==200 
    assert response.json() == {"discount_rate": 10}

def test_invalid_negative_age():
    # negative age should return an error
    with pytest.raises(ValueError):
        calculate_discount(-5,3)

def test_age_40_and_10_experience():
  # age 40 and 10years experience → should be 20% (max cap)
    assert calculate_discount(40, 10) == 20

def test_zero_discount_for_young_inexperienced_driver():
    """Test that drivers under 25 with less than 5 years experience get 0% discount"""
    # Driver age 20, experience 1 → should give 0%
    result= calculate_discount(age=20, experience=2)
    assert result == 0

def test_age_discount_only():
    """Test 5% discount for drivers 25+ with less than 5 years experience"""
    result = calculate_discount(age=25, experience=3)
    assert result == 5
    
def test_experience_discount_only():
    """Test 5% discount for drivers under 25 with 5+ years experience"""
    result = calculate_discount(age=20, experience=5)
    assert result == 5
    
    

def test_api_negative_age_returns_400():
    """Test API returns 400 for negative age"""
    response = client.post("/discount", json={"age": -5, "experience": 3})
    assert response.status_code == 400
    assert "Invalid input: negative values are not allowed" in response.json()["detail"]

def test_api_zero_discount():
    """Test API returns 0% discount for young inexperienced driver"""
    response = client.post("/discount", json={"age": 20, "experience": 2})
    assert response.status_code == 200
    assert response.json() == {"discount_rate": 0}

def test_maximum_discount_scenario():
    """Test maximum discount with all criteria met"""
    result = calculate_discount(age=45, experience=15)
    assert result == 20

def test_boundary_conditions():
    """Test exact boundary values"""
    assert calculate_discount(24, 4) == 0   # Just under thresholds
    assert calculate_discount(25, 5) == 10  # Exactly at thresholds
    assert calculate_discount(39, 9) == 10  # Just under higher thresholds
    assert calculate_discount(40, 10) == 20 # At higher thresholds

def test_senior_with_little_experience():
    """Test 40+ age with minimal experience"""
    result = calculate_discount(age=42, experience=2)
    assert result == 10  # 5% for age 25+ + 5% for age 40+

def test_young_with_lots_experience():
    """Test young driver with lots of experience"""
    result = calculate_discount(age=22, experience=12)
    assert result == 10  # 5% for exp 5+ + 5% for exp 10+
    
def test_discount_cap_enforcement():
    """Test that discount never exceeds 20%"""
    assert calculate_discount(50, 25) == 20
    assert calculate_discount(60, 30) == 20

def test_negative_experience_error():
    """Test negative experience raises ValueError"""
    with pytest.raises(ValueError, match="Invalid input: negative values are not allowed"):
        calculate_discount(30, -1)

def test_both_negative_error():
    """Test both negative values raise ValueError"""
    with pytest.raises(ValueError, match="Invalid input: negative values are not allowed"):
        calculate_discount(-5, -2)
        
def test_api_experience_greater_than_age():
    """Test API handles experience greater than age"""
    response = client.post("/discount", json={"age": 30, "experience": 35})
    assert response.status_code == 400
    assert "Invalid input: experience cannot exceed age" in response.json()["detail"]
    
def test_api_non_numeric_input():
    """Test API returns 422 for non-numeric input"""
    response = client.post("/discount", json={"age": "thirty", "experience": "five"})
    assert response.status_code == 422
    assert "detail" in response.json()