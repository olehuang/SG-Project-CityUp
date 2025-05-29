# 1️⃣ Using the official Python image
FROM python:3.11

# 2️⃣ Setting the working directory
WORKDIR /app

# 3️⃣ Copy dependency files (to improve build cache efficiency)
COPY requirements.txt ./

# 4️⃣ Install dependencies (use --no-cache-dir to reduce image size)
RUN pip install --no-cache-dir -r requirements.txt

# 5️⃣Copy all backend code to the container
COPY . .

# 6️⃣ Running the FastAPI server (using Uvicorn)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

