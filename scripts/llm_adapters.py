
# Provider-agnostic adapter stubs. Implement your own provider here.
# Example usage from a blueprint runner (omitted for brevity).

from typing import Dict, Any

class LLMResponse:
    def __init__(self, text: str, raw: Dict[str, Any] | None = None):
        self.text = text
        self.raw = raw or {}

def call_openai(prompt: str) -> LLMResponse:
    import os
    import openai
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    rsp = client.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}])
    return LLMResponse(text=rsp.choices[0].message.content, raw=rsp.model_dump())

def call_google(prompt: str) -> LLMResponse:
    # placeholder; implement with google.generativeai if desired
    return LLMResponse(text="[google provider stub] " + prompt[:100])

def call_oss(prompt: str) -> LLMResponse:
    # Use a local small model via transformers if desired
    return LLMResponse(text="[oss stub] " + prompt[:100])
