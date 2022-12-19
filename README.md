# Delivery Load Planner
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


## Distinctiveness and Complexit
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
RUN!

## files: purpouse and content
There are: 
* 13 *.js files (48% of all files)
* 15 *.html files (20% of all files)
* 4 *.py files (30% of all files)
that are important for this project.

Goint to look at most of them.
JS files:
1. plannerNav.js is Planner Navigation js file, that as said from the naming display a navigation for the Planner. This was written to let the Planner navigate through the project and his main working area, js file is used on all pages that only planner has access to. Using this script for a _not_ Planner won't let the user navigate through the website. 
2. delplan.js  creates table of delivery destinations on the _delivery plan/<id>_ fetches data from API asking for extra details. ALso draws a button to DELETE the delivery plan, and executes this request. All the data displayed for the user on Delivery plan page is made by this js. 
3. delplanform.js Delivery plan Form file that is huge 444 lines that takes care of the Overview of registred Delivery plans and registring new plans. Here is what it does: 
    * Loads and display in table list of all delivery plans registred for the actual quarter. 
    * creates a Delivery plan form that load in two steps, filling out Year,Quater and number of destinations, then loads know list of destinations. it's needed to verify user input, before registration.
    * on second step generates inputfields by the number from the rist part, 
    * after user filled out all fields, compares the input in every inputfield with, proloaded list of  know destination registred in the system. _It's case sensitive!_ 
    * in case of dublicate or unknowns(not matching) input, let the user know by marking the input field with red and writing reason next to the verification button
    * after the input is verified, it's locked and the delivery plan can be registered by  fetching the registration reqeust.
    * script also generates buttons and fields that can load delivery plans for requested year/Quarted.
    * loading Delivery plans and Form are separated and when one is loaded, second is hidden from the user.
4. destinationsView.js Destination View file that is responsible for Displaying, filtring and registring new Destinations on Destinations page only accessible by Planner. This script does:
    * fetches list of all registred destinations

