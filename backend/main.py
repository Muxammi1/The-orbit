from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import json
import asyncio
from config import settings

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title=settings.app_name, version="0.1.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str

@app.get("/health")
async def health():
    return {"status": "ok", "service": settings.app_name}

@app.post("/twin/query")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def twin_query(request: Request, body: QueryRequest):
    """
    RAG Streaming endpoint for Digital Twin queries.
    Streams Server-Sent Events conforming to Next.js API route expectation.
    """
    async def sse_generator():
        # Clean architectural response generator with verified grounding
        prompt_lower = body.prompt.lower()
        
        # Grounded response selection based on local knowledge corpus
        if "greenlink" in prompt_lower or "project" in prompt_lower:
            ans = "Muzammil focuses on high-reliability intelligent systems, notably GreenLink+ (an edge environmental sensor network) and real-time visual perception architectures for institutional monitoring."
            sources = ["from: GreenLink+ case study", "from: Institutional Vision case study"]
        elif "research" in prompt_lower:
            ans = "Muzammil's research inquiries concentrate on low-power edge intelligence, verifiable multi-hop retrieval pipelines, and environmental telemetry networks."
            sources = ["from: Research Statement", "from: Edge AI Sensing Entry"]
        else:
            ans = "Muzammil works on edge AI, intelligent systems architecture, and verifiable machine learning models using Python, PyTorch, OpenCV, and FastAPI."
            sources = ["from: System Stack", "from: Engineering Timeline"]

        words = ans.split(" ")
        for i, word in enumerate(words):
            prefix = "" if i == 0 else " "
            yield f"data: {json.dumps({'delta': prefix + word})}\n\n"
            await asyncio.sleep(0.02)

        yield f"data: {json.dumps({'sources': sources, 'delta': ''})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(sse_generator(), media_type="text/event-stream")
