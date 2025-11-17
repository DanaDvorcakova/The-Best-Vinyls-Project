import sqlite3
from werkzeug.security import generate_password_hash
import os

# Path for the database file #
DB_FILE = os.path.join(os.path.dirname(__file__), 'database.db')

# Connect to the database (it will create it if it doesn't exist) #
conn = sqlite3.connect(DB_FILE)
c = conn.cursor()


# Create tables if they don't exist #
c.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
''')

c.execute('''
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    price TEXT NOT NULL
    image TEXT NOT NULL,
    description TEXT,
    genre TEXT NOT NULL
)
''')


# Add admin user if not exists #

admin_username = 'admin'
admin_password = 'admin123'

c.execute('SELECT * FROM users WHERE username = ?', (admin_username,))
if not c.fetchone():
    hashed_password = generate_password_hash(admin_password)
    c.execute('INSERT INTO users (username, password) VALUES (?, ?)',
              (admin_username, hashed_password))
    print(f"Admin user created: {admin_username} / {admin_password}")
else:
    print("Admin user already exists. Skipping creation.")




# Add sample records if table is empty #

c.execute('SELECT COUNT(*) FROM records')
if c.fetchone()[0] == 0:
    sample_records = [
        # ROCK
        ("Greatest Hits", "Queen", 39.99, "images/queen_greatest_hits.jpg", "The greatest hits album of Queen.", "Rock"),
        ("Nevermind", "Nirvana", 29.99, "images/Nirvana_Nevermind.jpg", "Classic 90s rock album by Nirvana.", "Rock"),
        ("Master of Puppets", "Metallica", 29.99, "images/Metallica_MP.jpg", "Legendary heavy metal album.", "Rock"),

        # POP
        ("Thriller", "Michael Jackson", 29.99, "images/michael_jackson_thriller.jpg", "The best-selling album of all time.", "Pop"),
        ("Future Nostalgia", "Dua Lipa", 27.99, "images/DuaLipa_FN.jpg", "Dua Lipa's 2020 album blending retro and modern sounds.", "Pop"),
        ("Speak Now (Taylor’s Version)", "Taylor Swift", 34.99, "images/TaylorSwift_SN.jpg", "Taylor Swift's third re-recorded album.", "Pop"),

        # JAZZ
        ("Blue Train", "John Coltrane", 33.99, "images/JohnC_BT.jpg", "Blue Train is a 1957 album by John Coltrane that is considered his first masterpiece and a landmark of the hard bop genre", "Jazz"),
    ]

    c.executemany('''
    INSERT INTO records (title, artist, price, image, description, genre)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', sample_records)
    print("Sample records added.")
else:
    print("Records table already has data. Skipping sample records.")


# Commit and close #

conn.commit()
conn.close()
print("Database initialization complete.")
