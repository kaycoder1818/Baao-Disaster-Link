from flask import Flask, jsonify, request, render_template
# from dotenv import load_dotenv
import mysql.connector
import os
# from swagger.swaggerui import setup_swagger
import random
import string
from datetime import datetime
import pytz


app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/static')

# Set up Swagger
# setup_swagger(app)

# Load environment variables from .env file
# load_dotenv()

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
@app.route('/create-table-users', methods=['GET'])
def create_users_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
        cursor = get_cursor()
        if cursor:
            # Check if table 'users' exists
            cursor.execute("SHOW TABLES LIKE 'users'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                cursor.close()
                return jsonify({"message": "Table 'users' already exists"}), 200
            else:
                # Define SQL query to create table if it doesn't exist
                sql_create_table = """
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    userId TEXT NOT NULL,
                    passwordHash TEXT NOT NULL,
                    fingerPrintId TEXT,
                    role TEXT,
                    groupId TEXT,
                    email TEXT,
                    lockerAssigned TEXT,
                    status TEXT,
                    token TEXT,
                    resetCode TEXT,
                    timestamp TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
                )
                """
                cursor.execute(sql_create_table)
                db_connection.commit()
                cursor.close()
                return jsonify({"message": "Table 'users' created successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)



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
    
@app.route("/weather_data", methods=["POST"])
def weather_data():
    # Ensure the request body is JSON
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    location = data.get("location")

    if location and location.lower() == "baao":
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
                "lastDay" : "Sunday",
                "lastTwoDay": "Saturday"
            }
        }
        return jsonify(response_data), 200
    else:
        return jsonify({"error": "Location data not found or not supported"}), 404


@app.route('/forecast', methods=['POST']) # Changed to POST method
def get_weather():
    """
    API endpoint to get weather data based on location.
    It now expects a POST request with location in the JSON body.
    If the location is 'baao', it returns a specific forecast.
    Otherwise, it returns a message indicating no data.
    """
    # Get JSON data from the request body
    data = request.json 
    location = data.get('location') # Access 'location' from the JSON body

    if location and location.lower() == 'baao':
        # Return the specified forecast data for 'baao'
        forecast_data = {
            "outsideTemp": "23°C",
            "outsideWeather": "Cloudy",
            "windSpeed": "2Km/h",
            "humidity": "62%",
            "visibility": "2Km",
        }
        return jsonify({"forecastData": forecast_data})
    else:
        # Return a message for other locations or no location provided
        return jsonify({"message": "No forecast data available for this location. Try 'baao'."}), 404

if __name__ == '__main__':
    app.run(debug=True)
