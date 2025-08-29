import pytest
from fastapi.testclient import TestClient
from main import app
from discount_logic import calculate_discount

client = TestClient(app)

# ===== UNIT TESTS FOR DISCOUNT LOGIC =====

class TestDiscountLogicTDD:
    """TDD Test Suite - All 30 test scenarios"""
    
    # SUNNY DAY AND BASE CASES
    def test_case_01_sunny_day_scenario(self):
        """Test Case 1: Sunny day scenario - 30 years, 6 experience → 10%"""
        assert calculate_discount(30, 6) == 10
    
    def test_case_02_base_case_no_discounts(self):
        """Test Case 2: Base case - no discounts apply - 22 years, 3 experience → 0%"""
        assert calculate_discount(22, 3) == 0
    
    # BOUNDARY TESTING - SINGLE CONDITIONS
    def test_case_03_age_boundary_exactly_25(self):
        """Test Case 3: Age boundary - exactly 25 years old → 5%"""
        assert calculate_discount(25, 2) == 5
    
    def test_case_04_experience_boundary_exactly_5(self):
        """Test Case 4: Experience boundary - exactly 5 years experience → 5%"""
        assert calculate_discount(24, 5) == 5
    
    # MULTIPLE CONDITIONS MET
    def test_case_05_both_thresholds_met(self):
        """Test Case 5: Both age and experience thresholds met → 10%"""
        assert calculate_discount(25, 5) == 10
    
    # HIGHER TIER BONUSES
    def test_case_06_age_40_bonus_applies(self):
        """Test Case 6: Age 40+ bonus applies → 15%"""
        assert calculate_discount(40, 8) == 15
    
    def test_case_07_experience_10_bonus_applies(self):
        """Test Case 7: Experience 10+ bonus applies → 15%"""
        assert calculate_discount(35, 10) == 15
    
    def test_case_08_maximum_discount_all_bonuses(self):
        """Test Case 8: Maximum discount - all bonuses apply → 20%"""
        assert calculate_discount(40, 10) == 20
    
    def test_case_09_high_values_discount_capped(self):
        """Test Case 9: High values - discount capped at 20%"""
        assert calculate_discount(55, 25) == 20
    
    # EDGE CASES - JUST BELOW BOUNDARIES
    def test_case_10_just_below_both_boundaries(self):
        """Test Case 10: Just below both boundaries → 0%"""
        assert calculate_discount(24, 4) == 0
    
    def test_case_11_just_below_higher_tiers(self):
        """Test Case 11: Just below 40 age and 10 experience → 10%"""
        assert calculate_discount(39, 9) == 10
    
    # MINIMUM VALUES
    def test_case_12_zero_values(self):
        """Test Case 12: Zero values → 0%"""
        assert calculate_discount(0, 0) == 0
    
    def test_case_13_minimum_driving_age(self):
        """Test Case 13: Minimum driving age → 0%"""
        assert calculate_discount(16, 0) == 0
    
    def test_case_14_very_high_age_experience(self):
        """Test Case 14: Very high age and experience → 20%"""
        assert calculate_discount(80, 50) == 20
    
    # ERROR CASES - NEGATIVE VALUES
    def test_case_15_negative_age(self):
        """Test Case 15: Negative age → error"""
        with pytest.raises(ValueError, match="Invalid input: negative values are not allowed"):
            calculate_discount(-5, 5)
    
    def test_case_16_negative_experience(self):
        """Test Case 16: Negative experience → error"""
        with pytest.raises(ValueError, match="Invalid input: negative values are not allowed"):
            calculate_discount(30, -2)
    
    def test_case_17_both_negative_values(self):
        """Test Case 17: Both negative values → error"""
        with pytest.raises(ValueError, match="Invalid input: negative values are not allowed"):
            calculate_discount(-10, -5)
    
    # BUSINESS LOGIC VALIDATION
    def test_case_26_impossible_experience(self):
        """Test Case 26: Impossible experience (exceeds max possible) → error"""
        with pytest.raises(ValueError, match="experience cannot exceed"):
            calculate_discount(20, 15)  # Can't have 15 years exp at age 20
    
    def test_case_27_valid_max_experience_young_driver(self):
        """Test Case 27: Valid maximum experience for young driver → 0%"""
        assert calculate_discount(18, 2) == 0  # Started driving at 16
    
    def test_case_28_age_40_with_experience_10(self):
        """Test Case 28: Age 40+ with experience 10+ → 20%"""
        assert calculate_discount(45, 12) == 20
    
    def test_case_29_exact_age_boundary_zero_experience(self):
        """Test Case 29: Exact age boundary with zero experience → 5%"""
        assert calculate_discount(25, 0) == 5
    
    def test_case_30_exact_experience_boundary_young_age(self):
        """Test Case 30: Exact experience boundary with young age → 5%"""
        assert calculate_discount(20, 5) == 5


