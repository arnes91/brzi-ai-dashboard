
from pydantic import BaseModel, Field
from typing import List, Literal, Dict, Any, Optional

class Step(BaseModel):
    tool: str
    args: Dict[str, Any] = Field(default_factory=dict)

class SequentialBlueprint(BaseModel):
    type: Literal["sequential"] = "sequential"
    steps: List[Step]

class ParallelBlueprint(BaseModel):
    type: Literal["parallel"] = "parallel"
    branches: List[List[Step]]  # simple

class LoopBlueprint(BaseModel):
    type: Literal["loop"] = "loop"
    steps: List[Step]
    max_iterations: int = 3
    exit_condition: Optional[str] = None  # python expression evaluated against last result
