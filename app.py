from flask import Flask, jsonify, request, render_template, session, redirect, url_for, flash, send_from_directory
# from dotenv import load_dotenv
import mysql.connector
import os
# from swagger.swaggerui import setup_swagger
import random
import string
from datetime import datetime, timedelta
import requests
import pytz
from dotenv import load_dotenv  ## pip install python-dotenv
import openai  ## pip install openai==0.28.0
from flask_cors import CORS ## pip install flask-cors
import json 
import hashlib
from functools import wraps
from io import BytesIO
from werkzeug.utils import secure_filename


# Allowed file extensions
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

# Function to check if the file is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/static')

CORS(app)  # This allows all origins (wildcard)

# Set up Swagger
# setup_swagger(app)


app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev_secret_key")  # Set a strong secret key


#Load environment variables from .env file
load_dotenv()

# Configure DeepSeek
openai.api_key = os.getenv("DEEPSEEK_API_KEY")
openai.api_base = "https://api.deepseek.com/v1"

# Check if the file "dev" exists
if not os.path.exists('dev'):
    # Retrieve MySQL connection details from environment variable
    mysql_details = os.getenv('MYSQL_DETAILS')

    if mysql_details:
        # Split the details by "@"
        details = mysql_details.split('@')

        # Extract the individual values
        host = details[0]
        user = details[1]
        password = details[2]
        database = details[3]
        port = int(details[4])

        # MySQL connection setup
        try:
            db_connection = mysql.connector.connect(
                host=host,
                user=user,
                password=password,
                database=database,
                port=port
            )
            print("Connection successful")

        except mysql.connector.Error as err:
            print(f"Error connecting to MySQL: {err}")
            db_connection = None
    else:
        print("MYSQL_DETAILS environment variable is not set.")
        db_connection = None
else:
    print("File 'dev' exists. Skipping MySQL connection setup.")


# Helper function to reconnect to MySQL
def reconnect_to_mysql():
    global db_connection

    mysql_details = os.getenv('MYSQL_DETAILS')

    if mysql_details:
        # Split the details by "@"
        details = mysql_details.split('@')

        # Extract the individual values
        host = details[0]
        user = details[1]
        password = details[2]
        database = details[3]
        port = int(details[4])

        # MySQL connection setup
        try:
            db_connection = mysql.connector.connect(
                host=host,
                user=user,
                password=password,
                database=database,
                port=port
            )
            print("Reconnection successful")
            return True

        except mysql.connector.Error as err:
            print(f"Error reconnecting to MySQL: {err}")
            db_connection = None
            return False
    else:
        print("MYSQL_DETAILS environment variable is not set.")
        db_connection = None
        return False

def generate_random_string(length=32):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def get_cursor():
    if db_connection:
        return db_connection.cursor()
    else:
        return None

def is_mysql_available():
    return db_connection is not None

# Route to handle MySQL errors
def handle_mysql_error(e):
    print(f"MySQL Error: {e}")
    return jsonify({"error": "MySQL database operation failed. Please check the database connection."}), 500


