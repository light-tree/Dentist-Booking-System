# Dentist Booking System
Dentist Booking System is a web-based application that manages dental center appointments, information and allow patient to book an appointment with many provided options for patients to choose from on the system.

<p align="center">
<img src="https://github.com/light-tree/Dentist-Booking-System/blob/main/images/homescreen.JPG" style="
	width:75%;
	display: block;">
</p>
<br />
<p align="center">
<img src="https://github.com/light-tree/Dentist-Booking-System/blob/main/images/servicescreen.JPG" style="
	width:75%;
	display: block;">
</p>
<br />



### Technologies

<p align="center">
<img src="https://raw.githubusercontent.com/light-tree/Dentist-Booking-System/main/images/technologies.JPG" style="
	width:75%;
	display: block;">
</p>



### Installation

1. Execute file data_script.sql

2. Download your credential json file on Google Cloud API, rename it to "credentials", put it in a folder with the same name and put that folder in C:\Users\YOUR_USER_FOLDER

3. Open ImageServiceImpl.java in folder back-end\src\main\java\com\rade\dentistbookingsystem\utils\image and change value of file path corresponding to your drive folder from your Drive.
   ```sh
   return googleDriveFileService.uploadFile(url, "YOUR_DRIVE_FOLDER", true);
   ```

4. Open Constant.java in folder back-end\src\main\java\com\rade\dentistbookingsystem and change value of ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER corresponding to yours from your Twilio account.
   ```sh
   public static final String ACCOUNT_SID = "YOUR_ACCOUNT_SID";
   public static final String AUTH_TOKEN = "YOUR_ AUTH_TOKEN";
   public static final String FROM_NUMBER = "YOUR_TWILIO_PHONE";
   ```

5. Run java project in folder back-end

6. Install NPM packages for 2 react project in 2 folder admin_and_staff and patient_and_guest in folder front-end
   ```sh
   npm install
   ```
   or
   ```sh
   npm install --force
   ```

7. Start NPM
   ```sh
   npm start
   ```



To log into the system, you can use the following account:

Admin account:
* 0987121963

Staff account:
* 0345741884
* 0345741885

Patient account:
* 0345741883
* 0973073310

With a common password of: 12345678

### Language Support
* Vietnamese for screens of customer (patient and guest)
* English for screens of staff and admin