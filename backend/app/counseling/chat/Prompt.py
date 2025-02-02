from g4f.client import Client
import g4f

def generate_chat_response(prompt, model="gpt-4o-mini", web_search=False):
    client = Client()
    response = client.chat.completions.create(
        model="gpt-4",
        provider=g4f.Provider.Blackbox,
        messages=[{"role": "user", "content": prompt}],
    )
    print(response)
    return response.choices[0].message.content
