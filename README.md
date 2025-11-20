# The-Best-Vinyls-Project
An Online Shop for Vinyl Lovers

Author: Dana Dvorcakova
Date:   22/11/2025
Link:   https://the-best-vinyls-project.onrender.com

Project Concept:

This is a Flask web application for vinyl and music lovers. It includes a SQLite database, HTML templates, and static files (CSS/JS/images). The app is deployed on Render.com.
The main goal of this website is to create a user-friendly online platform where music lovers can browse, discover, and purchase vinyl records with ease. The platform will offer a selection of vinyls and deliver a seamless shopping experience designed for both casual buyers and dedicated collectors.
This website combines practical design with quality content, blending functionality and elegance to modernize the online shopping experience. By focusing on user-friendly navigation, clean aesthetics, and personalized features, the platform will allow customers to find and purchase vinyls efficiently and from the comfort of their homes.
“The Best Vinyls” website aims to meet the needs of vinyl collectors, music enthusiasts, and everyday consumers. All while providing a safe, accessible, and enjoyable shopping experience by prioritising usability and a curated selection. The platform will not only facilitate purchases but also foster a community of music lovers who value quality, discovery, and connection

Target Audience:

People who value sound quality, analog warmth, and collect records.
Young Adults Re-discovering Vinyl.
DJs & Producers looking for unique sound and physical mixing experience.
Individuals buying vinyl as gifts for friends and family.


Project Structure 

The website will provide a clear, simple, and responsive user experience. Below is the outline of key pages, sections, and navigation.

Main Navigation Menu:
1. Home
2. Login
3. Register
4. Contact Us
5. Shipping

Main Navigation Menu after Login as Admin:
1. Home
2. Admin
3. Cart
4. Logout (Admin)
5. Contact Us
6. Shipping

Main Navigation Menu after Login as User:
1. Home
2. Cart
3. Logout (Name)
4. Contact Us
5. Shipping


Page Breakdown:

1.	Home Page – index.html/base.html
Promo Banner:
•	Moving Discount, Sales, Rewards messages
	Header: 
•	Logo and Company Name on the left
•	Navigation Bar - menu on the top right that brings the user to the sections and websites
•	Currency Dropdown – Customer can change currency, and the currency will update through all pages that shows currency
•	Search Bar - rotating placeholder, when customers enter band/artist, click on search icon and it brings them to search_results.html page
 	Typewriter Section:
•	Welcoming message
 	Slideshow Section: 
•	An automated slideshow showing images and captures
Main Section:  
•	It reveals on scroll down
•	The main section is divided into 3 parts according to genre (rock, pop, jazz). Each genre can be scrolled on carousel by click on arrow 
•	It shows the record cards, each card displays the discount label, image, title, price, view button and add to cart button. User can click on any of these features, and they bring user to the page with more details. By clicking on Add to Cart, it brings user to the Cart page
Footer:
•	Copyright, the Company name, Social Media links, Contact link and Navigation links
Top button: 
•	By clicking, it brings user to the top of the page

2.	Login Page – login.html
Promo Banner, Header, Top button and Footer as in Home Page (base.html)
Main Section: 
•	Login Form for customer to log in with name and passwords
•	Register link if the customer is not registered yet. 
•	If the field is not fill out, there is an error message displayed.  
Note: Customer has to register/login if wants to see the cart.

3.	Register Page – register.html
Promo Banner, Header, Top button and Footer as in Home Page (base.html)
Main Section: 
•	Form for customer registration with name and passwords
•	Login link if the customer is already registered.
•	If the field is not fill out, there is an error message displayed.  
Note: Customer has to register/login if wants to see the cart.

4.	Admin Page – admin.html
Promo Banner, Header, Top button and Footer as in Home Page (base.html)
Main section: 
•	Database for admin - log in for admin is username: admin and password: admin123
•	Displayed all records - albums that are in shop now. Each record has unique ID, and the other info such as image, title, artist, genre, price, description are displayed with each record
•	There are 3 actions button for Admin to add, edit and delete record
o	Add New Record button – brings admin to admin_add page 
o	Edit button – brings admin to admin_edit page
o	Delete button – on click, the record is delete

5.	Admin Add Page – admin_add.html

Promo Banner, Header, Top button and Footer as in Home Page (base.html)

Main Section: 

•	Form where admin can add title, artist, select genre from dropdown menu, price, description and add image by choosing from file or by entering image path. If the field is not fill out, there is an error message displayed.  
Each record has unique ID and it is submitted by clicking Add Record button. The new record is added to the database.


6.	Admin Edit Page – admin_edit.html

Promo Banner, Header, Top button and Footer as in Home Page (base.html)

Main Section: 

•	Form where admin can edit title, artist, genre, price, description and image. It is submitted by clicking Save Changes button. The record is changed in database.

7.	Cart Page – cart.html

Note: User can reach the Cart page by 4 different ways, by clicking on:
•	Cart nav in header
•	Adding to the cart on home page
•	Adding on record page
•	From the search results page

