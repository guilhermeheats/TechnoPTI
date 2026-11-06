import os

from flask import Flask, send_from_directory
from flask_cors import CORS
from werkzeug.exceptions import NotFound

from database import session
from routes.problems import problems_bp
from routes.results import result_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(problems_bp)
app.register_blueprint(result_bp)


# Em produção, o container copia o build do Vite para FRONTEND_DIST.
# Em desenvolvimento, a variável não existe e o frontend roda no Vite.
frontend_dist = os.environ.get("FRONTEND_DIST")
if frontend_dist and os.path.isdir(frontend_dist):

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if path:
            try:
                return send_from_directory(frontend_dist, path)
            except NotFound:
                pass
        return send_from_directory(frontend_dist, "index.html")


@app.teardown_appcontext
def remove_session(exception=None):
    session.remove()


if __name__ == "__main__":
    app.run(debug=True)
