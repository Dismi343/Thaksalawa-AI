# Thaksalawa Project - Using NGINX as API Gateway

This project uses **NGINX** as a reverse proxy to route requests to multiple Python FastAPI microservices:

- **User Service** (`http://127.0.0.1:8000`)

- **AI Service** (`http://127.0.0.1:8001`)
 

NGINX handles the routing so you can access services via a single port:

- User service → `http://localhost:8080/user/`  
- AI service → `http://localhost:8080/ai/`

---
## Use this in nginx.conf file
```
worker_processes  1;

events {
    worker_connections 1024;
}

http {

    ## Logging (optional)
    access_log logs/access.log;
    error_log logs/error.log;

    ## Upstream definitions (backend routing targets)
    upstream user_service {
        server 127.0.0.1:8000;
    }
    upstream ai_service {
        server 127.0.0.1:8001;
    }

    ## Reverse Proxy Server
    server {
        listen 8080;
        server_name localhost;

        ## API route
        location /user/ {
            proxy_pass http://user_service/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        ## Another service example
        location /ai/ {
            proxy_pass http://ai_service/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}

```

## ⚡ Setup Instructions (Windows 11)



### 1. Download NGINX

1. Go to the official website: [https://nginx.org/en/download.html](https://nginx.org/en/download.html)  
2. Download the **Stable version for Windows**.  
3. Extract it to a folder, for example:  

