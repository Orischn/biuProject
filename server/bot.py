from sentence_transformers import SentenceTransformer, util
import json
from sys import argv

# class Context():
#     def __init__(self, context):
#         self.CONTEXT = context
#         self.NESTED_CONTEXT = None

# context = Context(None)
with open('./csvFiles/decisionTree.json', 'r') as file:
    data = json.load(file)


model = SentenceTransformer('all-mpnet-base-v2')

def get_questions(questions):
    return [item["question"] for item in questions]


# def answer_question(user_input):
#     current_context = context
#     current_questions = data["questions"]
#     user_input_embedding = model.encode(user_input)
#     questions_embedding = model.encode(get_questions(current_questions))
#     similarities = util.pytorch_cos_sim(user_input_embedding, questions_embedding)
#     best_match_idx = similarities.argmax().item()
#     best_question = current_questions[best_match_idx]
#     score = similarities[0][best_match_idx].item()
#     if current_context.CONTEXT:
#         while current_context.NESTED_CONTEXT:
#             index = next((i for i, q in enumerate(current_questions) if q["context"] == current_context.CONTEXT))
#             current_questions = current_questions[index]["context_questions"]
#             current_context = current_context.NESTED_CONTEXT
#         index = next((i for i, q in enumerate(current_questions) if q["context"] == current_context.CONTEXT))
#         current_questions = current_questions[index]["context_questions"]
#         questions_embedding = model.encode(get_questions(current_questions))
#         similarities = util.pytorch_cos_sim(user_input_embedding, questions_embedding)
#     best_match_idx = similarities.argmax().item()
#     if score >= similarities[0][best_match_idx].item():
#         if score < 0.5:
#             return "Failed to understand the question"
#         context.CONTEXT = current_questions[best_match_idx]["context"]
#         context.NESTED_CONTEXT = None
#         return best_question["answer"]
#     score = similarities[0][best_match_idx].item()
#     if score < 0.5:
#             return "Failed to understand the question"
#     current_context.NESTED_CONTEXT = None if not current_questions[best_match_idx]["context"] else Context(current_questions[best_match_idx]["context"])
#     return current_questions[best_match_idx]["answer"]

def answer_question(user_input):
    current_questions = data["questions"]
    user_input_embedding = model.encode(user_input)
    questions_embedding = model.encode(get_questions(current_questions))
    similarities = util.pytorch_cos_sim(user_input_embedding, questions_embedding)
    best_match_idx = similarities.argmax().item()
    best_question = current_questions[best_match_idx]
    score = similarities[0][best_match_idx].item()
    if score < 0.5:
            return "Failed to understand the question"
    return best_question["answer"]


# Example user input

while 1:
    question = input("Your question: ")
    answer = answer_question(question)
    print(answer)  # Output: "1 year"