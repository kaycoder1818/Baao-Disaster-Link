from flask import Flask, jsonify, request, render_template
# from dotenv import load_dotenv
import mysql.connector
import os
from swagger.swaggerui import setup_swagger
import random
import string
from datetime import datetime, timedelta



app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/static')

# Set up Swagger
setup_swagger(app)

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


def get_connection():
    global db_connection
    
    if db_connection and db_connection.is_connected():
        return db_connection  # Return the existing connection if it's valid
    
    # If there is no connection or it's invalid, try to reconnect
    if reconnect_to_mysql():
        return db_connection
    else:
        return None
    
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



##✅ ------ create table users_recharge ---------------- ##
@app.route('/create-table-users-recharge', methods=['GET'])
def create_users_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check if table 'users_recharge' exists
            cursor.execute("SHOW TABLES LIKE 'users_recharge'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                cursor.close()
                return jsonify({"message": "Table 'users_recharge' already exists"}), 200
            else:
                # Define SQL query to create table if it doesn't exist
                sql_create_table = """
                CREATE TABLE users_recharge (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    uniqueId TEXT NOT NULL,
                    userName TEXT NOT NULL,
                    passwordHash TEXT NOT NULL,
                    role TEXT,
                    groupId TEXT,
                    email TEXT,
                    status TEXT,
                    token TEXT,
                    resetCode TEXT,
                    timestamp TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
                )
                """
                cursor.execute(sql_create_table)
                db_connection.commit()
                cursor.close()
                return jsonify({"message": "Table 'users_recharge' created successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

##✅ ------ create table profile_recharge ---------------- ##
@app.route('/create-table-profile-recharge', methods=['GET'])
def create_profile_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check if table 'profile_recharge' exists
            cursor.execute("SHOW TABLES LIKE 'profile_recharge'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                cursor.close()
                return jsonify({"message": "Table 'profile_recharge' already exists"}), 200
            else:
                # Define SQL query to create table if it doesn't exist
                sql_create_table = """
                CREATE TABLE profile_recharge (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    uniqueId TEXT NOT NULL,
                    firstName TEXT,
                    lastName TEXT,
                    suffix TEXT,
                    contactNumber TEXT,
                    email TEXT,
                    address TEXT,
                    birthday TEXT,
                    photoURL TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
                cursor.execute(sql_create_table)
                db_connection.commit()
                cursor.close()
                return jsonify({"message": "Table 'profile_recharge' created successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)


##✅ ------ create table store_recharge ---------------- ##
@app.route('/create-table-store-recharge', methods=['GET'])
def create_store_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check if table 'store_recharge' exists
            cursor.execute("SHOW TABLES LIKE 'store_recharge'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                cursor.close()
                return jsonify({"message": "Table 'store_recharge' already exists"}), 200
            else:
                # Define SQL query to create table if it doesn't exist
                sql_create_table = """
                CREATE TABLE store_recharge (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    uniqueId TEXT NOT NULL,
                    station1BottleCount TEXT,
                    station2BottleCount TEXT,
                    station3BottleCount TEXT,
                    rewardPoints TEXT,
                    TimeLeft TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
                cursor.execute(sql_create_table)
                db_connection.commit()
                cursor.close()
                return jsonify({"message": "Table 'store_recharge' created successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)


##✅ ------ create table station_recharge ---------------- ##
@app.route('/create-table-station-recharge', methods=['GET'])
def create_station_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check if table 'station_recharge' exists
            cursor.execute("SHOW TABLES LIKE 'station_recharge'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                cursor.close()
                return jsonify({"message": "Table 'station_recharge' already exists"}), 200
            else:
                # Define SQL query to create table if it doesn't exist
                sql_create_table = """
                CREATE TABLE station_recharge (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    uniqueId TEXT NOT NULL,
                    stationName TEXT,
                    stationStatus TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
                cursor.execute(sql_create_table)
                db_connection.commit()
                cursor.close()
                return jsonify({"message": "Table 'station_recharge' created successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)


##✅ ------ create table rewards_recharge ---------------- ##
@app.route('/create-table-rewards-recharge', methods=['GET'])
def create_rewards_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check if table 'rewards_recharge' exists
            cursor.execute("SHOW TABLES LIKE 'rewards_recharge'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                cursor.close()
                return jsonify({"message": "Table 'rewards_recharge' already exists"}), 200
            else:
                # Define SQL query to create table if it doesn't exist
                sql_create_table = """
                CREATE TABLE rewards_recharge (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    uniqueId TEXT NOT NULL,
                    rewardId TEXT,
                    rewardName TEXT,
                    rewardTime TEXT,
                    rewardCost TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
                cursor.execute(sql_create_table)
                db_connection.commit()
                cursor.close()
                return jsonify({"message": "Table 'rewards_recharge' created successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

##✅ ------ create table bottle_history_recharge ---------------- ##
@app.route('/create-table-bottle-history-recharge', methods=['GET'])
def create_bottle_history_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check if table 'bottle_history_recharge' exists
            cursor.execute("SHOW TABLES LIKE 'bottle_history_recharge'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                cursor.close()
                return jsonify({"message": "Table 'bottle_history_recharge' already exists"}), 200
            else:
                # Define SQL query to create table if it doesn't exist
                sql_create_table = """
                CREATE TABLE bottle_history_recharge (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    uniqueId TEXT NOT NULL,
                    bottleCount TEXT,
                    bottleNotes TEXT,
                    fromStation TEXT,
                    bottleStatus TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
                cursor.execute(sql_create_table)
                db_connection.commit()
                cursor.close()
                return jsonify({"message": "Table 'bottle_history_recharge' created successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)


##✅ ------ create table notification_recharge ---------------- ##
@app.route('/create-table-notification-recharge', methods=['GET'])
def create_notification_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check if table 'notification_recharge' exists
            cursor.execute("SHOW TABLES LIKE 'notification_recharge'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                cursor.close()
                return jsonify({"message": "Table 'notification_recharge' already exists"}), 200
            else:
                # Define SQL query to create table if it doesn't exist
                sql_create_table = """
                CREATE TABLE notification_recharge (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    uniqueId TEXT NOT NULL,
                    role TEXT,
                    status TEXT,
                    message TEXT,
                    priority TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
                cursor.execute(sql_create_table)
                db_connection.commit()
                cursor.close()
                return jsonify({"message": "Table 'notification_recharge' created successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)



##✅ ------ delete table users_recharge ---------------- ##
@app.route('/delete-table-users-recharge', methods=['GET'])
def delete_users_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Drop the 'users_recharge' table
            cursor.execute("DROP TABLE IF EXISTS users_recharge")
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Table 'users_recharge' deleted successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

##✅ ------ delete table profile_recharge ---------------- ##
@app.route('/delete-table-profile-recharge', methods=['GET'])
def delete_profile_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Drop the 'profile_recharge' table
            cursor.execute("DROP TABLE IF EXISTS profile_recharge")
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Table 'profile_recharge' deleted successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

##✅ ------ delete table store_recharge ---------------- ##
@app.route('/delete-table-store-recharge', methods=['GET'])
def delete_store_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Drop the 'store_recharge' table
            cursor.execute("DROP TABLE IF EXISTS store_recharge")
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Table 'store_recharge' deleted successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

##✅ ------ delete table station_recharge ---------------- ##
@app.route('/delete-table-station-recharge', methods=['GET'])
def delete_station_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Drop the 'station_recharge' table
            cursor.execute("DROP TABLE IF EXISTS station_recharge")
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Table 'station_recharge' deleted successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

##✅ ------ delete table rewards_recharge ---------------- ##
@app.route('/delete-table-rewards-recharge', methods=['GET'])
def delete_rewards_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Drop the 'rewards_recharge' table
            cursor.execute("DROP TABLE IF EXISTS rewards_recharge")
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Table 'rewards_recharge' deleted successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

##✅ ------ delete table bottle_history_recharge ---------------- ##
@app.route('/delete-table-bottle-history-recharge', methods=['GET'])
def delete_bottle_history_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Drop the 'bottle_history_recharge' table
            cursor.execute("DROP TABLE IF EXISTS bottle_history_recharge")
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Table 'bottle_history_recharge' deleted successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

##✅ ------ delete table notification_recharge ---------------- ##
@app.route('/delete-table-notification-recharge', methods=['GET'])
def delete_notification_recharge_table():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Drop the 'notification_recharge' table
            cursor.execute("DROP TABLE IF EXISTS notification_recharge")
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Table 'notification_recharge' deleted successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)


## ------ insert table ---------------- ##

@app.route('/insert-mockup-users-recharge', methods=['GET'])
def insert_mockup_users_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Insert mock data into 'users_recharge' table without the 'timestamp' field
            sql_insert = """
            INSERT INTO users_recharge (uniqueId, userName, passwordHash, role, groupId, email, status, token, resetCode)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            data = ('mockUniqueId', 'testname', 'testpassword', 'admin', 'group1', 'mockEmail@example.com', 'active', 'mockToken', 'mockResetCode')
            cursor.execute(sql_insert, data)
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Mock data inserted into 'users_recharge' table"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/insert-mockup-profile-recharge', methods=['GET'])
def insert_mockup_profile_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Insert mock data into 'profile_recharge' table
            sql_insert = """
            INSERT INTO profile_recharge (uniqueId, firstName, lastName, suffix, contactNumber, email, address, birthday, photoURL)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            data = ('mockUniqueId', 'John', 'Doe', 'Jr.', '1234567890', 'mockEmail@example.com', '123 Mock St.', '1990-01-01', 'http://example.com/photo.jpg')
            cursor.execute(sql_insert, data)
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Mock data inserted into 'profile_recharge' table"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/insert-mockup-station-recharge', methods=['GET'])
def insert_mockup_station_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Insert multiple mock data into 'station_recharge' table
            sql_insert = """
            INSERT INTO station_recharge (uniqueId, stationName, stationStatus)
            VALUES (%s, %s, %s)
            """
            data = [
                ('', 'Station1', 'active'),
                ('', 'Station2', 'active'),
                ('', 'Station3', 'active')
            ]
            cursor.executemany(sql_insert, data)
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Mock data inserted into 'station_recharge' table"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/insert-mockup-store-recharge', methods=['GET'])
def insert_mockup_store_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Insert mock data into 'store_recharge'
            sql_insert = """
                INSERT INTO store_recharge (
                    uniqueId, 
                    station1BottleCount, station2BottleCount, station3BottleCount,
                    rewardPoints,
                    TimeLeft
                ) VALUES (%s, %s, %s, %s, %s, %s)
            """
            data = (
                "1234",
                "10", "15", "20",  # bottle counts
                "5",     # points
                "00:06:00"  # time left
            )
            cursor.execute(sql_insert, data)
            db_connection.commit()
            cursor.close()

            return jsonify({"message": "Mock data inserted into 'store_recharge' table"}), 200

        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/insert-mockup-rewards-recharge', methods=['GET'])
def insert_mockup_rewards_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Insert mock data into 'rewards_recharge' table
            sql_insert = """
            INSERT INTO rewards_recharge (uniqueId, rewardId, rewardName, rewardTime, rewardCost)
            VALUES (%s, %s, %s, %s, %s)
            """
            data = ('1234', 'ADD15', 'Add 15 minutes', '15', "5")
            cursor.execute(sql_insert, data)
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Mock data inserted into 'rewards_recharge' table"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/insert-mockup-bottle-history-recharge', methods=['GET'])
def insert_mockup_bottle_history_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Insert mock data into 'bottle_history_recharge' table
            sql_insert = """
            INSERT INTO bottle_history_recharge (uniqueId, bottleCount, bottleNotes, fromStation, bottleStatus)
            VALUES (%s, %s, %s, %s, %s)
            """
            data = ('1234', '1', 'Recycled bottles', 'Station1', 'completed')
            cursor.execute(sql_insert, data)
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Mock data inserted into 'bottle_history_recharge' table"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/insert-mockup-notification-recharge', methods=['GET'])
def insert_mockup_notification_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Insert mock data into 'notification_recharge' table
            sql_insert = """
            INSERT INTO notification_recharge (uniqueId, role, status, message, priority)
            VALUES (%s, %s, %s, %s, %s)
            """
            data = ('1234', 'admin', 'unread', 'Bottle count low at Station 2', 'high')
            cursor.execute(sql_insert, data)
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Mock data inserted into 'notification_recharge' table"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

## ------ recharge routes ---------------- ##

@app.route('/auth/login/email', methods=['POST'])
def login_with_email():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        email = data.get('email')
        password_hash = data.get('passwordHash')

        if not email or not password_hash:
            return jsonify({"error": "Missing 'email' or 'passwordHash' in request body"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()



        if cursor:
            sql_query = """
            SELECT role, timestamp FROM users_recharge
            WHERE email = %s AND passwordHash = %s
            LIMIT 1
            """
            cursor.execute(sql_query, (email, password_hash))
            result = cursor.fetchone()
            cursor.close()

            if result:
                role, timestamp = result
                return jsonify({
                    "message": "Successful",
                    "role": role,
                    "timestamp": str(timestamp)
                }), 200
            else:
                return jsonify({"message": "Invalid email or password"}), 401
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)



def generate_unique_string(length=32):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_unique_value_for_column(cursor, column_name):
    while True:
        candidate = generate_unique_string()
        query = f"SELECT id FROM users_recharge WHERE {column_name} = %s LIMIT 1"
        cursor.execute(query, (candidate,))
        if not cursor.fetchone():
            return candidate

# Show all records from the 'users_recharge' table
@app.route('/user', methods=['GET'])
def get_users_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500
        
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()

        if cursor:
            # Fetch all records from the 'users_recharge' table
            cursor.execute("SELECT * FROM users_recharge")
            records = cursor.fetchall()

            # Check if there are records
            if records:
                users_list = []
                for record in records:
                    user = {
                        "id": record[0],
                        "uniqueId": record[1],
                        "userName": record[2],
                        "passwordHash": record[3],
                        "role": record[4],
                        "groupId": record[5],
                        "email": record[6],
                        "status": record[7],
                        "token": record[8],
                        "resetCode": record[9],
                        "timestamp": record[10]
                    }
                    users_list.append(user)

                cursor.close()
                return jsonify({"users_recharge": users_list}), 200
            else:
                cursor.close()
                return jsonify({"message": "No records found in 'users_recharge' table"}), 404
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

# @app.route('/user/add', methods=['POST'])
# def add_user_to_users_recharge():
#     try:
#         if not is_mysql_available():
#             return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

#         data = request.get_json()
#         userName = data.get('userName')
#         passwordHash = data.get('passwordHash')
#         role = data.get('role')
#         groupId = data.get('groupId')
#         email = data.get('email')
#         status = data.get('status')

#         if not userName or not passwordHash or not email:
#             return jsonify({"error": "Missing required fields: 'userName', 'passwordHash', or 'email'"}), 400

#                 # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
#         if cursor:
#             # Check for existing userName or email
#             cursor.execute("""
#                 SELECT id FROM users_recharge WHERE userName = %s OR email = %s LIMIT 1
#             """, (userName, email))
#             if cursor.fetchone():
#                 cursor.close()
#                 return jsonify({"error": "Username or email already exists"}), 409

#             # Generate unique values
#             unique_id = generate_unique_value_for_column(cursor, "uniqueId")
#             reset_code = generate_unique_value_for_column(cursor, "resetCode")
#             token = generate_unique_value_for_column(cursor, "token")

#             # Insert new user
#             insert_query = """
#             INSERT INTO users_recharge (uniqueId, userName, passwordHash, role, groupId, email, status, token, resetCode)
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             insert_data = (unique_id, userName, passwordHash, role, groupId, email, status, token, reset_code)
#             cursor.execute(insert_query, insert_data)
#             db_connection.commit()
#             cursor.close()

#             return jsonify({
#                 "message": "User created successfully",
#                 "uniqueId": unique_id,
#                 "token": token,
#                 "resetCode": reset_code
#             }), 201
#         else:
#             return jsonify({"error": "Database connection not available"}), 500

#     except mysql.connector.Error as e:
#         return handle_mysql_error(e)

@app.route('/user/add', methods=['POST'])
def add_user_to_users_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        userName = data.get('userName')
        passwordHash = data.get('passwordHash')
        role = data.get('role')
        groupId = data.get('groupId')
        email = data.get('email')
        status = data.get('status')

        if not userName or not passwordHash or not email:
            return jsonify({"error": "Missing required fields: 'userName', 'passwordHash', or 'email'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check for existing userName or email
            cursor.execute("""
                SELECT id FROM users_recharge WHERE userName = %s OR email = %s LIMIT 1
            """, (userName, email))
            if cursor.fetchone():
                cursor.close()
                return jsonify({"error": "Username or email already exists"}), 409

            # Generate unique values
            unique_id = generate_unique_value_for_column(cursor, "uniqueId")
            reset_code = generate_unique_value_for_column(cursor, "resetCode")
            token = generate_unique_value_for_column(cursor, "token")

            # Insert new user
            insert_query = """
            INSERT INTO users_recharge (uniqueId, userName, passwordHash, role, groupId, email, status, token, resetCode)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            insert_data = (unique_id, userName, passwordHash, role, groupId, email, status, token, reset_code)
            cursor.execute(insert_query, insert_data)
            db_connection.commit()

            # Insert a new record in the store_recharge table
            sql_insert_store = """
            INSERT INTO store_recharge (
                uniqueId, 
                station1BottleCount, station2BottleCount, station3BottleCount,
                rewardPoints,
                TimeLeft
            ) VALUES (%s, %s, %s, %s, %s, %s)
            """
            store_data = (
                unique_id,  # uniqueId from the user just created
                "0", "0", "0",  # bottle counts
                "0",  # points
                "00:00:00"  # time left
            )
            cursor.execute(sql_insert_store, store_data)
            db_connection.commit()
            cursor.close()

            return jsonify({
                "message": "User created successfully",
                "uniqueId": unique_id,
                "token": token,
                "resetCode": reset_code
            }), 201
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/edit', methods=['POST'])
def edit_user_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        # Get the request data
        data = request.get_json()
        new_email = data.get('new_email')
        user_name = data.get('userName')
        role = data.get('role')
        email = data.get('email')

        # Check if required fields are present
        if not all([new_email, user_name, role, email]):
            return jsonify({"error": "Missing required fields: 'new_email', 'userName', 'role', or 'email'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check if the user exists with the provided email
            cursor.execute("SELECT id FROM users_recharge WHERE email = %s LIMIT 1", (email,))
            user = cursor.fetchone()

            if not user:
                cursor.close()
                return jsonify({"error": "User not found with the provided email"}), 404

            # Update the user's details
            update_query = """
            UPDATE users_recharge
            SET email = %s, userName = %s, role = %s
            WHERE email = %s
            """
            cursor.execute(update_query, (new_email, user_name, role, email))
            db_connection.commit()
            cursor.close()

            return jsonify({"message": "User details updated successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

# @app.route('/user/delete', methods=['DELETE'])
# def delete_user_by_email():
#     try:
#         if not is_mysql_available():
#             return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

#         data = request.get_json()
#         email = data.get('email')

#         if not email:
#             return jsonify({"error": "Missing required field: 'email'"}), 400

#                 # Get a database connection and cursor
        # connection = get_connection()  # Get the MySQL connection
        # if connection is None:
        #     return jsonify({"error": "Failed to connect to the database"}), 500
        
        # cursor = connection.cursor()
#         if cursor:
#             # Check if user exists
#             cursor.execute("SELECT id FROM users_recharge WHERE email = %s LIMIT 1", (email,))
#             user = cursor.fetchone()

#             if not user:
#                 cursor.close()
#                 return jsonify({"error": "User not found with the provided email"}), 404

#             # Delete user
#             cursor.execute("DELETE FROM users_recharge WHERE email = %s", (email,))
#             db_connection.commit()
#             cursor.close()

#             return jsonify({"message": f"User with email '{email}' deleted successfully"}), 200
#         else:
#             return jsonify({"error": "Database connection not available"}), 500

#     except mysql.connector.Error as e:
#         return handle_mysql_error(e)

@app.route('/user/delete', methods=['DELETE'])
def delete_user_by_email():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Missing required field: 'email'"}), 400

        # Get a database connection
        connection = get_connection()
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500

        cursor = connection.cursor(dictionary=True)  # Use dictionary cursor to fetch column names
        if cursor:
            # Step 1: Check if user exists in users_recharge by email
            cursor.execute("SELECT id, uniqueId FROM users_recharge WHERE email = %s LIMIT 1", (email,))
            user = cursor.fetchone()

            if not user:
                cursor.close()
                return jsonify({"error": "User not found with the provided email"}), 404

            unique_id = user['uniqueId']

            # Step 2: Delete the user from users_recharge table by email
            cursor.execute("DELETE FROM users_recharge WHERE email = %s", (email,))
            connection.commit()

            # Step 3: Delete the corresponding record from store_recharge by uniqueId
            cursor.execute("DELETE FROM store_recharge WHERE uniqueId = %s", (unique_id,))
            connection.commit()

            cursor.close()

            return jsonify({"message": f"User with email '{email}' and related store_recharge record deleted successfully"}), 200
        else:
            return jsonify({"error": "Database cursor not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)



@app.route('/user/verify', methods=['GET'])
def verify_user_by_token():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        token = request.args.get('token')
        if not token:
            return jsonify({"error": "Missing required query parameter: 'token'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Check if user with the token exists
        cursor.execute("SELECT id FROM users_recharge WHERE token = %s", (token,))
        user = cursor.fetchone()

        if not user:
            cursor.close()
            return jsonify({"error": "Invalid or expired token"}), 404

        # Update user status to 'verified'
        cursor.execute("UPDATE users_recharge SET status = %s WHERE token = %s", ("verified", token))
        db_connection.commit()
        cursor.close()

        return jsonify({
            "message": "User successfully verified",
            "token": token
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/assign-machine', methods=['POST'])
def assign_station_to_user():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        email = data.get('email')
        station_name = data.get('stationName', 'Station1')  # Default to 'Station1'

        if not email:
            return jsonify({"error": "Missing required field: 'email'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Step 1: Find user's uniqueId by email
            cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s LIMIT 1", (email,))
            user = cursor.fetchone()

            if not user:
                cursor.close()
                return jsonify({"error": "User not found with the provided email"}), 404

            unique_id = user[0]

            # Step 2: Assign uniqueId to station by stationName
            cursor.execute("""
                UPDATE station_recharge
                SET uniqueId = %s
                WHERE stationName = %s
            """, (unique_id, station_name))
            db_connection.commit()

            if cursor.rowcount == 0:
                cursor.close()
                return jsonify({"error": f"No station found with the name '{station_name}'"}), 404

            cursor.close()
            return jsonify({
                "message": f"Station '{station_name}' assigned to user with email '{email}'",
                "uniqueId": unique_id
            }), 200

        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/clear-machine/all', methods=['GET'])
def clear_all_station_unique_ids():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Update all uniqueId fields to an empty string
            cursor.execute("UPDATE station_recharge SET uniqueId = ''")
            db_connection.commit()
            cursor.close()

            return jsonify({"message": "All station uniqueId values set to empty string"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/clear-machine/station-name', methods=['POST'])
def clear_unique_id_by_station_name():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        station_name = data.get('stationName')

        if not station_name:
            return jsonify({"error": "Missing required field: 'stationName'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Clear uniqueId for the specified stationName
            cursor.execute("UPDATE station_recharge SET uniqueId = '' WHERE stationName = %s", (station_name,))
            db_connection.commit()

            if cursor.rowcount == 0:
                cursor.close()
                return jsonify({"error": f"No station found with name '{station_name}'"}), 404

            cursor.close()
            return jsonify({"message": f"UniqueId cleared for station '{station_name}'"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/reset-password', methods=['POST'])
def reset_user_password_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        email = data.get('email')
        password_hash = data.get('passwordHash')
        reset_code = data.get('resetCode')
        new_password_hash = data.get('newPasswordHash')

        # Validate input
        if not all([email, password_hash, reset_code, new_password_hash]):
            return jsonify({"error": "Missing required fields"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Check if matching user exists
            check_query = """
            SELECT id FROM users_recharge
            WHERE email = %s AND passwordHash = %s AND resetCode = %s
            LIMIT 1
            """
            cursor.execute(check_query, (email, password_hash, reset_code))
            user = cursor.fetchone()

            if not user:
                cursor.close()
                return jsonify({"error": "Email, password, or reset code is incorrect"}), 401

            # Update the password
            update_query = """
            UPDATE users_recharge SET passwordHash = %s WHERE email = %s
            """
            cursor.execute(update_query, (new_password_hash, email))
            db_connection.commit()
            cursor.close()

            return jsonify({"message": "Password has been reset successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/reward-points/email', methods=['POST'])
def get_user_reward_points():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Missing 'email' in request body"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Step 1: Get uniqueId from users_recharge by email
            cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s LIMIT 1", (email,))
            user = cursor.fetchone()

            if not user:
                cursor.close()
                return jsonify({"error": "User not found with the provided email"}), 404

            unique_id = user[0]

            # Step 2: Get points from store_recharge by uniqueId
            cursor.execute("""
                SELECT station1Points, station2Points, station3Points
                FROM store_recharge WHERE uniqueId = %s LIMIT 1
            """, (unique_id,))
            store_record = cursor.fetchone()
            cursor.close()

            if not store_record:
                return jsonify({"error": "No store_recharge record found for this user"}), 404

            # Step 3: Sum the points (converting from TEXT to int)
            try:
                points = [int(p or 0) for p in store_record]  # handle None or empty string as 0
                total_points = sum(points)
            except ValueError:
                return jsonify({"error": "Invalid point values in database"}), 500

            return jsonify({
                "uniqueId": unique_id,
                "totalPoints": total_points
            }), 200

        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/redeem-rewards', methods=['POST'])
def redeem_rewards():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        email = data.get('email')
        reward_id = data.get('rewardId')

        if not email or not reward_id:
            return jsonify({"error": "Missing 'email' or 'rewardId'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from users_recharge by email
        cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s", (email,))
        user_row = cursor.fetchone()
        if not user_row:
            cursor.close()
            return jsonify({"error": "User not found"}), 404
        unique_id = user_row[0]

        # Step 2: Get rewardTime and rewardCost from rewards_recharge by rewardId
        cursor.execute("SELECT rewardTime, rewardCost FROM rewards_recharge WHERE rewardId = %s", (reward_id,))
        reward_row = cursor.fetchone()
        if not reward_row:
            cursor.close()
            return jsonify({"error": "Reward not found"}), 404
        reward_time_minutes = int(reward_row[0])
        reward_cost = int(reward_row[1])

        # Step 3: Update store_recharge
        cursor.execute("SELECT rewardPoints, TimeLeft FROM store_recharge WHERE uniqueId = %s", (unique_id,))
        store_row = cursor.fetchone()
        if not store_row:
            cursor.close()
            return jsonify({"error": "Store data not found for user"}), 404

        current_points = int(store_row[0])
        current_time_left = store_row[1]  # Expected format "HH:MM:SS"

        new_points = max(current_points - reward_cost, 0)

        # Convert current_time_left to timedelta
        h, m, s = map(int, current_time_left.split(':'))
        current_td = timedelta(hours=h, minutes=m, seconds=s)
        reward_td = timedelta(minutes=reward_time_minutes)
        new_time_left = current_td + reward_td

        # Format new time left to HH:MM:SS
        total_seconds = int(new_time_left.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        new_time_left_str = f"{hours:02}:{minutes:02}:{seconds:02}"

        # Update store_recharge
        cursor.execute("""
            UPDATE store_recharge 
            SET rewardPoints = %s, TimeLeft = %s 
            WHERE uniqueId = %s
        """, (new_points, new_time_left_str, unique_id))
        db_connection.commit()
        cursor.close()

        return jsonify({
            "message": "Reward redeemed successfully",
            "remainingPoints": new_points,
            "newTimeLeft": new_time_left_str
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/bottle-history', methods=['POST'])
def get_user_bottle_history():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Missing 'email' in request body"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from users_recharge by email
        cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s LIMIT 1", (email,))
        user = cursor.fetchone()

        if not user:
            cursor.close()
            return jsonify({"error": "User not found with the provided email"}), 404

        unique_id = user[0]

        # Step 2: Get bottle history records from bottle_history_recharge by uniqueId
        cursor.execute("""
            SELECT id, uniqueId, bottleCount, bottleNotes, fromStation, bottleStatus, timestamp
            FROM bottle_history_recharge
            WHERE uniqueId = %s
            ORDER BY timestamp DESC
        """, (unique_id,))
        records = cursor.fetchall()
        cursor.close()

        if not records:
            return jsonify({"message": "No bottle history records found"}), 404

        # Step 3: Format response
        history_list = []
        for record in records:
            entry = {
                "id": record[0],
                "uniqueId": record[1],
                "bottleCount": record[2],
                "bottleNotes": record[3],
                "fromStation": record[4],
                "bottleStatus": record[5],
                "timestamp": record[6].isoformat() if record[6] else None
            }
            history_list.append(entry)

        return jsonify({"bottleHistory": history_list}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/bottle-history/clear/by-email', methods=['POST'])
def clear_user_bottle_history():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Missing required field: 'email'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from users_recharge by email
        cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s", (email,))
        user_row = cursor.fetchone()

        if not user_row:
            cursor.close()
            return jsonify({"error": "User not found"}), 404

        unique_id = user_row[0]

        # Step 2: Delete all records from bottle_history_recharge by uniqueId
        cursor.execute("DELETE FROM bottle_history_recharge WHERE uniqueId = %s", (unique_id,))
        deleted_count = cursor.rowcount
        db_connection.commit()
        cursor.close()

        return jsonify({
            "message": f"{deleted_count} bottle history record(s) cleared for user",
            "email": email,
            "uniqueId": unique_id
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/bottle-history/clear-all', methods=['GET'])
def clear_all_bottle_history():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Delete all records from the bottle_history_recharge table
        cursor.execute("DELETE FROM bottle_history_recharge")
        deleted_count = cursor.rowcount
        db_connection.commit()
        cursor.close()

        return jsonify({
            "message": f"All bottle history records cleared ({deleted_count} record(s) deleted)"
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/leaderboard', methods=['GET'])
def get_user_leaderboard_last_7_days():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Timestamp for 7 days ago
        seven_days_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d %H:%M:%S')

        # Step 1: Aggregate total bottles per uniqueId over the last 7 days
        cursor.execute("""
            SELECT uniqueId,
                   SUM(COALESCE(CAST(station1BottleCount AS SIGNED), 0) +
                       COALESCE(CAST(station2BottleCount AS SIGNED), 0) +
                       COALESCE(CAST(station3BottleCount AS SIGNED), 0)) AS totalBottles
            FROM store_recharge
            WHERE timestamp >= %s
            GROUP BY uniqueId
        """, (seven_days_ago,))
        store_totals = cursor.fetchall()

        if not store_totals:
            cursor.close()
            return jsonify({"message": "No bottle activity found in the last 7 days"}), 404

        # Step 2: Map uniqueId to userName and email
        leaderboard = []
        for unique_id, total_bottles in store_totals:
            cursor.execute("SELECT userName, email FROM users_recharge WHERE uniqueId = %s LIMIT 1", (unique_id,))
            user = cursor.fetchone()
            if user:
                user_name, email = user
                leaderboard.append({
                    "uniqueId": unique_id,
                    "userName": user_name,
                    "email": email,
                    "totalBottles": total_bottles
                })

        cursor.close()

        # Step 3: Sort and get top 10
        leaderboard = sorted(leaderboard, key=lambda x: x['totalBottles'], reverse=True)[:10]

        return jsonify({"leaderboard": leaderboard}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)


@app.route('/user/timeleft', methods=['POST'])
def get_user_timeleft():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Missing required field: 'email'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from users_recharge by email
        cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s", (email,))
        user_row = cursor.fetchone()
        if not user_row:
            cursor.close()
            return jsonify({"error": "User not found"}), 404
        unique_id = user_row[0]

        # Step 2: Get TimeLeft from store_recharge by uniqueId
        cursor.execute("SELECT TimeLeft FROM store_recharge WHERE uniqueId = %s", (unique_id,))
        store_row = cursor.fetchone()
        cursor.close()
        if not store_row:
            return jsonify({"error": "Store data not found for user"}), 404

        time_left = store_row[0]

        return jsonify({
            "email": email,
            "uniqueId": unique_id,
            "TimeLeft": time_left
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/notification', methods=['POST'])
def get_user_notifications():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Missing required field: 'email'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from users_recharge by email
        cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s", (email,))
        user_row = cursor.fetchone()

        if not user_row:
            cursor.close()
            return jsonify({"error": "User not found"}), 404

        unique_id = user_row[0]

        # Step 2: Get all records from notification_recharge by uniqueId
        cursor.execute("SELECT * FROM notification_recharge WHERE uniqueId = %s", (unique_id,))
        notifications = cursor.fetchall()
        cursor.close()

        if not notifications:
            return jsonify({"message": "No notifications found for this user"}), 404

        notification_list = [{
            "id": n[0],
            "uniqueId": n[1],
            "role": n[2],
            "status": n[3],
            "message": n[4],
            "priority": n[5],
            "timestamp": n[6]
        } for n in notifications]

        return jsonify({
            "email": email,
            "uniqueId": unique_id,
            "notifications": notification_list
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/notification/clear-all', methods=['POST'])
def clear_user_notifications():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Missing required field: 'email'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from users_recharge by email
        cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s", (email,))
        user_row = cursor.fetchone()

        if not user_row:
            cursor.close()
            return jsonify({"error": "User not found"}), 404

        unique_id = user_row[0]

        # Step 2: Delete all records from notification_recharge by uniqueId
        cursor.execute("DELETE FROM notification_recharge WHERE uniqueId = %s", (unique_id,))
        deleted_count = cursor.rowcount
        db_connection.commit()
        cursor.close()

        return jsonify({
            "message": f"{deleted_count} notification(s) cleared for user",
            "email": email,
            "uniqueId": unique_id
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/user/notification/marked', methods=['POST'])
def mark_notification_as_read():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        email = data.get('email')
        notification_id = data.get('id')

        if not email or not notification_id:
            return jsonify({"error": "Missing required field: 'email' or 'id'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from users_recharge by email
        cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s", (email,))
        user_row = cursor.fetchone()

        if not user_row:
            cursor.close()
            return jsonify({"error": "User not found"}), 404

        unique_id = user_row[0]

        # Step 2: Update notification status to 'read'
        cursor.execute(
            "UPDATE notification_recharge SET status = %s WHERE uniqueId = %s AND id = %s",
            ("read", unique_id, notification_id)
        )
        db_connection.commit()
        updated_rows = cursor.rowcount
        cursor.close()

        if updated_rows == 0:
            return jsonify({"error": "Notification not found or already marked as read"}), 404

        return jsonify({
            "message": "Notification marked as read",
            "email": email,
            "uniqueId": unique_id,
            "notificationId": notification_id
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)


@app.route('/admin/total-bottles', methods=['GET'])
def get_total_bottles_all_users():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Fetch all station bottle counts
        cursor.execute("""
            SELECT station1BottleCount, station2BottleCount, station3BottleCount
            FROM store_recharge
        """)
        records = cursor.fetchall()
        cursor.close()

        total_bottles = 0

        for row in records:
            try:
                counts = [int(val or 0) for val in row]  # Handle NULLs and empty strings
                total_bottles += sum(counts)
            except ValueError:
                return jsonify({"error": "Invalid bottle count data format in database"}), 500

        return jsonify({
            "totalBottles": total_bottles
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/admin/reset-bottle-count', methods=['GET'])
def reset_all_bottle_counts():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Update all records to set bottle counts to "0"
        cursor.execute("""
            UPDATE store_recharge
            SET station1BottleCount = '0',
                station2BottleCount = '0',
                station3BottleCount = '0'
        """)
        db_connection.commit()
        cursor.close()

        return jsonify({"message": "All bottle counts have been reset to 0"}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/admin/set-state-machine', methods=['POST'])
def set_station_state_machine():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        station_name = data.get('stationName')
        station_status = data.get('stationStatus')

        if not station_name or not station_status:
            return jsonify({"error": "Missing required fields: 'stationName' or 'stationStatus'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Update the station status in station_recharge table
            update_query = """
            UPDATE station_recharge 
            SET stationStatus = %s 
            WHERE stationName = %s
            """
            cursor.execute(update_query, (station_status, station_name))
            db_connection.commit()

            if cursor.rowcount > 0:
                cursor.close()
                return jsonify({"message": f"Station '{station_name}' status updated to '{station_status}'"}), 200
            else:
                cursor.close()
                return jsonify({"error": f"Station '{station_name}' not found"}), 404
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/admin/station', methods=['GET'])
def get_all_stations():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Fetch all records from the 'station_recharge' table
            cursor.execute("SELECT * FROM station_recharge")
            records = cursor.fetchall()

            # Check if there are records
            if records:
                stations_list = []
                for record in records:
                    station = {
                        "id": record[0],
                        "uniqueId": record[1],
                        "stationName": record[2],
                        "stationStatus": record[3],
                        "timestamp": record[4]
                    }
                    stations_list.append(station)

                cursor.close()
                return jsonify({"stations": stations_list}), 200
            else:
                cursor.close()
                return jsonify({"message": "No records found in 'station_recharge' table"}), 404
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/admin/add-reward', methods=['POST'])
def add_reward():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()

        # Set default uniqueId to '1234' if not provided in the request
        uniqueId = data.get('uniqueId', '1234')

        # Validate input data
        if not data or not all(key in data for key in ['rewardId', 'rewardName', 'rewardTime', 'rewardCost']):
            return jsonify({"error": "Missing required fields"}), 400

        rewardId = data['rewardId']
        rewardName = data['rewardName']
        rewardTime = data['rewardTime']
        rewardCost = data['rewardCost']

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Insert the provided data into 'rewards_recharge' table
            sql_insert = """
            INSERT INTO rewards_recharge (uniqueId, rewardId, rewardName, rewardTime, rewardCost)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql_insert, (uniqueId, rewardId, rewardName, rewardTime, rewardCost))
            db_connection.commit()
            cursor.close()
            return jsonify({"message": "Reward added successfully"}), 200
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/admin/delete-reward/<int:id>', methods=['DELETE'])
def delete_reward(id):
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Delete the record from 'rewards_recharge' table where the ID matches
            sql_delete = """
            DELETE FROM rewards_recharge WHERE id = %s
            """
            cursor.execute(sql_delete, (id,))
            db_connection.commit()

            # Check if the record was deleted
            if cursor.rowcount > 0:
                cursor.close()
                return jsonify({"message": f"Reward with id {id} deleted successfully"}), 200
            else:
                cursor.close()
                return jsonify({"error": f"Reward with id {id} not found"}), 404
        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

## insert bottle without history
# @app.route('/esp/insert-bottle', methods=['POST'])
# def insert_bottle_from_station():
#     try:
#         if not is_mysql_available():
#             return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

#         data = request.get_json()
#         station_name = data.get('stationName')

#         if not station_name:
#             return jsonify({"error": "Missing required field: 'stationName'"}), 400

#                 # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
#         if cursor:
#             # Step 1: Get uniqueId by stationName
#             cursor.execute("SELECT uniqueId FROM station_recharge WHERE stationName = %s LIMIT 1", (station_name,))
#             result = cursor.fetchone()

#             if not result:
#                 cursor.close()
#                 return jsonify({"error": f"No station found with name '{station_name}'"}), 404

#             unique_id = result[0]

#             # Step 2: Determine the column to update
#             column_to_update = None
#             if station_name == "Station1":
#                 column_to_update = "station1BottleCount"
#             elif station_name == "Station2":
#                 column_to_update = "station2BottleCount"
#             elif station_name == "Station3":
#                 column_to_update = "station3BottleCount"
#             else:
#                 cursor.close()
#                 return jsonify({"error": f"Invalid station name: '{station_name}'"}), 400

#             # Step 3: Increment the correct bottle count and rewardPoints
#             update_query = f"""
#                 UPDATE store_recharge
#                 SET 
#                     {column_to_update} = CAST(COALESCE({column_to_update}, '0') AS UNSIGNED) + 1,
#                     rewardPoints = CAST(COALESCE(rewardPoints, '0') AS UNSIGNED) + 1
#                 WHERE uniqueId = %s
#             """
#             cursor.execute(update_query, (unique_id,))
#             db_connection.commit()

#             if cursor.rowcount == 0:
#                 cursor.close()
#                 return jsonify({"error": "No matching store record found for uniqueId"}), 404

#             cursor.close()
#             return jsonify({
#                 "message": f"1 bottle inserted into {station_name}, rewardPoints incremented",
#                 "stationName": station_name,
#                 "uniqueId": unique_id
#             }), 200
#         else:
#             return jsonify({"error": "Database connection not available"}), 500

#     except mysql.connector.Error as e:
#         return handle_mysql_error(e)

## insert bottle with history
@app.route('/esp/insert-bottle', methods=['POST'])
def insert_bottle_from_station():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding, please check the database service"}), 500

        data = request.get_json()
        station_name = data.get('stationName')

        if not station_name:
            return jsonify({"error": "Missing required field: 'stationName'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            # Step 1: Get uniqueId by stationName
            cursor.execute("SELECT uniqueId FROM station_recharge WHERE stationName = %s LIMIT 1", (station_name,))
            result = cursor.fetchone()

            if not result:
                cursor.close()
                return jsonify({"error": f"No station found with name '{station_name}'"}), 404

            unique_id = result[0]

            # Step 2: Determine the column to update
            column_to_update = None
            if station_name == "Station1":
                column_to_update = "station1BottleCount"
            elif station_name == "Station2":
                column_to_update = "station2BottleCount"
            elif station_name == "Station3":
                column_to_update = "station3BottleCount"
            else:
                cursor.close()
                return jsonify({"error": f"Invalid station name: '{station_name}'"}), 400

            # Step 3: Increment bottle count and rewardPoints
            update_query = f"""
                UPDATE store_recharge
                SET 
                    {column_to_update} = CAST(COALESCE({column_to_update}, '0') AS UNSIGNED) + 1,
                    rewardPoints = CAST(COALESCE(rewardPoints, '0') AS UNSIGNED) + 1
                WHERE uniqueId = %s
            """
            cursor.execute(update_query, (unique_id,))
            db_connection.commit()

            if cursor.rowcount == 0:
                cursor.close()
                return jsonify({"error": "No matching store record found for uniqueId"}), 404

            # Step 4: Insert bottle history
            history_insert_query = """
                INSERT INTO bottle_history_recharge (uniqueId, bottleCount, bottleNotes, fromStation, bottleStatus)
                VALUES (%s, %s, %s, %s, %s)
            """
            history_data = (unique_id, '1', 'Inserted via ESP', station_name, 'completed')
            cursor.execute(history_insert_query, history_data)
            db_connection.commit()

            cursor.close()
            return jsonify({
                "message": f"1 bottle inserted into {station_name}, rewardPoints incremented, history logged",
                "stationName": station_name,
                "uniqueId": unique_id
            }), 200

        else:
            return jsonify({"error": "Database connection not available"}), 500

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/esp/timeleft/query', methods=['POST'])
def query_station_timeleft():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        station_name = data.get('stationName')

        if not station_name:
            return jsonify({"error": "Missing required field: 'stationName'"}), 400

        cursor = get_cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId and stationStatus from station_recharge by stationName
        cursor.execute("SELECT uniqueId, stationStatus FROM station_recharge WHERE stationName = %s LIMIT 1", (station_name,))
        station_row = cursor.fetchone()

        if not station_row:
            cursor.close()
            return jsonify({"error": f"No station found with name '{station_name}'"}), 404

        unique_id, station_status = station_row

        # Step 2: Check if uniqueId is not empty and get timeLeft
        if unique_id:
            cursor.execute("SELECT TimeLeft FROM store_recharge WHERE uniqueId = %s", (unique_id,))
            store_row = cursor.fetchone()
            cursor.close()

            if store_row and store_row[0]:
                time_left = store_row[0]
            else:
                time_left = "00:00:00"
        else:
            cursor.close()
            time_left = "00:00:00"

        return jsonify({
            "timeleft": time_left,
            "stationStatus": station_status
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/esp/set-station-status', methods=['POST'])
def set_station_status():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        station_name = data.get('stationName')
        new_status = data.get('new_stationStatus')

        if not station_name or not new_status:
            return jsonify({"error": "Missing required fields: 'stationName' and/or 'new_stationStatus'"}), 400

        cursor = get_cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Check if the station exists
        cursor.execute("SELECT id FROM station_recharge WHERE stationName = %s LIMIT 1", (station_name,))
        station_row = cursor.fetchone()

        if not station_row:
            cursor.close()
            return jsonify({"error": f"No station found with name '{station_name}'"}), 404

        # Update stationStatus
        cursor.execute(
            "UPDATE station_recharge SET stationStatus = %s WHERE stationName = %s",
            (new_status, station_name)
        )
        db_connection.commit()
        cursor.close()

        return jsonify({"message": "OK"}), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)


# {
#   "stationName": "Station1",
#   "new_timeLeft": "01:30:00"
# }

@app.route('/esp/set-timeleft', methods=['POST'])
def set_timeleft_for_station():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        station_name = data.get('stationName')
        new_timeleft = data.get('new_timeLeft')

        if not station_name or not new_timeleft:
            return jsonify({"error": "Missing required fields: 'stationName' and/or 'new_timeLeft'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from station_recharge by stationName
        cursor.execute("SELECT uniqueId FROM station_recharge WHERE stationName = %s LIMIT 1", (station_name,))
        station_row = cursor.fetchone()
        if not station_row:
            cursor.close()
            return jsonify({"error": f"No station found with name '{station_name}'"}), 404

        unique_id = station_row[0]

        # Step 2: Check existence in store_recharge and update TimeLeft
        cursor.execute("SELECT id FROM store_recharge WHERE uniqueId = %s", (unique_id,))
        store_row = cursor.fetchone()
        if not store_row:
            cursor.close()
            return jsonify({"error": f"No store data found for uniqueId '{unique_id}'"}), 404

        cursor.execute(
            "UPDATE store_recharge SET TimeLeft = %s WHERE uniqueId = %s",
            (new_timeleft, unique_id)
        )
        db_connection.commit()
        cursor.close()

        # Step 3: Return response
        return jsonify({
            "message": "TimeLeft updated successfully",
            "stationName": station_name,
            "uniqueId": unique_id,
            "newTimeLeft": new_timeleft
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/esp/run/timeleft', methods=['POST'])
def reset_user_run_timeleft():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Missing required field: 'email'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from users_recharge by email
        cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s", (email,))
        user_row = cursor.fetchone()
        if not user_row:
            cursor.close()
            return jsonify({"error": "User not found"}), 404
        unique_id = user_row[0]

        # Step 2: Get TimeLeft from store_recharge by uniqueId
        cursor.execute("SELECT TimeLeft FROM store_recharge WHERE uniqueId = %s", (unique_id,))
        store_row = cursor.fetchone()
        if not store_row:
            cursor.close()
            return jsonify({"error": "Store data not found for user"}), 404
        original_time_left = store_row[0]

        # Step 3: Set TimeLeft to "00:00:00"
        cursor.execute(
            "UPDATE store_recharge SET TimeLeft = %s WHERE uniqueId = %s",
            ("00:00:00", unique_id)
        )
        db_connection.commit()
        cursor.close()

        return jsonify({
            "message": "TimeLeft has been reset to 00:00:00",
            "email": email,
            "uniqueId": unique_id,
            "previousTimeLeft": original_time_left,
            "newTimeLeft": "00:00:00"
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/esp/check/timeleft', methods=['POST'])
def get_user_check_timeleft():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500

        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Missing required field: 'email'"}), 400

                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if not cursor:
            return jsonify({"error": "Database connection not available"}), 500

        # Step 1: Get uniqueId from users_recharge by email
        cursor.execute("SELECT uniqueId FROM users_recharge WHERE email = %s", (email,))
        user_row = cursor.fetchone()
        if not user_row:
            cursor.close()
            return jsonify({"error": "User not found"}), 404
        unique_id = user_row[0]

        # Step 2: Get TimeLeft from store_recharge by uniqueId
        cursor.execute("SELECT TimeLeft FROM store_recharge WHERE uniqueId = %s", (unique_id,))
        store_row = cursor.fetchone()
        cursor.close()
        if not store_row:
            return jsonify({"error": "Store data not found for user"}), 404

        time_left = store_row[0]

        return jsonify({
            "email": email,
            "uniqueId": unique_id,
            "TimeLeft": time_left
        }), 200

    except mysql.connector.Error as e:
        return handle_mysql_error(e)


@app.route('/table/recharge/users', methods=['GET'])
def show_users_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            cursor.execute("SELECT * FROM users_recharge")
            records = cursor.fetchall()
            users_list = [{
                "id": r[0], "uniqueId": r[1], "userName": r[2], "passwordHash": r[3],
                "role": r[4], "groupId": r[5], "email": r[6], "status": r[7],
                "token": r[8], "resetCode": r[9], "timestamp": r[10]
            } for r in records]
            cursor.close()
            return jsonify({"users_recharge": users_list}), 200 if users_list else 404
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/table/recharge/profile', methods=['GET'])
def show_profile_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            cursor.execute("SELECT * FROM profile_recharge")
            records = cursor.fetchall()
            profile_list = [{
                "id": r[0], "uniqueId": r[1], "firstName": r[2], "lastName": r[3],
                "suffix": r[4], "contactNumber": r[5], "email": r[6], "address": r[7],
                "birthday": r[8], "photoURL": r[9], "timestamp": r[10]
            } for r in records]
            cursor.close()
            return jsonify({"profile_recharge": profile_list}), 200 if profile_list else 404
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/table/recharge/station', methods=['GET'])
def show_station_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            cursor.execute("SELECT * FROM station_recharge")
            records = cursor.fetchall()
            station_list = [{
                "id": r[0], "uniqueId": r[1], "stationName": r[2],
                "stationStatus": r[3], "timestamp": r[4]
            } for r in records]
            cursor.close()
            return jsonify({"station_recharge": station_list}), 200 if station_list else 404
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/table/recharge/store', methods=['GET'])
def show_store_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            cursor.execute("SELECT * FROM store_recharge")
            records = cursor.fetchall()
            store_list = [{
                "id": r[0], "uniqueId": r[1], "station1BottleCount": r[2],
                "station2BottleCount": r[3], "station3BottleCount": r[4],
                "rewardPoints": r[5], "TimeLeft": r[6], "timestamp": r[7]
            } for r in records]
            cursor.close()
            return jsonify({"store_recharge": store_list}), 200 if store_list else 404
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/table/recharge/rewards', methods=['GET'])
def show_rewards_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            cursor.execute("SELECT * FROM rewards_recharge")
            records = cursor.fetchall()
            reward_list = [{
                "id": r[0], "uniqueId": r[1], "rewardId": r[2],
                "rewardName": r[3], "rewardTime": r[4],
                "rewardCost": r[5], "timestamp": r[6]
            } for r in records]
            cursor.close()
            return jsonify({"rewards_recharge": reward_list}), 200 if reward_list else 404
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/table/recharge/bottle-history', methods=['GET'])
def show_bottle_history_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            cursor.execute("SELECT * FROM bottle_history_recharge")
            records = cursor.fetchall()
            bottle_list = [{
                "id": r[0], "uniqueId": r[1], "bottleCount": r[2],
                "bottleNotes": r[3], "fromStation": r[4],
                "bottleStatus": r[5], "timestamp": r[6]
            } for r in records]
            cursor.close()
            return jsonify({"bottle_history_recharge": bottle_list}), 200 if bottle_list else 404
    except mysql.connector.Error as e:
        return handle_mysql_error(e)

@app.route('/table/recharge/notification', methods=['GET'])
def show_notification_recharge():
    try:
        if not is_mysql_available():
            return jsonify({"error": "MySQL database not responding"}), 500
                # Get a database connection and cursor
        connection = get_connection()  # Get the MySQL connection
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500
        
        cursor = connection.cursor()
        if cursor:
            cursor.execute("SELECT * FROM notification_recharge")
            records = cursor.fetchall()
            notification_list = [{
                "id": r[0], "uniqueId": r[1], "role": r[2],
                "status": r[3], "message": r[4],
                "priority": r[5], "timestamp": r[6]
            } for r in records]
            cursor.close()
            return jsonify({"notification_recharge": notification_list}), 200 if notification_list else 404
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
        # return jsonify({"message": "Welcome to the BaaoDisasterLink API"})
        # Render the HTML template for the /ui route
        return render_template("index.html")

# @app.route('/', methods=['GET'])
# def index():
#     return jsonify({"message": "Welcome to the BaaoDisasterLink API"})


# @app.route("/ui")
# def ui():
#     # Render the HTML template for the /ui route
#     return render_template("index.html")

# @app.route("/history")
# def history():
#     # Render the HTML template for the /history route
#     return render_template("history.html")

# @app.route("/history-preview")
# def history_preview():
#     # Render the HTML template for the /history route
#     return render_template("history-preview.html")


@app.route("/user-dashboard")
def user_dashboard_page():
    return render_template("user_dashboard.html")

@app.route("/register")
def register_page():
    return render_template("register.html")

@app.route("/history")
def history_page():
    return render_template("history.html")

@app.route("/rewards")
def rewards_page():
    return render_template("rewards.html")

@app.route("/leaderboards")
def leaderboards_page():
    return render_template("leaderboards.html")


@app.route("/admin-dashboard")
def admin_dashboard_page():
    return render_template("admin_dashboard.html")

@app.route("/superadmin-dashboard")
def superadmin_dashboard_page():
    return render_template("superadmin_dashboard.html")




if __name__ == '__main__':
    app.run(debug=True)