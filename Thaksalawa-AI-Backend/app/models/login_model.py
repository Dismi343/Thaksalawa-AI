
from dataclasses import Field
from pydantic import BaseModel
from pydantic import StringConstraints
from typing import Annotated

class LoginRequest(BaseModel):
    username: Annotated[str, StringConstraints(min_length=3, max_length=50)]
    password: Annotated[str, StringConstraints(min_length=6)]