Promo Banner, Header, Top button and Footer as in Home Page (base.html)

Main Section:

•	The cart is displayed image, title, artist and price and quantity control with option to increase or decrease the number of each record. The price is calculated based on quantity and it can be changed based on the currency.
•	There are 3 different prices, the “Price” for single item, and “Total” for the number of items for each record and “Total Price” for all records in the cart, placed at the bottom of the page 
•	Remove button to remove the record from the cart
•	Proceed to Checkout button that is only placeholder at the moment
•	Back to Shop button that brings user back to the Shop/Home page


8.	Contact Us Page – contact.html

Promo Banner, Header, Top button and Footer as in Home Page (base.html)

Main Section:

•	Form for customer to leave any message/feedback
•	Information box with address, phone, email link and link to social media. There is an image of map with the link to the google map

9.	Shipping Page – shipping.html

Promo Banner, Header, Top button and Footer as in Home Page (base.html)

Main Section:

•	Page displaying information about shipping and delivery
	

10.	Search Results Page – search_results.html

Promo Banner, Header, Top button and Footer as in Home Page (base.html)

Main Section:

•	Shows the result from the search bar in the record card displaying image, title, artist and price, all of these are also links to the record.html page
•	The message displayed if the search items is not in the shop
•	Add to Cart button bring user to the Cart
•	Back to Shop button that brings user back to the Shop/Home page


11.	Record Page – record.html

Note: User can reach the Record page by clicking on any feature displayed on the cart on Home page or from the Search page

Promo Banner, Header, Top button and Footer as in Home Page (base.html)

Main Section:

•	Shows the detailed information about the record (album) including description
•	User can click on image or link View Image that open modal and shows larger image, by clicking on X the modal closes
•	Add to Cart button bring user to the Cart
•	Back to Shop button that brings user back to the Shop/Home page

Note: base.html - the main layout template that defines the common structure of this website. 
•	header / logo
•	navigation bar
•	footer
•	sidebar
•	meta tags
•	CSS links
•	JavaScript 



Interactive Elements Used:

1.	Sticky Navigation:
The menu stays in place as user scroll down the page

2.	Hover Effects

3.	Animations and Transitions:
Carousel – picture carousel that supports automatic sliding
Typewriter effect – visual animation that simulates the appearance of text being typed out 
Scroll triggered animation – reveal content that occur as a user scroll through a webpage
Modals – enlarge the images with fade
Cart calculation with the price animation
Remove button with animation

4.	Search Bar:
Search bar with the rotating placeholder. Allow users to search content by keywords or categories

5.	Hamburger Button:
On Mobile version – when clicked, the button reveals a previously hidden menu. Toggle between ☰ and ✖

6.	Calculations:
User can add products to the cart, can add or remove quantity and can see the price for each product and total price

7.	Currency Dropdown:
User can change the currency, and the currency and exchange rate are updated on all pages

8.	Role-based Access
Admin vs regular users, restricting certain actions to admins

9.	File Uploads
Allow admin to upload images

10.	 Flash Messages
Messages when register, log in or log out, or when adding or editing etc. 
(e.g. “Registration successful! Please log in”)

11.	 Back to Top Button

12.	 Database Relationships

13.	 User Accounts & Authentication
Sign up, login, logout

14.	Responsive Design
Ensure the site looks good on mobile, tablet, and desktop



Technologies Used:

Python
Flask
Database - sqlite3
HTML5
CSS
JavaScript 


List of sources

Images – google.com
Logo and the other icons – google.com
Udemy
YouTube

Instructions on how to deploy and access the web app on Render.com

1.	Go to https://render.com and create an account
2.	Sign up or log in
3.	Push the project to a GitHub repository
4.	On Render, click New + → Web Service
5.	Choose Build from a Git Repository and select your repos
6.	Fill in the service details:
•	Environment: Python
•	Build Command: pip install -r requirements.txt
•	Start Command: gunicorn app:app
7.	Click Deploy
8.	After deployment completes, Render will generate a public URL: 
https://the-best-vinyls-project.onrender.com


Folder structure:

The-Best-Vinyls-Project/
│
├ app.py - main Flask app
├ init_db.py - database initialization script
├ requirements.txt - Python dependencies
├ Procfile - deployment start command           
├ README.md - project description and instructions
├ database.db - SQLite (sqlite3) database   
├ .gitignore - excludes unnecessary files  (.venv/, __pycache__)
│
├ static/ - static files (CSS, JS, images)             
│   ├css/
│   ├js/
│   ├images/
└── templates/ - HTML templates


Setup and Installation instructions

1. Clone the repository:
   git clone </MyCode/The-Best-Vinyls-Project/repos/The-Best-Vinyls-Project (main)>
   cd your-project

2. Create a virtual environment:
python -m venv .venv
source On Windows: .venv\Scripts\activate

3. Install dependencies:
pip install -r requirements.txt

4. Initialize the database:
python init_db.py

5. Run the app locally:
py app.py
