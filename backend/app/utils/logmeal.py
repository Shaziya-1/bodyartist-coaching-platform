import os
import requests

class LogMeal:
    def __init__(self):
        self.token = os.getenv("LOG_MEAL_TOKEN")
        self.base_url = "https://api.logmeal.com/v2"

    def detectMeal(self, image_file_path: str):
        """
        Uploads an image file to LogMeal and returns the segmentation/recognition response 
        containing the imageId and the list of detected dishes.
        """
        url = f"{self.base_url}/image/segmentation/complete"
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        with open(image_file_path, "rb") as f:
            files = {"image": f}
            response = requests.post(url, headers=headers, files=files)
            
        response.raise_for_status()
        return response.json()

    def confirmDish(self, image_id: int, dish_id: int, food_item_position: int = 1):
        """
        Confirms the dish name / ID returned from recognition.
        """
        url = f"{self.base_url}/image/confirm/dish"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        payload = {
            "imageId": image_id,
            "confirmedClass": [dish_id],
            "source": ["logmeal"],
            "food_item_position": [food_item_position]
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()

    def confirmQuantity(self, image_id: int, quantity_grams: float, food_item_position: int = 1):
        """
        Confirms the quantity (serving size) consumed by the user in grams.
        """
        url = f"{self.base_url}/nutrition/confirm/quantity"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        payload = {
            "imageId": image_id,
            "quantity": {str(food_item_position): quantity_grams}
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()

    def getNutritionalInfo(self, image_id: int):
        """
        Retrieves the macronutrient and micronutrient information based on the confirmed imageId.
        """
        url = f"{self.base_url}/nutrition/recipe/nutritionalInfo"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        payload = {
            "imageId": image_id
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()