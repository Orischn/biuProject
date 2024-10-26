from sentence_transformers import SentenceTransformer, util
import json
from sys import argv

model = SentenceTransformer('all-mpnet-base-v2')

def get_questions(questions):
    return [item["question"] for item in questions]

def answer_question(user_input):
    current_questions = data["questions"]
    user_input_embedding = model.encode(user_input)
    questions_embedding = model.encode(get_questions(current_questions))
    similarities = util.pytorch_cos_sim(user_input_embedding, questions_embedding)
    best_match_idx = similarities.argmax().item()
    best_question = current_questions[best_match_idx]
    score = similarities[0][best_match_idx].item()
    if score < 0.45:
            return "Failed to understand the question"
    return best_question["answer"]

data = json.loads(argv[2])
while True:
    prompt = input()
    chat_id = input()
    user_id = input()
    print(f'{chat_id}\n{user_id}\n{answer_question(prompt)}', end='')