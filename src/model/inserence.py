from flask import Flask, request, jsonify
from flask_cors import CORS
from mlx_lm import load, generate
import os
import traceback
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load the model
model, tokenizer = None, None
try:
    model_path = "/Users/hrushireddy/Documents/project/fullstack-gym-bot-new/src/model/mlx_model"
    logger.info(f"Loading model from {model_path}")
    model, tokenizer = load(model_path)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    logger.error(traceback.format_exc())

def format_prompt(prompt):
    # Simplified prompt to reduce potential issues
    return f"""<s>[INST]
You are a fitness and nutrition expert. Create a detailed plan based on the user's request.
- Include a workout plan with specific exercises, sets, and reps.
- Include a meal plan with breakfast, lunch, dinner, and snacks, specifying portion sizes.
- Use bullet points for clarity.

User request: {prompt}
[/INST]"""

def clean_response(text):
    logger.debug(f"Raw response: '{text}'")  # Log full raw response for debugging
    if not text:
        return ""
    if "[/INST]" in text:
        text = text.split("[/INST]")[-1]
    if "</s>" in text:
        text = text.split("</s>")[0]
    cleaned = text.strip()
    logger.debug(f"Cleaned response: '{cleaned}'")
    return cleaned

@app.route('/generate', methods=['POST'])
def generate_nutrition_plan():
    if model is None or tokenizer is None:
        logger.error("Model or tokenizer not loaded")
        return jsonify({
            "success": False,
            "error": "Model not loaded",
            "message": "The server failed to initialize the model. Please check server configuration."
        }), 500

    data = request.get_json()
    if not data or 'prompt' not in data:
        logger.warning("Invalid request: No prompt provided")
        return jsonify({
            "success": False,
            "error": "Invalid request",
            "message": "Please provide a prompt in the request body."
        }), 400

    prompt = data['prompt']
    logger.info(f"Processing prompt: {prompt[:100]}...")

    try:
        formatted_prompt = format_prompt(prompt)
        logger.debug(f"Formatted prompt: {formatted_prompt[:200]}...")

        # Reduce max_tokens to test model behavior
        response = generate(
            model=model,
            tokenizer=tokenizer,
            prompt=formatted_prompt,
            max_tokens=500  # Lowered to avoid potential issues
        )

        logger.debug(f"Raw response type: {type(response)}, content: '{response}'")

        if isinstance(response, list):
            response = response[0] if response else ""
        
        cleaned_response = clean_response(response)
        logger.info(f"Cleaned response length: {len(cleaned_response)}")

        if not cleaned_response:
            logger.warning("Empty response generated")
            # Fallback response to ensure frontend gets usable data
            fallback_response = """
**Workout Plan**:
- Push-ups: 3 sets of 12 reps
- Squats: 4 sets of 15 reps
- Lunges: 3 sets of 10 reps per leg
- Plank: 60 seconds

**Diet Plan**:
- Breakfast: Protein smoothie (1 cup berries, 1 scoop protein, 200ml almond milk)
- Lunch: Grilled chicken salad (150g chicken, mixed greens, 1 tbsp olive oil)
- Dinner: Salmon (150g) with roasted vegetables (1 cup broccoli, carrots)
- Snack: Greek yogurt (100g) with 10 almonds
"""
            logger.info("Using fallback response")
            return jsonify({
                "success": True,
                "mealPlan": fallback_response,
                "warning": "Model generated empty response; using fallback data"
            })

        return jsonify({
            "success": True,
            "mealPlan": cleaned_response
        })

    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to generate response. Please check server logs or try again."
        }), 500

@app.route('/test', methods=['POST'])
def test_endpoint():
    logger.info("Test endpoint called")
    mock_response = """
    **Workout Plan**:
    - Push-ups: 3 sets of 12 reps
    - Squats: 4 sets of 15 reps
    - Lunges: 3 sets of 10 reps per leg
    - Plank: 60 seconds

    **Diet Plan**:
    - Breakfast: Protein smoothie (1 cup berries, 1 scoop protein, 200ml almond milk)
    - Lunch: Grilled chicken salad (150g chicken, mixed greens, 1 tbsp olive oil)
    - Dinner: Salmon (150g) with roasted vegetables (1 cup broccoli, carrots)
    - Snack: Greek yogurt (100g) with 10 almonds
    """
    return jsonify({
        "success": True,
        "mealPlan": mock_response
    })

@app.route('/health', methods=['GET'])
def health_check():
    status = "healthy" if model and tokenizer else "model not loaded"
    logger.info(f"Health check: {status}")
    return jsonify({"status": status, "model": "nutrition-expert"})

@app.route('/', methods=['GET'])
def home():
    logger.info("Home page accessed")
    return """
    <html>
        <head>
            <title>Fitness & Nutrition Expert API</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #4CAF50; }
                pre { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>🏋️‍♂️ Fitness & Nutrition Expert API</h1>
            <p>Send POST requests to <code>/generate</code> with a JSON body containing your prompt:</p>
            <pre>
{
    "prompt": "Create a fitness and meal plan for weight loss"
}
            </pre>
            <p>The API will return a detailed fitness and meal plan based on your request.</p>
        </body>
    </html>
    """

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Starting server on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port)