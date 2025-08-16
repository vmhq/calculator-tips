# Use the official Nginx image from Docker Hub
FROM nginx:alpine

# Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static website content
COPY src/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80
