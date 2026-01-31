FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
# gcc/libpq-dev for psycopg2 if needed (using binary in reqs but good practice)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
# Check structure: context should be 'backend' folder
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
# Assuming main.py will be created in Phase 4 (Next step) or similar
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
