from flask import Flask
from flask_cors import CORS

from database import session
from routes.problems import problems_bp
from routes.results import result_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(problems_bp)
app.register_blueprint(result_bp)


@app.teardown_appcontext
def remove_session(exception=None):
    session.remove()


if __name__ == "__main__":
    app.run(debug=True)