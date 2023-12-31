from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import routes

# Create app instance
app = FastAPI()

# define origins, these are the domains that can access the API
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:4100",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:8000",
    # 5173
    "http://localhost:5173",
    
    
    # Add more origins as needed
]
# Add CORS middleware, this will allow requests from the frontend app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# include the routes, these are the endpoints that the frontend app will call
app.include_router(routes.router)



if __name__ == "__main__":
    uvicorn.run(app)