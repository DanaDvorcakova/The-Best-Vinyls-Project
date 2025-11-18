from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.secret_key = "supersecretkey"

# CONFIGURATIONS FOR UPLOAD #
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static/images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# DATABASE CONNECTION #
DB_FILE = os.path.join(BASE_DIR, 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# ROUTES #

# Index Page #
@app.route('/')
def index():
    conn = get_db_connection()
    genres = ['Rock', 'Pop', 'Jazz']
    records_by_genre = {genre: conn.execute(
        "SELECT * FROM records WHERE genre = ?", (genre,)
    ).fetchall() for genre in genres}
    conn.close()
    return render_template(
        'index.html',
        rock_records=records_by_genre.get('Rock', []),
        pop_records=records_by_genre.get('Pop', []),
        jazz_records=records_by_genre.get('Jazz', [])
    )

# Search Page #
@app.route('/search')
def search():
    query = request.args.get('q', '').lower()
    conn = get_db_connection()
    results = conn.execute(
        "SELECT * FROM records WHERE LOWER(title) LIKE ? OR LOWER(artist) LIKE ?",
        (f"%{query}%", f"%{query}%")
    ).fetchall()
    conn.close()
    return render_template('search_results.html', query=query, results=results)

# Record Page #
@app.route('/record/<int:record_id>')
def record_detail(record_id):
    conn = get_db_connection()
    record = conn.execute('SELECT * FROM records WHERE id = ?', (record_id,)).fetchone()
    conn.close()
    return render_template('record.html', record=record)

# Contact Page #
@app.route('/contact')
def contact():
    return render_template('contact.html')

# Shipping Page #
@app.route('/shipping')
def shipping():
    return render_template('shipping.html')


# USER AUTHENTICATION #

# Register Page #
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'])
        conn = get_db_connection()
        existing_user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        if existing_user:
            flash('Username already exists!')
            conn.close()
            return redirect(url_for('register'))
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
        conn.close()
        flash('Registration successful! Please log in')
        return redirect(url_for('login'))
    return render_template('register.html')

# Login Page #
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()
        if user and check_password_hash(user['password'], password):
            session['username'] = username
            flash('Login successful')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('Logged out successfully')
    return redirect(url_for('index'))


# CART FUNCTIONALITY #
@app.route('/cart')
def cart():
    cart_records = []
    total_price = 0
    if session.get('cart'):
        conn = get_db_connection()
        placeholders = ','.join('?' for _ in session['cart'])
        query = f'SELECT * FROM records WHERE id IN ({placeholders})'
        cart_records = conn.execute(query, tuple(session['cart'])).fetchall()
        conn.close()
        total_price = sum(record['price'] for record in cart_records)
    return render_template('cart.html', records=cart_records, total_price=total_price)

@app.route('/add_to_cart/<int:record_id>', methods=['POST'])
def add_to_cart(record_id):
    session.setdefault('cart', [])
    session['cart'].append(record_id)
    session.modified = True
    flash('Record added to cart!')
    return redirect(url_for('cart'))

@app.route('/remove_from_cart/<int:record_id>', methods=['POST'])
def remove_from_cart(record_id):
    if session.get('cart'):
        session['cart'] = [item for item in session['cart'] if item != record_id]
        session.modified = True

    total_price = 0
    if session.get('cart'):
        conn = get_db_connection()
        placeholders = ','.join('?' for _ in session['cart'])
        query = f'SELECT price FROM records WHERE id IN ({placeholders})'
        prices = conn.execute(query, tuple(session['cart'])).fetchall()
        conn.close()
        total_price = sum(p['price'] for p in prices)

    return jsonify({'success': True, 'total': total_price})

# ADMIN PANEL #
@app.route('/admin')
def admin():
    if session.get('username') != 'admin':
        flash('Access denied')
        return redirect(url_for('index'))
    conn = get_db_connection()
    records = conn.execute('SELECT * FROM records').fetchall()
    conn.close()
    return render_template('admin.html', records=records)

# Admin Add #
@app.route('/admin/add', methods=['GET', 'POST'])
def admin_add():
    if session.get('username') != 'admin':
        flash('Access denied')
        return redirect(url_for('index'))

    if request.method == 'POST':
        title = request.form['title']
        artist = request.form['artist']
        genre = request.form.get('genre')
        price = float(request.form['price'])
        description = request.form.get('description', '')

        image_file = request.files.get('image')
        image_path_input = request.form.get('image_path', '').strip()
        image_path = 'images/placeholder.jpg'  # default fallback

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(save_path)
            image_path = f'images/{filename}'
        elif image_path_input:
            image_path = image_path_input

        conn = get_db_connection()
        conn.execute(
            'INSERT INTO records (title, artist, genre, price, description, image) VALUES (?, ?, ?, ?, ?, ?)',
            (title, artist, genre, price, description, image_path)
        )
        conn.commit()
        conn.close()
        flash('Record added successfully')
        return redirect(url_for('admin'))

    return render_template('admin_add.html')

# Admin Edit #
@app.route('/admin/edit/<int:record_id>', methods=['GET', 'POST'])
def admin_edit(record_id):
    if session.get('username') != 'admin':
        flash('Access denied')
        return redirect(url_for('index'))

    conn = get_db_connection()
    record = conn.execute('SELECT * FROM records WHERE id = ?', (record_id,)).fetchone()

    if request.method == 'POST':
        title = request.form['title']
        artist = request.form['artist']
        genre = request.form.get('genre')
        price = float(request.form['price'])
        description = request.form.get('description', '')

        image_file = request.files.get('image')
        image_path_input = request.form.get('image_path', '').strip()
        image_path = record['image']  # keep old image by default

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(save_path)
            image_path = f'images/{filename}'
        elif image_path_input:
            image_path = image_path_input

        conn.execute(
            'UPDATE records SET title=?, artist=?, genre=?, price=?, description=?, image=? WHERE id=?',
            (title, artist, genre, price, description, image_path, record_id)
        )
        conn.commit()
        conn.close()
        flash('Record updated successfully')
        return redirect(url_for('admin'))

    conn.close()
    return render_template('admin_edit.html', record=record)

# Admin Delete #
@app.route('/admin/delete/<int:record_id>', methods=['POST'])
def admin_delete(record_id):
    if session.get('username') != 'admin':
        flash('Access denied')
        return redirect(url_for('index'))
    conn = get_db_connection()
    conn.execute('DELETE FROM records WHERE id = ?', (record_id,))
    conn.commit()
    conn.close()
    flash('Record deleted')
    return redirect(url_for('admin'))

# RUN THE APP #

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)


