## ------ create table ---------------- ##
@app.route('/create-auth-table', methods=['POST'])
def create_auth_table():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        create_table_query = """
        CREATE TABLE IF NOT EXISTS auth (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uID TEXT,
            passwordHash TEXT,
            role TEXT,
            groupId TEXT,
            email TEXT,
            status TEXT,
            token TEXT,
            resetCode TEXT,
            userName TEXT,
            organizationName TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        """
        cursor.execute(create_table_query)
        db_connection.commit()
        return jsonify({"message": "auth table created successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/create-subscribers-table', methods=['POST'])
def create_subscribers_table():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        create_table_query = """
        CREATE TABLE IF NOT EXISTS subscribers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uID TEXT,
            mobileNumber TEXT,
            userID TEXT,
            status TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        """
        cursor.execute(create_table_query)
        db_connection.commit()
        return jsonify({"message": "subscribers table created successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/create-weather-data-table', methods=['POST'])
def create_weather_data_table():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        create_table_query = """
        CREATE TABLE IF NOT EXISTS weather_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uID TEXT,
            locationID TEXT,
            weatherData LONGTEXT,
            status TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        """
        cursor.execute(create_table_query)
        db_connection.commit()
        return jsonify({"message": "weather_data table created successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/create-evacuation-data-table', methods=['POST'])
def create_evacuation_data_table():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        create_table_query = """
        CREATE TABLE IF NOT EXISTS evacuation_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uID TEXT,
            locationID TEXT,
            evacuationData LONGTEXT,
            status TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        """
        cursor.execute(create_table_query)
        db_connection.commit()
        return jsonify({"message": "evacuation_data table created successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/create-flooding-data-table', methods=['POST'])
def create_flooding_data_table():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        create_table_query = """
        CREATE TABLE IF NOT EXISTS flooding_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uID TEXT,
            locationID TEXT,
            floodingData LONGTEXT,
            status TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        """
        cursor.execute(create_table_query)
        db_connection.commit()
        return jsonify({"message": "flooding_data table created successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/create-forecast-data-table', methods=['POST'])
def create_forecast_data_table():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        create_table_query = """
        CREATE TABLE IF NOT EXISTS forecast_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uID TEXT,
            locationID TEXT,
            forecastData LONGTEXT,
            status TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        """
        cursor.execute(create_table_query)
        db_connection.commit()
        return jsonify({"message": "forecast_data table created successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/create-broadcast-table', methods=['POST'])
def create_broadcast_table():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        create_table_query = """
        CREATE TABLE IF NOT EXISTS broadcast (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uID TEXT,
            broadcastData LONGTEXT,
            status TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        """
        cursor.execute(create_table_query)
        db_connection.commit()
        return jsonify({"message": "broadcast table created successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


## ------ insert record ---------------- ##
@app.route('/insert-mock-auth', methods=['POST'])
def insert_mock_auth():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        mock_data = {
            "uID": generate_random_string(12),
            "passwordHash": "admin1234",
            "role": "admin",
            "groupId": "group-001",
            "email": "yvendee2020@gmail.com",
            "status": "active",
            "token": generate_random_string(40),
            "resetCode": generate_random_string(6),
            "userName": "testuser",
            "organizationName": "test organization"
        }

        insert_query = """
        INSERT INTO auth (
            uID, passwordHash, role, groupId, email, status, token, resetCode, userName, organizationName
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        cursor.execute(insert_query, (
            mock_data["uID"],
            mock_data["passwordHash"],
            mock_data["role"],
            mock_data["groupId"],
            mock_data["email"],
            mock_data["status"],
            mock_data["token"],
            mock_data["resetCode"],
            mock_data["userName"],
            mock_data["organizationName"]
        ))

        db_connection.commit()
        return jsonify({"message": "Mock auth record inserted successfully."}), 201

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/insert-mock-subscriber', methods=['POST'])
def insert_mock_subscriber():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        mock_data = {
            "uID": generate_random_string(12),
            # "mobileNumber": f"+1{random.randint(1000000000, 9999999999)}",
            "mobileNumber": "09107666192",
            "userID": generate_random_string(10),
            "status": "active"
        }

        insert_query = """
        INSERT INTO subscribers (
            uID, mobileNumber, userID, status
        ) VALUES (%s, %s, %s, %s);
        """
        cursor.execute(insert_query, (
            mock_data["uID"],
            mock_data["mobileNumber"],
            mock_data["userID"],
            mock_data["status"]
        ))

        db_connection.commit()
        return jsonify({"message": "Mock subscriber record inserted successfully."}), 201

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/insert-mock-weather', methods=['POST'])
def insert_mock_weather():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        # Define the mock weather data
        response_data = {
            "weatherData": {
                "todayDate": "June 14",
                "todayWeather": "Cloudy",
                "todayTemp": "22",
                "tomorrowDate": "June 13",
                "tomorrowWeather": "Thunder",
                "tomorrowTemp": "25",
                "lastDate": "June 12",
                "lastWeather": "Rain",
                "lastTemp": "23",
                "lastTwoDayDate": "June 11",
                "lastTwoDayWeather": "Sunny",
                "lastTwoDayTemp": "28"
            },
            "weatherLabel": {
                "lastDay": "Sunday",
                "lastTwoDay": "Saturday"
            }
        }

        mock_data = {
            "uID": generate_random_string(12),
            "locationID": "Baao",
            "weatherData": json.dumps(response_data),  # Convert dict to JSON string
            "status": "active"
        }

        insert_query = """
        INSERT INTO weather_data (
            uID, locationID, weatherData, status
        ) VALUES (%s, %s, %s, %s);
        """
        cursor.execute(insert_query, (
            mock_data["uID"],
            mock_data["locationID"],
            mock_data["weatherData"],
            mock_data["status"]
        ))

        db_connection.commit()
        return jsonify({"message": "Mock weather_data record inserted successfully."}), 201

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/insert-mock-evacuation', methods=['POST'])
def insert_mock_evacuation():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        stations = [
            {"name": "Agdangan ES", "position": {"lat": 13.49378, "lng": 123.32579}},
            {"name": "Agdangan NHS", "position": {"lat": 13.49533, "lng": 123.32157}},
            {"name": "Antipolo ES", "position": {"lat": 13.48785, "lng": 123.38278}},
            {"name": "Bagumbayan ES", "position": {"lat": 13.48309, "lng": 123.27788}},
            {"name": "Buluang ES", "position": {"lat": 13.47000, "lng": 123.35697}},
            {"name": "EPAMHS", "position": {"lat": 13.47276, "lng": 123.35546}},
            {"name": "Cristo Rey ES", "position": {"lat": 13.53634, "lng": 123.43127}},
            {"name": "Caranday HS", "position": {"lat": 13.50164, "lng": 123.38023}},
            {"name": "Kalahi School Building", "position": {"lat": 13.50064, "lng": 123.39628}},
            {"name": "West Central School", "position": {"lat": 13.45471, "lng": 123.36836}},
            {"name": "Rosary School", "position": {"lat": 13.45339, "lng": 123.36797}},
            {"name": "Iyagan ES", "position": {"lat": 13.52921, "lng": 123.38679}},
            {"name": "Iyagan HS", "position": {"lat": 13.53113, "lng": 123.38899}},
            {"name": "Lourdes ES", "position": {"lat": 13.49938, "lng": 123.36135}}
        ]

        mock_data = {
            "uID": generate_random_string(12),
            "locationID": "Baao",
            "evacuationData": json.dumps(stations),  # Convert to JSON string
            "status": "active"
        }

        insert_query = """
        INSERT INTO evacuation_data (
            uID, locationID, evacuationData, status
        ) VALUES (%s, %s, %s, %s);
        """
        cursor.execute(insert_query, (
            mock_data["uID"],
            mock_data["locationID"],
            mock_data["evacuationData"],
            mock_data["status"]
        ))

        db_connection.commit()
        return jsonify({"message": "Mock evacuation_data record inserted successfully."}), 201

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/insert-mock-flooding', methods=['POST'])
def insert_mock_flooding():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        stations = [
            {"name": "Agdangan ES", "position": {"lat": 13.49378, "lng": 123.32579}},
            {"name": "Agdangan NHS", "position": {"lat": 13.49533, "lng": 123.32157}},
            {"name": "Antipolo ES", "position": {"lat": 13.48785, "lng": 123.38278}},
            {"name": "Bagumbayan ES", "position": {"lat": 13.48309, "lng": 123.27788}},
            {"name": "Buluang ES", "position": {"lat": 13.47000, "lng": 123.35697}},
            {"name": "EPAMHS", "position": {"lat": 13.47276, "lng": 123.35546}},
            {"name": "Cristo Rey ES", "position": {"lat": 13.53634, "lng": 123.43127}},
            {"name": "Caranday HS", "position": {"lat": 13.50164, "lng": 123.38023}},
            {"name": "Kalahi School Building", "position": {"lat": 13.50064, "lng": 123.39628}},
            {"name": "West Central School", "position": {"lat": 13.45471, "lng": 123.36836}},
            {"name": "Rosary School", "position": {"lat": 13.45339, "lng": 123.36797}},
            {"name": "Iyagan ES", "position": {"lat": 13.52921, "lng": 123.38679}},
            {"name": "Iyagan HS", "position": {"lat": 13.53113, "lng": 123.38899}},
            {"name": "Lourdes ES", "position": {"lat": 13.49938, "lng": 123.36135}}
        ]

        mock_data = {
            "uID": generate_random_string(12),
            "locationID": "Baao",
            "floodingData": json.dumps(stations),  # Convert Python list to JSON string
            "status": "active"
        }

        insert_query = """
        INSERT INTO flooding_data (
            uID, locationID, floodingData, status
        ) VALUES (%s, %s, %s, %s);
        """
        cursor.execute(insert_query, (
            mock_data["uID"],
            mock_data["locationID"],
            mock_data["floodingData"],
            mock_data["status"]
        ))

        db_connection.commit()
        return jsonify({"message": "Mock flooding_data record inserted successfully."}), 201

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/insert-mock-forecast', methods=['POST'])
def insert_mock_forecast():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        # Define the mock forecast data
        forecast_data = {
            "outsideTemp": "22°C",
            "outsideWeather": "Sunny",
            "windSpeed": "10 km/h",
            "humidity": "20%",
            "visibility": "2 km"
        }

        mock_data = {
            "uID": generate_random_string(12),
            "locationID": "Baao",
            "forecastData": json.dumps(forecast_data),  # Convert dict to JSON string
            "status": "active"
        }

        insert_query = """
        INSERT INTO forecast_data (
            uID, locationID, forecastData, status
        ) VALUES (%s, %s, %s, %s);
        """
        cursor.execute(insert_query, (
            mock_data["uID"],
            mock_data["locationID"],
            mock_data["forecastData"],
            mock_data["status"]
        ))

        db_connection.commit()
        return jsonify({"message": "Mock forecast_data record inserted successfully."}), 201

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


@app.route('/insert-mock-broadcast', methods=['POST'])
def insert_mock_broadcast():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        insert_query = """
        INSERT INTO broadcast (uID, broadcastData, status)
        VALUES (%s, %s, %s);
        """
        mock_data = (
            "user123",
            '{"title": "Public Announcement", "message": "Scheduled maintenance at 2 AM UTC."}',
            "active"
        )
        cursor.execute(insert_query, mock_data)
        db_connection.commit()
        return jsonify({"message": "Mock broadcast data inserted successfully."}), 201

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


## ------ show records ---------------- ##
@app.route('/show-content/<table_name>', methods=['GET'])
def show_table_content(table_name):
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        # Validate table name to prevent SQL injection (only allow known safe table names)
        allowed_tables = [
            'auth', 'subscribers', 'weather_data',
            'evacuation_data', 'flooding_data', 'forecast_data', 'broadcast'
        ]

        if table_name not in allowed_tables:
            return jsonify({"error": "Invalid table name"}), 400

        query = f"SELECT * FROM {table_name};"
        cursor.execute(query)
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]

        results = [dict(zip(column_names, row)) for row in rows]

        return jsonify({ "table": table_name, "data": results }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


# Route to reconnect to MySQL
@app.route('/reconnect-mysql', methods=['GET'])
def reconnect_mysql():
    if reconnect_to_mysql():
        return jsonify({"message": "Reconnected to MySQL successfully!"}), 200
    else:
        return jsonify({"error": "Failed to reconnect to MySQL."}), 500

# Check if the file "dev" exists
if not os.path.exists('dev'):
    # Execute this route if "dev" is not present and MySQL is available
    @app.route('/', methods=['GET'])
    def index():
        if is_mysql_available():
            # return jsonify({
            #     "message": {
            #         "status": "ok",
            #         "developer": "kayven",
            #         "email": "yvendee2020@gmail.com"
            #     }
            # })
            return render_template("index.html")
        else:
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
else:
    # Execute this route if "dev" exists
    @app.route('/', methods=['GET'])
    def index():
        # return jsonify({"message": "Welcome to the baao disaster link"})
        return render_template("index.html")

# @app.route('/', methods=['GET'])
# def index():
#     return jsonify({"message": "Welcome to the baao disaster link"})


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated_function

@app.route("/home")
def home():
    # Render the HTML template for the /ui route
    return render_template("home.html")


@app.route("/evacuation")
def evacuation():
    # Render the HTML template for the /** route
    return render_template("evacuation.html")


@app.route("/accident")
def accident():
    # Render the HTML template for the /** route
    return render_template("accident.html")


@app.route("/flooding")
def flooding():
    # Render the HTML template for the /** route
    return render_template("flooding.html")

@app.route("/weather")
def weather():
    # Render the HTML template for the /** route
    return render_template("weather.html")

@app.route("/emergency")
def emergency():
    # Render the HTML template for the /** route
    return render_template("emergency.html")


@app.route("/phone")
def phone():
    # Render the HTML template for the /** route
    return render_template("guide.html")

@app.route("/guide")
def guide():
    # Render the HTML template for the /** route
    return render_template("guide.html")

@app.route("/disaster-preparedness")
def disaster_prep():
    # Render the HTML template for the /** route
    return render_template("disaster-prep.html")

@app.route("/fire-preparedness")
def fire_prep():
    # Render the HTML template for the /** route
    return render_template("fire-prep.html")


@app.route("/earthquake-preparedness")
def earthquake_prep():
    # Render the HTML template for the /** route
    return render_template("earthquake-prep.html")

@app.route("/history")
def history():
    # Render the HTML template for the /history route
    return render_template("history.html")

@app.route("/history-preview")
def history_preview():
    # Render the HTML template for the /history route
    return render_template("history-preview.html")

@app.route("/forecast-table")
def forecast_table():
    # Render the HTML template for the /history route
    return render_template("forecast.html")


@app.route("/settings")
def settings():
    # Render the HTML template for the /history route
    return render_template("settings.html")

## APIs
# @app.route("/get_current_date")
# def get_current_date():
#     # Get the current local time
#     now = datetime.now()
    
#     # Format the date as "Day, DD Month YYYY" (e.g., "Friday, 13 June 2025")
#     # %A for full weekday name, %d for day of the month, %B for full month name, %Y for year
#     formatted_date = now.strftime("%A, %d %B %Y")
    
#     return jsonify({'date': formatted_date})



@app.route("/get_current_date")
def get_current_date(): 
    # Get the current time in the desired timezone (e.g., Asia/Manila for Taguig)
    manila_tz = pytz.timezone('Asia/Manila')
    now = datetime.now(manila_tz)
    
    # Format the date as "Day, DD Month YYYY" (e.g., "Friday, 13 June 2025")
    # %A for full weekday name, %d for day of the month, %B for full month name, %Y for year
    formatted_date = now.strftime("%A, %d %B %Y")
    
    return jsonify({'date': formatted_date})



@app.route('/api/add-subscriber', methods=['POST'])
def add_subscriber():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    data = request.get_json()
    mobile_number = data.get("mobileNumber")

    if not mobile_number:
        return jsonify({"error": "mobileNumber is required"}), 400

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        insert_query = """
        INSERT INTO subscribers (uID, mobileNumber, userID, status)
        VALUES (%s, %s, %s, %s);
        """
        cursor.execute(insert_query, (
            generate_random_string(12),
            mobile_number,
            generate_random_string(10),
            "active"
        ))
        db_connection.commit()
        return jsonify({"message": "Subscriber added successfully."}), 201

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()

@app.route('/api/remove-subscriber', methods=['DELETE'])
def remove_subscriber():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    data = request.get_json()
    mobile_number = data.get("mobileNumber")

    if not mobile_number:
        return jsonify({"error": "mobileNumber is required"}), 400

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        delete_query = "DELETE FROM subscribers WHERE mobileNumber = %s;"
        cursor.execute(delete_query, (mobile_number,))
        db_connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "No subscriber found with that mobile number."}), 404

        return jsonify({"message": "Subscriber removed successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


@app.route('/api/evacuation', methods=['GET'])
def get_evacuation_data_api():
    try:
        if not is_mysql_available():
            return handle_mysql_error("MySQL not available")

        cursor = get_cursor()
        if not cursor:
            return handle_mysql_error("Unable to get MySQL cursor")

        uID = "kBTJb3QjS1zD"
        select_query = "SELECT evacuationData FROM evacuation_data WHERE uID = %s AND status = 'active';"
        cursor.execute(select_query, (uID,))
        result = cursor.fetchone()

        if result:
            evacuation_data_json = result[0]
            evacuation_data = json.loads(evacuation_data_json)
            return jsonify({"evacuationData": evacuation_data}), 200
        else:
            return jsonify({"error": "No evacuation data found for the specified uID."}), 404

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        if cursor:
            cursor.close()

@app.route('/api/evacuation/delete', methods=['POST'])
def delete_evacuation_item():
    cursor = None
    try:
        data = request.get_json()
        name = data.get('name')
        position = data.get('position')

        if not (name and position):
            return jsonify({"error": "Missing required fields"}), 400

        cursor = get_cursor()
        if not cursor:
            return handle_mysql_error("Unable to get MySQL cursor")

        # Hardcoded uID inside the route
        uID = "kBTJb3QjS1zD"
        cursor.execute("SELECT evacuationData FROM evacuation_data WHERE uID = %s AND status = 'active';", (uID,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "No data found"}), 404

        evacuation_data = json.loads(result[0])

        # Filter out the item to delete
        updated_data = [
            item for item in evacuation_data
            if not (item['name'] == name and
                    item['position']['lat'] == position['lat'] and
                    item['position']['lng'] == position['lng'])
        ]

        # Update the database
        update_query = "UPDATE evacuation_data SET evacuationData = %s WHERE uID = %s AND status = 'active';"
        cursor.execute(update_query, (json.dumps(updated_data), uID))
        db_connection.commit()

        return jsonify({"message": "Item deleted successfully"}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        if cursor:
            cursor.close()


@app.route('/api/evacuation/add', methods=['POST'])
def add_evacuation_item():
    cursor = None
    try:
        data = request.get_json()
        name = data.get('name')
        position = data.get('position')

        if not (name and position):
            return jsonify({"error": "Missing required fields"}), 400

        cursor = get_cursor()
        if not cursor:
            return handle_mysql_error("Unable to get MySQL cursor")

        # Hardcoded uID inside the route
        uID = "kBTJb3QjS1zD"
        cursor.execute("SELECT evacuationData FROM evacuation_data WHERE uID = %s AND status = 'active';", (uID,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "No evacuation data found for the specified uID"}), 404

        evacuation_data = json.loads(result[0])

        # Append new item
        evacuation_data.append({
            "name": name,
            "position": {
                "lat": position["lat"],
                "lng": position["lng"]
            }
        })

        # Update the record
        update_query = "UPDATE evacuation_data SET evacuationData = %s WHERE uID = %s AND status = 'active';"
        cursor.execute(update_query, (json.dumps(evacuation_data), uID))
        db_connection.commit()

        return jsonify({"message": "Item added successfully"}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        if cursor:
            cursor.close()


@app.route('/api/flooding', methods=['GET'])
def get_flooding_data():
    try:
        if not is_mysql_available():
            return handle_mysql_error("MySQL not available")

        cursor = get_cursor()
        if not cursor:
            return handle_mysql_error("Unable to get MySQL cursor")

        uID = "UYBryWCCRCWF"
        select_query = "SELECT floodingData FROM flooding_data WHERE uID = %s AND status = 'active';"
        cursor.execute(select_query, (uID,))
        result = cursor.fetchone()

        if result:
            flooding_data_json = result[0]
            flooding_data = json.loads(flooding_data_json)
            return jsonify({"floodingData": flooding_data}), 200
        else:
            return jsonify({"error": "No flooding data found for the specified uID."}), 404

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        if cursor:
            cursor.close()

@app.route('/api/flooding/delete', methods=['POST'])
def delete_flooding_item():
    try:
        data = request.get_json()
        name = data.get('name')
        position = data.get('position')

        if not (name and position):
            return jsonify({"error": "Missing required fields"}), 400

        cursor = get_cursor()
        if not cursor:
            return handle_mysql_error("Unable to get MySQL cursor")

        # Fetch current flooding data
        uID = "UYBryWCCRCWF"
        cursor.execute("SELECT floodingData FROM flooding_data WHERE uID = %s AND status = 'active';", (uID,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "No data found"}), 404

        flooding_data = json.loads(result[0])

        # Filter out the item to delete
        updated_data = [
            item for item in flooding_data
            if not (item['name'] == name and
                    item['position']['lat'] == position['lat'] and
                    item['position']['lng'] == position['lng'])
        ]

        # Update the database
        update_query = "UPDATE flooding_data SET floodingData = %s WHERE uID = %s AND status = 'active';"
        cursor.execute(update_query, (json.dumps(updated_data), uID))
        db_connection.commit()

        return jsonify({"message": "Item deleted successfully"}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        if cursor:
            cursor.close()

@app.route('/api/flooding/add', methods=['POST'])
def add_flooding_item():
    try:
        data = request.get_json()
        name = data.get('name')
        position = data.get('position')

        if not (name and position):
            return jsonify({"error": "Missing required fields"}), 400

        cursor = get_cursor()
        if not cursor:
            return handle_mysql_error("Unable to get MySQL cursor")

        uID = "UYBryWCCRCWF"
        cursor.execute("SELECT floodingData FROM flooding_data WHERE uID = %s AND status = 'active';", (uID,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "No flooding data found for the specified uID"}), 404

        flooding_data = json.loads(result[0])

        # Append new item
        flooding_data.append({
            "name": name,
            "position": {
                "lat": position["lat"],
                "lng": position["lng"]
            }
        })

        # Update the record
        update_query = "UPDATE flooding_data SET floodingData = %s WHERE uID = %s AND status = 'active';"
        cursor.execute(update_query, (json.dumps(flooding_data), uID))
        db_connection.commit()

        return jsonify({"message": "Item added successfully"}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        if cursor:
            cursor.close()


@app.route('/api/create-user', methods=['POST'])
def create_user():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        # Check if username already exists
        check_query = "SELECT id FROM auth WHERE uID = %s"
        cursor.execute(check_query, (username,))
        if cursor.fetchone():
            return jsonify({"error": "Username already exists"}), 409

        # Insert new user
        insert_query = """
        INSERT INTO auth (uID, userName, passwordHash, status)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (username, username, password, "active"))
        db_connection.commit()
        return jsonify({"message": "User created successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


@app.route('/api/update-broadcast', methods=['POST'])
def update_broadcast():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        data = request.get_json()
        new_broadcast_data = data.get('broadcastData', '')

        update_query = """
        UPDATE broadcast
        SET broadcastData = %s, modifiedAt = CURRENT_TIMESTAMP
        WHERE uID = %s;
        """
        cursor.execute(update_query, (new_broadcast_data, "user123"))
        db_connection.commit()

        return jsonify({"message": "Broadcast updated successfully."}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


@app.route('/api/get-broadcast', methods=['GET'])
def get_latest_broadcast_for_user():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        # Set your desired user ID here
        user_id = "user123"

        # Query the latest broadcastData for the given user
        query = """
        SELECT broadcastData FROM broadcast
        WHERE uID = %s AND status = 'active'
        ORDER BY createdAt DESC
        LIMIT 1
        """
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        if result and result[0]:
            return jsonify({"broadcastData": result[0]}), 200
        else:
            return jsonify({"broadcastData": ""}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


@app.route('/api/get-all-mobiles', methods=['GET'])
def get_all_mobiles():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")

    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        query = """
        SELECT mobileNumber FROM subscribers
        WHERE status = 'active'
        """
        cursor.execute(query)
        results = cursor.fetchall()

        mobile_list = [row[0] for row in results if row[0]]

        return jsonify({"mobileNumbers": mobile_list}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


# @app.route('/api/image/typhoon', methods=['GET'])
# def get_typhoon_image():
#     return send_from_directory('static/images', 'typhoon.png')


@app.route('/api/image/typhoon', methods=['GET'])
def get_typhoon_image():
    # The external server URL
    external_url = 'http://104.248.11.135:5000/uploaded/typhoon.png'

    try:
        # Make a GET request to fetch the image from the external server
        response = requests.get(external_url)

        # If the request was successful (status code 200)
        if response.status_code == 200:
            # Return the image data
            return send_file(BytesIO(response.content), mimetype='image/png')

        else:
            return jsonify({'status': 'failure', 'message': 'File not found on external server'}), 404
    except requests.exceptions.RequestException as e:
        # Handle network errors or other issues
        return jsonify({'status': 'failure', 'message': f'Error fetching the image: {str(e)}'}), 500



@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'status': 'failure', 'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'failure', 'message': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        # Secure the filename to avoid directory traversal issues
        filename = secure_filename(file.filename)

        # Forward the file to the external server immediately
        external_url = 'http://104.248.11.135:5000/upload_image'  # External server endpoint
        files = {'file': (filename, file.stream)}

        try:
            # Send the file to the external server using a POST request
            response = requests.post(external_url, files=files)

            # Check if the upload to the external server was successful
            if response.status_code == 200:
                return jsonify({'status': 'success', 'message': 'File uploaded and forwarded successfully.'})
            else:
                return jsonify({'status': 'failure', 'message': 'Failed to forward the file to the external server.'}), 500

        except requests.exceptions.RequestException as e:
            return jsonify({'status': 'failure', 'message': f'Error forwarding file: {str(e)}'}), 500

    else:
        return jsonify({'status': 'failure', 'message': 'Invalid file type. Only .jpg, .png, .gif are allowed.'}), 400


# @app.route("/weather_data", methods=["POST"])
# def weather_data():
#     # Ensure the request body is JSON
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data = request.get_json()
#     location = data.get("location")

#     if location and location.lower() == "baao":
#         response_data = {
#             "weatherData": {
#                 "todayDate": "June 14",
#                 "todayWeather": "Cloudy",
#                 "todayTemp": "22",
#                 "tomorrowDate": "June 13",
#                 "tomorrowWeather": "Thunder",
#                 "tomorrowTemp": "25",
#                 "lastDate": "June 12",
#                 "lastWeather": "Rain",
#                 "lastTemp": "23",
#                 "lastTwoDayDate": "June 11",
#                 "lastTwoDayWeather": "Sunny",
#                 "lastTwoDayTemp": "28"
#             },
#             "weatherLabel": {
#                 "lastDay" : "SSunday",
#                 "lastTwoDay": "SSaturday"
#             }
#         }
#         return jsonify(response_data), 200
#     else:
#         return jsonify({"error": "Location data not found or not supported"}), 404



# @app.route("/weather_data", methods=["POST"])
# def weather_data():
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data = request.get_json()
#     location = data.get("location")

#     if location and location.lower() == "baao":
#         try:
#             # Setup timezone
#             manila_tz = pytz.timezone("Asia/Manila")
#             now = datetime.now(manila_tz)

#             # Get dynamic dates
#             today = now
#             tomorrow = today + timedelta(days=1)
#             yesterday = today - timedelta(days=1)
#             two_days_ago = today - timedelta(days=2)

#             # Format dates
#             def format_day(dt):
#                 return dt.strftime("%A")

#             def format_date(dt):
#                 return dt.strftime("%B %d").lstrip("0").replace(" 0", " ")


#             # Normalize icon phrase
#             def normalize_phrase(phrase):
#                 phrase = phrase.lower()
#                 if "sun" in phrase:
#                     return "Sunny"
#                 elif "thunder" in phrase:
#                     return "Thunder"
#                 elif "rain" in phrase:
#                     return "Rain"
#                 elif "cloud" in phrase or "dreary" in phrase or "overcast" in phrase:
#                     return "Cloudy"
#                 else:
#                     return "Cloudy"  # default fallback

#             def f_to_c(f):
#                 return round((f - 32) * 5 / 9)

#             # Fetch AccuWeather 5-day forecast
#             api_key = os.environ.get("ACCUWEATHER_API_KEY")
#             location_key = "262585"  # Baao
#             accuweather_url = f"http://dataservice.accuweather.com/forecasts/v1/daily/5day/{location_key}?apikey={api_key}"
#             response = requests.get(accuweather_url)
#             response.raise_for_status()
#             forecast_data = response.json()["DailyForecasts"]

#             # Today and tomorrow forecasts
#             today_forecast = forecast_data[0]
#             tomorrow_forecast = forecast_data[1]

#             weatherData = {
#                 "todayDate": format_date(today),
#                 "todayWeather": normalize_phrase(forecast_data[0]["Day"]["IconPhrase"]),
#                 "todayTemp": str(f_to_c(forecast_data[0]["Temperature"]["Maximum"]["Value"])),

#                 "tomorrowDate": format_date(tomorrow),
#                 "tomorrowWeather": normalize_phrase(forecast_data[1]["Day"]["IconPhrase"]),
#                 "tomorrowTemp": str(f_to_c(forecast_data[1]["Temperature"]["Maximum"]["Value"])),

#                 "lastDate": format_date(today + timedelta(days=2)),  # Aug 31
#                 "lastWeather": normalize_phrase(forecast_data[2]["Day"]["IconPhrase"]),
#                 "lastTemp": str(f_to_c(forecast_data[2]["Temperature"]["Maximum"]["Value"])),

#                 "lastTwoDayDate": format_date(today + timedelta(days=3)),  # Sep 1
#                 "lastTwoDayWeather": normalize_phrase(forecast_data[3]["Day"]["IconPhrase"]),
#                 "lastTwoDayTemp": str(f_to_c(forecast_data[3]["Temperature"]["Maximum"]["Value"]))
#             }

#             weatherLabel = {
#                 "lastDay": format_day(today + timedelta(days=2)),       # SUNDAY
#                 "lastTwoDay": format_day(today + timedelta(days=3))     # MONDAY
#             }

#             return jsonify({
#                 "weatherData": weatherData,
#                 "weatherLabel": weatherLabel
#             }), 200

#         except Exception as e:
#             return jsonify({"error": f"Failed to fetch or process weather data: {str(e)}"}), 500

#     else:
#         return jsonify({"error": "Location data not found or not supported"}), 404



# @app.route('/forecast', methods=['POST']) # Changed to POST method
# def get_weather():
#     """
#     API endpoint to get weather data based on location.
#     It now expects a POST request with location in the JSON body.
#     If the location is 'baao', it returns a specific forecast.
#     Otherwise, it returns a message indicating no data.
#     """
#     # Get JSON data from the request body
#     data = request.json 
#     location = data.get('location') # Access 'location' from the JSON body

#     if location and location.lower() == 'baao':
#         # Return the specified forecast data for 'baao'
#         forecast_data = {
#             "outsideTemp": "23°C",
#             "outsideWeather": "Cloudy",
#             "windSpeed": "2Km/h",
#             "humidity": "62%",
#             "visibility": "2Km",
#         }
#         return jsonify({"forecastData": forecast_data})
#     else:
#         # Return a message for other locations or no location provided
#         return jsonify({"message": "No forecast data available for this location. Try 'baao'."}), 404


# @app.route('/forecast', methods=['POST'])
# def get_weather():
#     data = request.json 
#     location = data.get('location')

#     if location and location.lower() == 'baao':
#         try:
#             api_key = os.environ.get("ACCUWEATHER_API_KEY")
#             location_key = "262585"
#             url = f"http://dataservice.accuweather.com/currentconditions/v1/{location_key}?apikey={api_key}&details=true"
            
#             response = requests.get(url)
#             response.raise_for_status()
#             current = response.json()[0]

#             forecast_data = {
#                 "outsideTemp": f"{current['Temperature']['Metric']['Value']}°C",
#                 "outsideWeather": current['WeatherText'],
#                 "windSpeed": f"{current['Wind']['Speed']['Metric']['Value']} km/h",
#                 "humidity": f"{current['RelativeHumidity']}%",
#                 "visibility": f"{current['Visibility']['Metric']['Value']} km"
#             }

#             return jsonify({"forecastData": forecast_data})
        
#         except Exception as e:
#             return jsonify({"error": f"Failed to fetch forecast: {str(e)}"}), 500

#     else:
#         return jsonify({"message": "No forecast data available for this location. Try 'baao'."}), 404



@app.route("/update-weather", methods=["POST"])
def update_weather_data():
    try:
        if not is_mysql_available():
            return handle_mysql_error("MySQL not available")

        cursor = get_cursor()
        if not cursor:
            return handle_mysql_error("Unable to get MySQL cursor")

        # Timezone setup
        manila_tz = pytz.timezone("Asia/Manila")
        now = datetime.now(manila_tz)

        # Date helpers
        today = now
        tomorrow = today + timedelta(days=1)

        def format_day(dt):
            return dt.strftime("%A")

        def format_date(dt):
            return dt.strftime("%B %d").lstrip("0").replace(" 0", " ")

        def normalize_phrase(phrase):
            phrase = phrase.lower()
            if "sun" in phrase:
                return "Sunny"
            elif "thunder" in phrase:
                return "Thunder"
            elif "rain" in phrase:
                return "Rain"
            elif "cloud" in phrase or "dreary" in phrase or "overcast" in phrase:
                return "Cloudy"
            else:
                return "Cloudy"

        def f_to_c(f):
            return round((f - 32) * 5 / 9)

        # Fetch AccuWeather 5-day forecast
        api_key = os.environ.get("ACCUWEATHER_API_KEY")
        location_key = "262585"  # Baao
        accuweather_url = f"http://dataservice.accuweather.com/forecasts/v1/daily/5day/{location_key}?apikey={api_key}"
        response = requests.get(accuweather_url)
        response.raise_for_status()
        forecast_data = response.json()["DailyForecasts"]

        # Build weatherData and weatherLabel
        weatherData = {
            "todayDate": format_date(today),
            "todayWeather": normalize_phrase(forecast_data[0]["Day"]["IconPhrase"]),
            "todayTemp": str(f_to_c(forecast_data[0]["Temperature"]["Maximum"]["Value"])),

            "tomorrowDate": format_date(tomorrow),
            "tomorrowWeather": normalize_phrase(forecast_data[1]["Day"]["IconPhrase"]),
            "tomorrowTemp": str(f_to_c(forecast_data[1]["Temperature"]["Maximum"]["Value"])),

            "lastDate": format_date(today + timedelta(days=2)),
            "lastWeather": normalize_phrase(forecast_data[2]["Day"]["IconPhrase"]),
            "lastTemp": str(f_to_c(forecast_data[2]["Temperature"]["Maximum"]["Value"])),

            "lastTwoDayDate": format_date(today + timedelta(days=3)),
            "lastTwoDayWeather": normalize_phrase(forecast_data[3]["Day"]["IconPhrase"]),
            "lastTwoDayTemp": str(f_to_c(forecast_data[3]["Temperature"]["Maximum"]["Value"]))
        }

        weatherLabel = {
            "lastDay": format_day(today + timedelta(days=2)),
            "lastTwoDay": format_day(today + timedelta(days=3))
        }

        # Combine into one JSON
        full_weather_data = {
            "weatherData": weatherData,
            "weatherLabel": weatherLabel
        }

        # Update database
        uID = "oNhx5SjHE3BE"
        update_query = """
            UPDATE weather_data
            SET weatherData = %s
            WHERE uID = %s AND status = 'active';
        """
        cursor.execute(update_query, (json.dumps(full_weather_data), uID))
        db_connection.commit()

        return jsonify({
            "message": "weatherData updated successfully",
            "weatherData": full_weather_data
        }), 200

    except requests.RequestException as e:
        return jsonify({"error": f"Failed to fetch weather from AccuWeather: {str(e)}"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        if cursor:
            cursor.close()


@app.route('/update-forecast', methods=['POST'])
def update_forecast_data():
    try:
        if not is_mysql_available():
            return handle_mysql_error("MySQL not available")

        cursor = get_cursor()
        if not cursor:
            return handle_mysql_error("Unable to get MySQL cursor")

        # Fetch forecast from AccuWeather
        api_key = os.environ.get("ACCUWEATHER_API_KEY")
        location_key = "262585"  # Baao
        url = f"http://dataservice.accuweather.com/currentconditions/v1/{location_key}?apikey={api_key}&details=true"
        
        response = requests.get(url)
        response.raise_for_status()
        current = response.json()[0]

        # Extract data
        forecast_data = {
            "outsideTemp": f"{current['Temperature']['Metric']['Value']}°C",
            "outsideWeather": current['WeatherText'],
            "windSpeed": f"{current['Wind']['Speed']['Metric']['Value']} km/h",
            "humidity": f"{current['RelativeHumidity']}%",
            "visibility": f"{current['Visibility']['Metric']['Value']} km"
        }

        # Update database
        uID = "3xPTPsa6sglt"
        update_query = """
            UPDATE forecast_data
            SET forecastData = %s
            WHERE uID = %s AND status = 'active';
        """
        cursor.execute(update_query, (json.dumps(forecast_data), uID))
        db_connection.commit()

        return jsonify({"message": "forecastData updated successfully", "forecastData": forecast_data}), 200

    except requests.RequestException as e:
        return jsonify({"error": f"Failed to fetch forecast from AccuWeather: {str(e)}"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        if cursor:
            cursor.close()


@app.route("/weather_data", methods=["POST"])
def weather_data():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    location = data.get("location")

    if location and location.lower() == "baao":
        try:
            if not is_mysql_available():
                return handle_mysql_error("MySQL not available")

            cursor = get_cursor()
            if not cursor:
                return handle_mysql_error("Unable to get MySQL cursor")

            uID = "oNhx5SjHE3BE"
            select_query = "SELECT weatherData FROM weather_data WHERE uID = %s AND status = 'active';"
            cursor.execute(select_query, (uID,))
            result = cursor.fetchone()

            if result:
                weather_data_json = result[0]
                weather_data = json.loads(weather_data_json)
                return jsonify(weather_data), 200
            else:
                return jsonify({"error": "No weather data found for the specified uID."}), 404

        except mysql.connector.Error as e:
            return handle_mysql_error(e)

        finally:
            if cursor:
                cursor.close()
    else:
        return jsonify({"error": "Location data not found or not supported"}), 404


@app.route('/forecast', methods=['POST'])
def get_weather():
    try:
        if not is_mysql_available():
            return handle_mysql_error("MySQL not available")

        cursor = get_cursor()
        if not cursor:
            return handle_mysql_error("Unable to get MySQL cursor")

        uID = "3xPTPsa6sglt"
        select_query = "SELECT forecastData FROM forecast_data WHERE uID = %s AND status = 'active';"
        cursor.execute(select_query, (uID,))
        result = cursor.fetchone()

        if result:
            forecast_data_json = result[0]
            forecast_data = json.loads(forecast_data_json)  # Convert JSON string to dict
            return jsonify({"forecastData": forecast_data})
        else:
            return jsonify({"message": "No forecast data found for the specified uID."}), 404

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        if cursor:
            cursor.close()


@app.route('/accident-area')
def accident_area_data():
    accident_data = [
        {"brgy": "Buluang", "acc_2021": 27, "pct_2021": "22%", "acc_2022": 19, "pct_2022": "14%", "total": 46, "pct_total": "18%"},
        {"brgy": "Agdangan", "acc_2021": 9, "pct_2021": "7%", "acc_2022": 24, "pct_2022": "18%", "total": 33, "pct_total": "13%"},
        {"brgy": "San Isidro", "acc_2021": 6, "pct_2021": "5%", "acc_2022": 15, "pct_2022": "11%", "total": 21, "pct_total": "8%"},
        {"brgy": "Sta. Teresita", "acc_2021": 0, "pct_2021": "0%", "acc_2022": 20, "pct_2022": "15%", "total": 20, "pct_total": "8%"},
        {"brgy": "San Vicente", "acc_2021": 12, "pct_2021": "10%", "acc_2022": 5, "pct_2022": "4%", "total": 17, "pct_total": "7%"},
        {"brgy": "San Juan", "acc_2021": 1, "pct_2021": "1%", "acc_2022": 12, "pct_2022": "9%", "total": 13, "pct_total": "5%"},
        {"brgy": "San Nicolas", "acc_2021": 4, "pct_2021": "3%", "acc_2022": 8, "pct_2022": "6%", "total": 12, "pct_total": "5%"},
        {"brgy": "La Medalla", "acc_2021": 5, "pct_2021": "4%", "acc_2022": 7, "pct_2022": "5%", "total": 12, "pct_total": "5%"},
        {"brgy": "Sta. Cruz", "acc_2021": 2, "pct_2021": "2%", "acc_2022": 9, "pct_2022": "7%", "total": 11, "pct_total": "4%"},
        {"brgy": "San Jose", "acc_2021": 6, "pct_2021": "5%", "acc_2022": 1, "pct_2022": "1%", "total": 7, "pct_total": "3%"},
        {"brgy": "San Francisco", "acc_2021": 0, "pct_2021": "0%", "acc_2022": 5, "pct_2022": "4%", "total": 5, "pct_total": "2%"},
        {"brgy": "Sta. Teresita", "acc_2021": 4, "pct_2021": "3%", "acc_2022": 0, "pct_2022": "0%", "total": 4, "pct_total": "2%"},
        {"brgy": "Salvacion", "acc_2021": 2, "pct_2021": "2%", "acc_2022": 2, "pct_2022": "2%", "total": 4, "pct_total": "2%"},
        {"brgy": "Antipolo", "acc_2021": 1, "pct_2021": "1%", "acc_2022": 2, "pct_2022": "2%", "total": 3, "pct_total": "1%"},
        {"brgy": "Sagrada", "acc_2021": 2, "pct_2021": "2%", "acc_2022": 1, "pct_2022": "1%", "total": 3, "pct_total": "1%"},
        {"brgy": "San Ramon", "acc_2021": 1, "pct_2021": "1%", "acc_2022": 1, "pct_2022": "1%", "total": 2, "pct_total": "1%"},
        {"brgy": "Del Rosario", "acc_2021": 1, "pct_2021": "1%", "acc_2022": 1, "pct_2022": "1%", "total": 2, "pct_total": "1%"},
        {"brgy": "San Roque", "acc_2021": 1, "pct_2021": "1%", "acc_2022": 0, "pct_2022": "0%", "total": 1, "pct_total": "0%"},
        {"brgy": "Sta. Eulalia", "acc_2021": 1, "pct_2021": "1%", "acc_2022": 0, "pct_2022": "0%", "total": 1, "pct_total": "0%"},
        {"brgy": "Un-recorded Location", "acc_2021": 41, "pct_2021": "33%", "acc_2022": 0, "pct_2022": "0%", "total": 41, "pct_total": "16%"}
    ]

    grand_totals = {
        "acc_2021": 125,
        "acc_2022": 133,
        "total": 258
    }

    return jsonify({"data": accident_data, "grand_totals": grand_totals})


# @app.route('/chat', methods=['POST'])
# def chat():
#     try:
#         data = request.get_json()
#         message = data.get('message', '').lower()

#         # Simple rule-based reply
#         if message == 'hello':
#             response = 'This is a bot response.'
#         else:
#             response = "Sorry, I didn't understand that."

#         return jsonify({'reply': response})
#     except Exception as e:
#         return jsonify({'reply': f'Error: {str(e)}'}), 500
    

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()

        if not user_message:
            return jsonify({'reply': "No message received."}), 400

        # Call DeepSeek API
        response = openai.ChatCompletion.create(
            model="deepseek-chat",  # Or "deepseek-reasoner"
            messages=[
                # {"role": "system", "content": "You are a helpful assistant."},
                {
                    "role": "system",
                    "content": "You are a helpful assistant. Keep all your replies under 100 words and respond quickly."
                },
                {"role": "user", "content": user_message}
            ]
        )

        reply = response.choices[0].message.content.strip()
        return jsonify({'reply': reply})

    except Exception as e:
        return jsonify({'reply': f"Error: {str(e)}"}), 500



@app.route('/api/logout')
def logout():
    session.clear()
    return redirect(url_for('login_page'))


@app.route('/api/login', methods=['POST'])
def login_api():
    if not is_mysql_available():
        return handle_mysql_error("MySQL not available")
    
    cursor = get_cursor()
    if not cursor:
        return handle_mysql_error("Unable to get MySQL cursor")

    try:
        data = request.form  # Handles form data from the login page
        username = data.get('userName')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Missing credentials"}), 400

        # Hash password to compare with stored hash
        # password_hash = hashlib.sha256(password.encode()).hexdigest()
        password_hash = password

        # Query user
        query = """
            SELECT * FROM auth WHERE userName = %s AND passwordHash = %s AND status = 'active' LIMIT 1;
        """
        cursor.execute(query, (username, password_hash))
        user = cursor.fetchone()

        if user:
            # Store essential info in session
            session['user'] = {
                "id": user[0],
                "uID": user[1],
                "userName": user[9],
                "role": user[3],
                "email": user[5]
            }
            return redirect(url_for('dashboard'))  # Redirect to a protected page (example)
        else:
            flash("Invalid username or password", "danger")
            return redirect(url_for('login_page'))

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

    finally:
        cursor.close()


# @app.route('/dashboard')
# def dashboard_old():
#     if 'user' not in session:
#         return redirect(url_for('login_page'))
#     return f"Welcome, {session['user']['userName']}!"



@app.route('/page/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login_page'))
    
    # Pass the username to the template to personalize the page if needed
    return render_template('page/dashboard.html', username=session['user']['userName'])

@app.route('/page/login', methods=['GET'])
def login_page():
    return render_template('page/login.html')  


@app.route('/page-content/dashboard')
@login_required
def dashboard_sidepage():
    return render_template('page-content/dashboard.html', active_page='dashboard')


@app.route('/page-content/evacuation')
@login_required
def evacuation_sidepage():
    return render_template('page-content/evacuation.html', active_page='evacuation')


@app.route('/page-content/flooding')
@login_required
def flooding_sidepage():
    return render_template('page-content/flooding.html', active_page='flooding')


@app.route('/page-content/broadcast')
@login_required
def broadcast_sidepage():
    return render_template('page-content/broadcast.html', active_page='broadcast')

@app.route('/page-content/forecast')
@login_required
def forecast_sidepage():
    return render_template('page-content/forecast.html', active_page='forecast')

@app.route('/page-content/typhoon-forecast')
@login_required
def typhoon_forecast_sidepage():
    return render_template('page-content/typhoon-forecast.html', active_page='typhoon-forecast')


@app.route('/page-content/settings')
@login_required
def settings_sidepage():
    return render_template('page-content/settings.html', active_page='settings')

@app.route('/page-content/new-user')
@login_required
def new_user_sidepage():
    return render_template('page-content/new-user.html', active_page='new-user')



if __name__ == '__main__':
    app.run(debug=True)
