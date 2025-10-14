# 1️. Using the official Python image
FROM python:3.11

# 2️ Install system dependencies (for OpenCV and others)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*
# 3 Setting the working directory
WORKDIR /app

# 4 Copy dependency files (to improve build cache efficiency)
COPY requirements.txt ./

# 5 Install dependencies (use --no-cache-dir to reduce image size)
RUN pip install --no-cache-dir -r requirements.txt

# 6 Copy all backend code to the container
COPY . .

# 7 Running the FastAPI server (using Uvicorn)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

