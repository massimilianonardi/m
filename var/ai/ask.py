from ollama import Client

client = Client(host="http://ollama.ai:11434")

def ask(prompt):

    response = client.chat(
        model="gemma4",
        messages=[
            {
                "role":"user",
                "content":prompt
            }
        ]
    )

    return response["message"]["content"]

