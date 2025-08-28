from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from discount_logic import calculate_discount

app = FastAPI()

# Input schema
class DriverInfo(BaseModel):
    age: int
    experience: int

# Output schema
class DiscountResponse(BaseModel):
    discount_rate: int

@app.post("/discount", response_model=DiscountResponse)
def get_discount(driver: DriverInfo):
    try:
        discount = calculate_discount(driver.age, driver.experience)
        return {"discount_rate": discount}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
