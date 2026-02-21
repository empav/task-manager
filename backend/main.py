import os
import uvicorn

from dotenv import load_dotenv

# Load environment variables from .env
_ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(_ENV_PATH)

# Import the FastAPI app
if __name__ == "__main__":
    uvicorn.run("app.api:app", host="0.0.0.0", port=8000, reload=True)
