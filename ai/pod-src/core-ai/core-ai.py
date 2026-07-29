from fastapi import FastAPI, Request
import requests

app = FastAPI()

OLLAMA_URL = "http://ollama.ai:11434"


@app.post("/v1/chat/completions")
async def chat(request: Request):
    body = await request.json()

    response = requests.post(
        f"{OLLAMA_URL}/v1/chat/completions",
        json=body,
        timeout=300
    )

    response.raise_for_status()

    return response.json()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=2000)

