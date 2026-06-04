import sys
import os

from fastapi import FastAPI
from routers import itemRouter
from routers import uomRouter
from routers import stateRouter
from routers import traderRouter
from routers import customerRouter
from routers import invoiceRouter
from routers import statusRouter
from routers import authRouter

from fastapi.middleware.cors import CORSMiddleware
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

app = FastAPI(
    title="Debtors Accounting API",
    description="Backend API for Debtors Accounting System",
    version="1.0.0"
)


app.include_router(authRouter.router)
app.include_router(itemRouter.router)
app.include_router(uomRouter.router)
app.include_router(stateRouter.router)
app.include_router(traderRouter.router)
app.include_router(customerRouter.router)
app.include_router(invoiceRouter.router)
app.include_router(statusRouter.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,#cookies and login session allowe
    allow_methods=["*"],#All http method
    allow_headers=["*"],#All autherization allow
)

@app.get("/")
def home():
    return {"message": "Server Running "}