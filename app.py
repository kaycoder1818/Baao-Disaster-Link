from flask import Flask, jsonify, request, render_template
# from dotenv import load_dotenv
import mysql.connector
import os
# from swagger.swaggerui import setup_swagger
import random
import string
from datetime import datetime
import pytz
from dotenv import load_dotenv  ## pip install python-dotenv
import openai  ## pip install openai==0.28.0

app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/static')

# Set up Swagger
# setup_swagger(app)

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

if __name__ == '__main__':
    app.run(debug=True)
