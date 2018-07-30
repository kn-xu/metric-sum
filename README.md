# Metric Sum
Lightweight metric logging and reporting service that sums metrics by time windows for the most recent hour

# Setup
For all intents and purposes, we will assume node and npm are installed on your machine.

After cloning/forking this repository, lets get all our assets
>npm install

We can start our web server by entering 
>node server.js

# Usage
Since there is no UI that is tied to the application, we will need to use a tool like Postman or any other API development tool to ensure the routes are doing the correct things

As the web server is running, open up postman and configure two routes
> GET 'localhost:3000/metric/{key of your choice}/sum'

> POST 'localhost:3000/metric/{key of your choice}'

The get is pretty self explanatory as you type in whatever key you want to get the total metric value of that key that was entered within the hour

The post needs a little more configuration like in the picture below. We want to set some urlencoded data with the property of 'value' and the actual value like so...
![Postman Example of Post](https://i.imgur.com/7wtK1yk.png)

# Technologies Used
* Node.js
* Express.js
* BodyParser

# Other
A google doc can be found here detailing more about the application/drawbacks/etc...

https://docs.google.com/document/d/1yI6526JHiVLgPpqMQLA6EXKbrZu5txJsXYsmgrN3ceU/edit?usp=sharing