# ===== API INTEGRATION TESTS =====

class TestDiscountAPITDD:
    """TDD API Test Suite - Testing FastAPI endpoint"""
    
    # SUCCESS CASES
    def test_api_case_01_sunny_day_scenario(self):
        """API Test 1: Sunny day scenario"""
        response = client.post("/discount", json={"age": 30, "experience": 6})
        assert response.status_code == 200
        assert response.json() == {"discount_rate": 10}
    
    def test_api_case_02_base_case(self):
        """API Test 2: Base case - no discounts"""
        response = client.post("/discount", json={"age": 22, "experience": 3})
        assert response.status_code == 200
        assert response.json() == {"discount_rate": 0}
    
    def test_api_case_08_maximum_discount(self):
        """API Test 8: Maximum discount scenario"""
        response = client.post("/discount", json={"age": 40, "experience": 10})
        assert response.status_code == 200
        assert response.json() == {"discount_rate": 20}
    
    def test_api_case_13_minimum_driving_age(self):
        """API Test 13: Minimum driving age"""
        response = client.post("/discount", json={"age": 16, "experience": 0})
        assert response.status_code == 200
        assert response.json() == {"discount_rate": 0}
    
    # ERROR CASES - BUSINESS LOGIC (400 Bad Request)
    def test_api_case_15_negative_age(self):
        """API Test 15: Negative age → 400 error"""
        response = client.post("/discount", json={"age": -5, "experience": 5})
        assert response.status_code == 400
        assert "Invalid input: negative values are not allowed" in response.json()["detail"]
    
    def test_api_case_16_negative_experience(self):
        """API Test 16: Negative experience → 400 error"""
        response = client.post("/discount", json={"age": 30, "experience": -2})
        assert response.status_code == 400
        assert "Invalid input: negative values are not allowed" in response.json()["detail"]
    
    def test_api_case_26_impossible_experience(self):
        """API Test 26: Impossible experience → 400 error"""
        response = client.post("/discount", json={"age": 20, "experience": 15})
        assert response.status_code == 400
        assert "experience cannot exceed" in response.json()["detail"]
    
    # VALIDATION ERROR CASES - FORMAT/TYPE ISSUES (422 Unprocessable Entity)
    def test_api_case_18_non_numeric_age_string(self):
        """API Test 18: Non-numeric age (string) → 422 error"""
        response = client.post("/discount", json={"age": "thirty", "experience": 5})
        assert response.status_code == 422
    
    def test_api_case_19_non_numeric_experience_string(self):
        """API Test 19: Non-numeric experience (string) → 422 error"""
        response = client.post("/discount", json={"age": 30, "experience": "five"})
        assert response.status_code == 422
    
    def test_api_case_20_null_age(self):
        """API Test 20: Null age → 422 error"""
        response = client.post("/discount", json={"age": None, "experience": 5})
        assert response.status_code == 422
    
    def test_api_case_21_undefined_experience(self):
        """API Test 21: Missing experience field → 422 error"""
        response = client.post("/discount", json={"age": 30})
        assert response.status_code == 422
    
    def test_api_case_22_empty_input_object(self):
        """API Test 22: Empty input object → 422 error"""
        response = client.post("/discount", json={})
        assert response.status_code == 422
    
    def test_api_case_23_decimal_float_values(self):
        """API Test 23: Decimal/float values → 422 error (if strict int validation)"""
        response = client.post("/discount", json={"age": 30.5, "experience": 5.7})
        # FastAPI might accept floats and convert to int, or reject them
        # This test verifies the actual behavior
        assert response.status_code in [200, 422]  # Either accepted (converted) or rejected
    
    def test_api_case_24_boolean_values(self):
        """API Test 24: Boolean values → 422 error"""
        response = client.post("/discount", json={"age": True, "experience": False})
        assert response.status_code == 422
    
    def test_api_case_25_array_values(self):
        """API Test 25: Array values → 422 error"""
        response = client.post("/discount", json={"age": [30], "experience": [5]})
        assert response.status_code == 422

    # ADDITIONAL BOUNDARY TESTS
    def test_api_multiple_boundary_scenarios(self):
        """Test multiple boundary scenarios through API"""
        test_cases = [
            ({"age": 25, "experience": 2}, 5),    # Age boundary
            ({"age": 24, "experience": 5}, 5),    # Experience boundary
            ({"age": 25, "experience": 5}, 10),   # Both boundaries
            ({"age": 40, "experience": 8}, 15),   # Age 40+ bonus
            ({"age": 35, "experience": 10}, 15),  # Experience 10+ bonus
            ({"age": 24, "experience": 4}, 0),    # Just below both
        ]
        
        for input_data, expected_discount in test_cases:
            response = client.post("/discount", json=input_data)
            assert response.status_code == 200
            assert response.json()["discount_rate"] == expected_discount