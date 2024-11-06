from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Conectar a la base de datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="atelier"
)

cursor = db.cursor(dictionary=True)

@app.route("/login", methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    print("username Recibido: ", username)
    print("Contraseña Recibida: ", password)
    
    if not password or not username:
        return jsonify({"message": "username y password son requeridos"}), 400
    
    # Consulta a la base de datos para verificar el usuario
    cursor.execute("SELECT * FROM inicio_sesion WHERE nombre = %s AND contraseña = %s", (username, password))
    user = cursor.fetchone()
    
    if user:
        return jsonify({"message": "Inicio de sesión exitoso", "user": user}), 200
    else:
        return jsonify({"message": "username o contraseña incorrectos"}), 401

if __name__ == '__main__':
    app.run(debug=True)
