import cloudinary
import cloudinary.uploader
import os 
from dotenv import load_dotenv

load_dotenv("backend/.env")

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

cloudinary.config( 
  cloud_name = CLOUDINARY_CLOUD_NAME, 
  api_key = CLOUDINARY_API_KEY, 
  api_secret = CLOUDINARY_API_SECRET
)

def test_upload():

    print("Cloudinary Connection Started")
    if CLOUDINARY_CLOUD_NAME is None or CLOUDINARY_API_KEY is None or CLOUDINARY_API_SECRET is None:
        print("Cloudinary credentials not found")
        return

    print("Cloudinary Connection Established")

    try:
        cloudinary.uploader.upload("https://imgs.search.brave.com/v4vT5A3fT4CIZR8EwLKTIuOlOm12n82t1sHG4VClCuk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM2/MTU0NDI0OC9waG90/by9leGNpdGVkLWNh/dC1sb29raW5nLWxv/b2tpbmctdXAuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPVlJ/Wk1mNFcwZ1pwUE1a/NEtYWjVFVW9sOFRO/T1A4N2FUb0tvckU5/aTNIb1U9", 
        asset_folder = "pets", 
        public_id = "my_cat",
        overwrite = True, 
        #   notification_url = "https://mysite.example.com/notify_endpoint", 
        resource_type = "image")
        print("Cloudinary Connection Established")
    except Exception as e:
        print(e)

if __name__ == "__main__":
    test_upload()