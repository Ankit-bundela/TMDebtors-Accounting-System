from fastapi import FastAPI

from routers import itemsRouter
from routers import stateRouter
from routers import uomRouters
from routers import customerRouters
from routers import traderRouters
from routers import invoiceRouter
from routers import dashboardRouters
from routers import authRouter 
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(authRouter.router)
app.include_router(dashboardRouters.router)
app.include_router(invoiceRouter.router)
app.include_router(itemsRouter.router)

app.include_router(customerRouters.router)

app.include_router(traderRouters.router)
#app.include_router(itemsRouter.router)
app.include_router(stateRouter.router)
app.include_router(uomRouters.router)
@app.get("/")
def homeView():
    return {"message": "App started"}