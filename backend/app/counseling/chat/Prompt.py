from g4f.client import Client

def generate_chat_response(prompt, model="gpt-4o-mini", web_search=False):
    client = Client()
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        web_search=web_search
    )
    return response.choices[0].message.content
