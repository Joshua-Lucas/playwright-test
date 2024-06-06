# Use the official Ubuntu base image
FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    apt-transport-https \
    && rm -rf /var/lib/apt/lists/*

# Set up charm.sh repository
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://repo.charm.sh/apt/gpg.key | gpg --dearmor -o /etc/apt/keyrings/charm.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | tee /etc/apt/sources.list.d/charm.list

# Install vhs and ffmpeg
RUN apt-get update && apt-get install -y vhs ffmpeg

# Set the working directory inside the container
WORKDIR /root/app

# Copy the current directory contents into the "app" directory in the container
COPY . /root/app

# Set a default command to run when the container starts
CMD ["bash"]

