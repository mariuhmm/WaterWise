FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/app/

# Install system packages first and clean up to optimize caching
RUN apt-get update \
&& apt-get install -y cron \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# Install Python packages separately
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy the Python script and the cron job file into the container
COPY fetchData.py .

EXPOSE 8081

# Cron job functionality
COPY waterwise-cron /etc/cron.d/waterwise-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/waterwise-cron \
&& crontab /etc/cron.d/waterwise-cron \
&& touch /var/log/cron.log

# Run the command on container startup
CMD ["sh", "-c", "python3 -u fetchData.py && cron && tail -f /var/log/cron.log"]
