# Dentist Booking System
Dentist Booking System is a web-based application that manages dental center appointments, information and allow patient to book an appointment with many provided options for patients to choose from on the system.

<img src="https://github.com/light-tree/math-utils/blob/main/images/homescreen.jpg" style="
	width:50%;
	display: block;
    	margin-left: auto;
    	margin-right: auto;">
<br />

Contributors: 4



### Technologies

<img src="https://github.com/light-tree/math-utils/blob/main/images/technologies.jpg" style="
	width:50%;
	display: block;
    	margin-left: auto;
    	margin-right: auto;">



### Installation

1. Create database
   ```sh
   CREATE DATABASE dentist
   ```

2. Open Constant.java in folder back-end\src\main\java\com\rade\dentistbookingsystem and change value of ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER corresponding to yours from your Twilio account.
   ```sh
   public static final String ACCOUNT_SID = "YOUR_ACCOUNT_SID";
   public static final String AUTH_TOKEN = "YOUR_ AUTH_TOKEN";
   public static final String FROM_NUMBER = "YOUR_TWILIO_PHONE";
   ```

3. Run java project in folder back-end

4. Install NPM packages for 2 react project in 2 folder admin_and_staff and patient_and_guest in folder front-end
   ```sh
   npm install
   ```
   or
   ```sh
   npm install --force
   ```

5. Start NPM
   ```sh
   npm start
   ```

### Language Support
* Vietnamese for screens of customer (patient and guest)
* English for screens of staff and admin