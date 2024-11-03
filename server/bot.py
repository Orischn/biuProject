from transformers import AutoTokenizer, AutoModel
import torch
from sentence_transformers import util
import json
from sys import argv
from os import linesep

model_name = "onlplab/alephbert-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

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
    with open('scores.txt', 'w') as file:
         file.write(f'{score}\n')
    if score < 0.75:
            return "Failed to understand the question"
    values, _ = torch.topk(similarities, 2)
    if values.max().item() - values.min().item() < 0.015:
        return f"Question could have multiple meanings.{linesep}Please be more specific."
    best_question = current_questions[best_match_idx]
    return best_question["answer"]

data = json.loads(argv[1])
while True:
    prompt = input()
    chat_id = input()
    user_id = input()
    print(f'{chat_id}|{user_id}|{answer_question(prompt)}', end='')