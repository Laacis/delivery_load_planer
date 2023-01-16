# Delivery Load Planner
### Video Presentation
Watch the video presentation on YouTube:
[![Video Presentation](https://t3.ftcdn.net/jpg/03/00/38/90/360_F_300389025_b5hgHpjDprTySl8loTqJRMipySb1rO0I.jpg)](https://youtu.be/VXd0DX1oZv8)

is a final project for [webCS50](https://cs50.harvard.edu/web/2020/ "webCS50 Home") by Jurijs V. "Laacis". Developed from 23.10. - 17.12.2022.
## What is it about?
This is first of all a final project for [webCS50](https://cs50.harvard.edu/web/2020/ "webCS50 Home").
The idea of building a Tour planner that generates loading list for the Reefer/Truck and would be available for Driver on mobile or any other device, came from real world as I work in logistics and transportation of temperature controlled goods. We often have issues with that the peson who is planing the loading list has to know a lot about the Tour and delivery plan. And when this person is sick or this task is given to somebody else, who is not as experienced, then the loading time and delivery time grow significantyly. It depends on losts of factors, that have to be taken in accouning. 
I had to make a research on how this is working, combining it with ideas of how I would do it, if I had to design such solution.
Actually my project could be even more complex, but I really wanted to finish it before New Year of 2023.  I'll talk later about how could this project could evolve. But for now let's focus on how it became, what it's now.  
First of all I encourage nobody to use this product at this point, I tried to make it as secure as I could, but there's always room for improvement. More about security and what API checks, a bit later.  
What does this product do? It's a platform that takes lost of information to register, that is controlled bu user with status **Planner**. Other users are either **Drivers** or not verified as driver users. More about users in the User section. Planner has the responsibility to verify Drivers, register Trucks, Customer destination address and Delivery plans, as the most important registring the Tour for every delivery. **Tour** is driving plan for the driver, who is starting at base warehouse and goes through all the delivery points, delivering planned amount of pallets to each customer, normally the number of deliveries per Tour is 2-5, but it can happen to be way more. It's seldom that we have to deliver one pallet per customer. 
After registring a Tour, it's displayed on the Drivers page, for selected date aswell as on the Tour Planning page for the Planner. Details if the Tour, have a separate page, that display details, Loading schema of the Truck and Delivery order, delivery time, type and number of pallets for every custommer on the list. What's special about it? The loading plan schema is made by code that try two different ways of loading:
1. It fills the reefer with pallets in reverse order, watching that Frozen goods and Chilled/Dry goods are placed in right sections that are called **zones** ( zones are areas with a temperature controll that provide required temperature for goods normally we have 2 or 3 zones per Reefer) 
2. Pallets are filled in a straight line, to be unloaded first from the right side( so we can have empty pallets back to warehouse)
After, both cases are evaluated, and given point's, based on the result the loading plan chooses the one or another way of loading. It works best with 2-3 deliveries and full loaded trucks.


## Distinctiveness and Complexity
This project satisfies the complexity and requirements of final project for webCS50, because:
* it's unique, we learned nothing like this project during the course
* project is very complex, it took me a month to build the conditions and operation units as destination, delivery plans, and others, and couple them all together so they have the right relationship to each other.
* project is written with Django(python)back-end and JavaScript for the front-end.
* project has own pallet "sorting" ~~algorithm~~ code that performs two different solutions, evaluates both and chooses the best one.
* project has 3 user types, and can be controlled without ~~admin~~ superuser, except verification of **Planner** has to be done by superuser.
* has 17 API endpoints, that are used multiple times across the project.
* most of the API retun only limited data, neede for a certain task, avoiding sending redundant information.
* same API calls are used for different tasks, but the data returned is suitable for.
* Almost all user input is checkd both, client side and server side, to avoid mistakes during registration and relationships.
* Project code is documented and commented, explaining what does what and what limitations are used.
* no extra plugins were used, only JavaScript and Django, all I needed - I wrote myself.

## How to run this application:
#### How to install:
1. download the files, unzip.
2. go to files directory and run command: 
``` shell
python manage.py makemigrations load_planer
python manage.py migrate
python manage.py runserver
```
3. create a superuser:
    ``` shell
        python manage.py createsuperuser
    ```
    fill out e-mail, password and proceed.
4. go to project page and register a new user that is going to be Planner on /register/ page
5. after go to /admin/ page, log in using superuser credentials,then:
    *  choose "Profiles" section on the side menu, click on "Add profile"
    * choose username of the new registred user in the select drop-field
    * tick the "is planner" option and click "Save"
6. the program is installed and ready to use.

### How to use the program
After the Planner has been registred, the program can be used as designed.
Planned has complete control over Drivers, Delivery plans and Tours. 
Still there are some things that are managed by admin(superuser), only superuser can:
* delete and edit Destinations with customer information and details
* delete and edit trucks 
* delete and edit users
#### The following must be done prior to Tour registration:
1. have at least one Driver to be registred and verified(more about  driver registration later)
2. have at least one truck registred
3. have at least one customer - destination registred
4. have at least one Delivery plan registred using the previous mentioned registration of Destination as a delivery point.
#### Being a Planner:
Planner can register a Reefer/truck, verify a Driver, register a Customer Destination point, register a Delivery plan(consisting of delivery points) and Register a Tour(consisting of all parts mentioned above).
Trucks and Destination registration is straight forward and only takes one form to fill in and send.
Drivers can only be verified or removed from the verified Drivers list, by simple click, on a selected Drivers profile.
Delivery plan registration has to be done in two steps:
1. selecting year, quearter and number of expected delivery points
2. fill out input fields in generated form and click "Check input"
3. if all input was verified, the inputfields are locked and Submit button has to be clicked to send the Delivery plan to registration
Tour Planning takes more staps to register:
1. select Year and Quarter for the Tour
2. on next select the date of execution and Delivery plan that will be used for the Tour (The program will sugest the know Delivery plan ID's from database by partial of complete match in the user input)
3. next step assign Truck and Driver for this Tour. By changing truck inout it will provide you with information about the Reefer/truck, like number of pallets and zones. Only available Drivers and Trucks are displayed in the options, Trucks/Drivers assigned to other Tours on this date are not available.
4. after this a table is loaded, please fill out time of delivery and number of pallets for every type of goods, for each customer. Every row has it's Destination point, preloaded in "Destination" row, and can be viewd by clicking on it.
5. After the pallet and time information is filled out, click on "Verify Tour", it will verify your input, in case of error it will guide you with information causeing the failure to verification, and marking the row where the failure was registred.
6. in case successful verification, click on register Tour to register new Tour.
7. **WARNING:** 
Please make no changes after the Tour data was verified, and sending Registration request. If you made any changes, you need to verify them again, to avoid unexpected results.
#### Being a Driver
Register a new account. After you log in first time, you'll be asked to fill out additional personal information about you: Name, Lastname and your driver id.
Fill out this information, submit it and wait for the Planner to verify you as a driver.
Next time you log in after being verified by the Planner, you'll have access to page "Your plan", opens every time you log into the system.
It has date selection options and a table ouf Tour lists for you.
In the table is displayed a tour you are going to have today. TO view it click on the Tour id name. To find Tour for another day, select the desired date and click on "Find Tours".

###### Driver registration
Every new user registred, has to provide personal information to be verified as a driver, it consists of name,lastname and driver_id issued by the employer. Only if this information is provided a user will be marked as unverified driver. Planner can see unverified drivers on drivers page, or by accessing the profile page of the user. If the user somehow avoided the form on the gateway, the form will be displayed on users profile page, until the information is provided and sent.
Only verified drivers may be assigned to a Tour. In case of providing wrong information, it can only be changed by superuser.
## files: purpouse and content
There are: 
* 13 *.js files (~50% of all files)
* 15 *.html files (~20% of all files)
* 4 *.py files (~30% of all files)
that are important for this project.

Goint to look at most of them.
#### .JS files:
1. **plannerNav.js** is Planner Navigation js file, that as said from the naming display a navigation for the Planner. This was written to let the Planner navigate through the project and his main working area, js file is used on all pages that only planner has access to. Using this script for a _not_ Planner won't let the user navigate through the website. 
2. **delplan.js**  creates table of delivery destinations on the _delivery plan/<id>_ fetches data from API asking for extra details. ALso draws a button to DELETE the delivery plan, and executes this request. All the data displayed for the user on Delivery plan page is made by this js. 
3. **delplanform.js** Delivery plan Form file that is huge 444 lines that takes care of the Overview of registred Delivery plans and registring new plans. Here is what it does: 
    * Loads and display in table list of all delivery plans registred for the actual quarter. 
    * creates a Delivery plan form that load in two steps, filling out Year,Quater and number of destinations, then loads know list of destinations. it's needed to verify user input, before registration.
    * on second step generates inputfields by the number from the rist part, 
    * after user filled out all fields, compares the input in every inputfield with, proloaded list of  know destination registred in the system. _It's case sensitive!_ 
    * in case of dublicate or unknowns(not matching) input, let the user know by marking the input field with red and writing reason next to the verification button
    * after the input is verified, it's locked and the delivery plan can be registered by  fetching the registration reqeust.
    * script also generates buttons and fields that can load delivery plans for requested year/Quarted.
    * loading Delivery plans and Form are separated and when one is loaded, second is hidden from the user.
4. **destinationsView.js** Destination View file that is responsible for displaying, filtring and registring new Destinations on Destinations.This script does:
    * fetches list of all registred destinations and create a card for every recod wti h detailes fetched from the db.
    * create and execute a filter to display cards that match the user input(is not case sensitive) it hides all other cards and display those matching the provided user input, partial or complete match.
    * creates form needed to register new destination, fetches the registration request via API
5. **driverVer.js** Driver Verification script used on drivers page, script fetches list of users from db. Users that are not verified as drivers, but have provided personal information as name, last name and driver id. Script creates a Card for this user and a button, to quick verify this Driver( only verified drivers can have Tours assigned to them)
ANother way to verify a driver is by button inside users profile.
6. **easyAlgo.js** Easy Load algorithm script, that is the one responsible for building the schematic view of loading plan. script is called from anothe js file _tourload.js_ after it has fetched the delivery point table what actually is a table of destination points for the Tour. Call from the _tourload.js_ gives args with information need to build the schematics of loading plan. The _easyAlgo.js_ does:
    * script separates pallets by good type _frozen_ and _chilled_ + _dry_ and counts the number of every group and total number of pallets
    * script evaluates of the load is mixed(consist of more than one type of goods) or mono type load
    * then it runs algoLoadEasy fucntion, with a _colStyle_ flag and later - without it, this function sorts the pallets by Column(when pallets are placed in a reefer, from left to the right in revers delivery order) or by Row ( when pallets are placed next to each other in pairs aslo in reverse delivery order, following the principle(LIFO) _LAST_ _IN_ _FIRST_ _OUT_, just like in a stack)
    * after first performance it sends the result ot the loading plan data to _neighbourIndex_ function. that is evaluating the position of neighbour pallets in the load, if a pallet from the same row belongs to the same destination it gets a +1 point, if a a pallet in the same column belongs to the same destination it gets a +1 point as well. ( Important to mention is that the number of points assigned needs further testing and has to be changed after.) Calculated the average number of points are returned.
    * same process is performed again fithout _ColStyle_ flag. Both results of neighbourIndex are compared and the one that has higher score is sendt to _drowThePallets_ function that visualize the result on the page.
7. **gateway.js** short script that adds form-control class to form elements on gateway page.
8. **profileView.js** Profile page View script that checks if the reqeusting user is a Planner, if true, it loads buttons and adds events, that alow Planner to verify or remove a Driver prom list of verified drivers. It's required to control Driver users.
9. trucks.js Trucks script is doing the same as gateway script - adding custon class to form element
10. **tourplanform.js** Tour plan Form script that does a huge part of loading and styling the view on the Tour Planning page. It does:
    * generate button to create new Tour 
    * if New tour is clicked performs loading a 4 step registration process for a new tour:
        1. user has to choose Year and Quarter of the Tour to be created (is used to fetch registred Delivery plans for selected period)
        2. User has to select date of execution and Delivery plan id (Delivery plan Id is suggesting user to choose Delivery plans from a list that was fetched previous, and user can only select date in the future, no registration for the past days is possible)
        3. user has to assign Truck and Driver for this Tour. (in change of select field of truck, information about the truck is loaded and displayed, so the planner know the pallet capacity of the truck and number of zones. Driver choice is showing only drivers who are not asigned to any other tour on that date, as they are busy. Both Driver and Truck input are free to change before final registration of the tour)
        4. Loads a table with data from the Delivery plan chosen by the planner, preloading Destination id's, and letting the planner to fill out the number of pallets for each type of goods. ( Rules of loading and restrictions are displayed under the table)
    * Verification of user input and egistration is done by another script _submitTPform.js that is called from tourplanform.js
    
11. **submitTPform.js** Submit tour plan form script is responsible for verification of user data and registration of the Tour.
    * Verify user input in the table :
        * after the has provided the input and clicked on _Verify Tour_ button, script performs verification of the user input. The restrictions are: number of pallets of the same type, under fully loaded truck have to be EVEN, because we may not blend goods of different temperature control as it will damage the goods. The smallest load of a type(Frozen of Chilled+Dry) in a mixed load must be at least 4 pallets, this is the bare minimum to be loaded in a temperature control zone. 
        * if the verification failed, the failed row, changes color, and a comment explaining the failed verification is displayed under the table. 
        * in case of successful verification, Registration button is unlocked and the planner may perform the registration.
    * Registration is perfomrmed in multiple requests:
        * Tour is registred separated and every Delivery point is registred in relationship by each by itself.
        * every delivery point registration is counted and only seen as success if the number returned values is equal to number sendt requests. ( I do understand how wulnerable this decision is)
    * after the new Tour is successfully registred Planner is redirected to the new tour page.
This js script is the most wulnerable in all I did here and has to redesigned in case of future development. The input is not locked like it was during the Delivery plan registration, and user can perform manipulations with the input before sending registration request without re-verifying the input data.
12. **tourview.js** Tours view script loaded together with _submitTpform.js_ and _tourplanform.js_ it's only task is to create button to load the Tours for a selected date. it does:
    * generate a button and date input field
    * if date is selected, fetches data from bd about Tours registred to the selected date
    * display the results on the table, with details like tour id, delivery plan id, driver, truck used and number of destinations.
    * by default loads the table with Tours on actual date
13. **tourload.js** Tour load script loads:
    * Tour details about the Tour on Tour page
    * destination points and information about time, pallets type and count.
    * calls _easyAlgo.js_ and passes information neede for it to work.

#### .HTML files
Each directory has it's own heml file. Majority of files is only awailable for Planner and will not be accessed by other users than Planner. HTML files often have DJango formating language used to define data to be displayed to the user, based on user status or data options. User is redirected to his own profile in case of trying to access an directory the user has no lawfull access to. Mayority of the files only have the basic mark up and defined div's to define the loading path for the JavaScript generated code.

#### .py files
Python files we are going to look at are only this project related, except views.py and models.py are in every Django project.
1. **models.py** Models keeps the information of models used in the project and defines relationships inbetween the models and generated database.
The hardest part for me was to write the model name Delivery_plan as it had to store delivery order sequence. I spend so much time on it that Idon't want to admit. WE didn't work much with JSON during the lections, so I had to find it out myself. The model.JSONField() was never used in the project but the Django documentation told me that it would probably fit my needs, so I had no other choice then useing it. I spend literally a few day's just to figure out how it works as it was consistantly returning me 500 internal server errors. After I spend 3 days without mooving a step further I noticed a misspelling that was ruining all the performance of the code, fixing that was the solution. ( Problems with misspelling is going to happen a few more times during the project, but it won't take me three days to find it) After I mastered the JSONField the project development was under a consistant flow. Some models received significant changes from their initial structure, as the project developed into more complex as I planned from the begining. By digging deeper into the details and designing the process of the registration of every element I had to add or remove some fields.
2. **forms.py** This file contains Forms for the project, forms that are used by Django formating language and use CSRF tokens. The forms were located in the views.py but I exported them into forms.py file to make the views.py cleaner. Theres only tree Forms for Driver, Truck and Destination. These are the forms that have CSRF tokens and only custom styles are add to Form fields, to display them in the bootstrap style. In case registration of truck with other options of max pallet and zones, files: forms.py and models.py need to be changed, as the options are hardcoded inside.
3. **util.py** is a support file with extra utilities for the program and had to hold the algorithm and other helpful functions from the start. But after some brainstroming, I decided to keep the pallets sorting and validation o client side, and to not putmore calculation on the server. As a result this file only contains two functions that check if the requesting user is a planner or is the reqeusting user a driver, returning a boolean value. Every time a page is reqeusted, the views.py checks if the user is Planner, it's used 30 time in the views.py that makes it the most important and most used function in this program.
4. **views.py** the biggest file of the project is almost 840 line of code and comments. Half of the file is API endpoints, used by JS files all over the project. This file grow in size very fast during the project development, I had to re-write API's and other par multiple times. THe hardest part was to understand how to return JSON data for on the reply, I figured out that I can serialize it in a few locations, here in views.py file and in models.py I could write a custom method for a model, both ways are used in this project. But my personal favorite is serializing in views.py just before returning the respoinse as it's more clear and controllable what data will be passed. I think I documented the API enough so it's well explained what each of them does, what data returns and where it's called from, and even who is allowed to reqeust this call. as example _get_delivery_plan_list_ has a custom details arg that is defining how detailed data will be returned. If the request has _details_ == 1 it will return more detailed data, with == 0, it will return a JSONField data from db, that is less informative. But both options are used in this project, for different pages and purpouses.
