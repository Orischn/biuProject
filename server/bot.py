from transformers import AutoTokenizer, AutoModel
import torch
from sentence_transformers import util
import json
from sys import argv
from os import linesep

model_name = "Qwen/Qwen-72B-Chat"
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    trust_remote_code=True
).eval()

def encodeText(text):
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    embeddings = outputs.last_hidden_state
    sentence_embedding = embeddings.mean(dim=1)
    return sentence_embedding

def encodeList(listOfSentences):
    inputs = tokenizer(listOfSentences, padding=True, truncation=True, return_tensors="pt")
    outputs = model(**inputs)
    embeddings = outputs.last_hidden_state
    sentence_embedding = embeddings.mean(dim=1)
    return sentence_embedding

def get_questions(questions):
    return [item["question"] for item in questions]

def answer_question(user_input):
    current_questions = data["questions"]
    user_input_embedding = encodeText(user_input)
    questions_embedding = encodeList(get_questions(current_questions))
    similarities = util.pytorch_cos_sim(user_input_embedding, questions_embedding)
    best_match_idx = similarities.argmax().item()
    score = similarities[0][best_match_idx].item()
    print(score)
    if score < 0.75:
            return "Failed to understand the question"
    values, _ = torch.topk(similarities, 2)
    if values.max().item() - values.min().item() < 0.015:
        return f"Question could have multiple meanings.{linesep}Please be more specific."
    best_question = current_questions[best_match_idx]
    return best_question["answer"]

with open('csvFiles/tree.csv', 'r') as file:
    data = json.load(file)

# data = json.loads(argv[1])
while True:
    prompt = input()
    chat_id = input()
    user_id = input()
    print(f'{chat_id}|{user_id}|{answer_question(prompt)}', end='')