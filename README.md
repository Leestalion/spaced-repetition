<h1>Research Project</h1>

<h2>01/27 meeting</h2>

<h3>Flask and Heroku</h3>

- Understanding flask and Heroku with a [project](https://cooking-family-recipes.herokuapp.com/index/)

<h3>Cloud Firestore from Firebase</h3>

- understanding the principle of noSQL database
- reading the data from the database from a [flask app](https://spaced-repetition-opu.herokuapp.com/) hosted on heroku

<h3>Next Goal</h3>

- Space Repetition App from Yamaguchi

<h2>02/10 meeting</h2>

<h3>Quicklearn App</h3>

- Successfully installed the quicklearn App from Yamaguchi (nodejs, yarn and expo)
- Created an account on the app and tested it

<h3>Next Goal</h3>

- Add a python script that calculate the next review time for each word ater it is reviewed (or bunch of words) OR run the script on every words on a fix time everyday.
- Learn how to interact between the web API hosted with heroku (python script) and the nodejs application (quicklearn)

<h2>02/10 meeting</h2>

<h3>Quicklearn App</h3>

- Read many documentations about how to connect API hosted app and nodejs app
- Created a GAS to access heroku hosted app [here](https://script.google.com/d/1DnivTZO9pod-5gY_In_n2e28BCHicxYjaKYZyBWJP0vmZ7fHQJOGM3AR/edit?usp=sharing)

<h3>Next Goal</h3>

- Add a python script that calculate the next review time for each word ater it is reviewed (or bunch of words) OR run the script on every words on a fix time everyday.

- Continue the connection between the flask app and nodejs app.

<h2>03/10 meeting</h2>

<h3>Flask API</h3>

- The flask application has been updated and is working to update the next review time on each evaluation done by the user on the quicklearn app (vocabulometer adapted for flashcard).

<h3>Firebase Database</h3>

- Adding 2 variables to the noSQL database : 'nextTime', which is the next review time in days, and 'forgettingRate', which is a variable needed to compute more accurately the next reviewing time.

<h3>Quicklearn App</h3>

- Understood the quicklearn app and how Expo works.

<h3>Next Goal</h3>

- Update Flask application to take into account the GAS (google apps script) daily update.
- Add a word selection method in the quicklearn application to select words which has '0' as their 'nextTime' variable (meaning which words has to be reviewed that day).
- Discuss about the possible implementation of the 'word difficulty' variable in the database.


<h2>03/17 meeting</h2>

<h3>Flask API</h3>

- Update for Google App Script support;

<h3>Next Goal</h3>

- Add a word selection method in the quicklearn application to select words which has '0' as their 'nextTime' variable (meaning which words has to be reviewed that day).
- Solve Google App Script Problem



<h2>03/24 meeting</h2>

The application seems to work. It is available at the following link on your phone (you need to have expo installed and an expo account) : [click here](https://expo.io/@lestalion/quicklearn)
However, further tests are needed to see if it works completely: 

- Use the application during several days once a day (the goal is to see if the words that have to be reviwed are in fact reviewed).
- If the upper objective is completed, A test on the quality of the spaced repetition algorithm is needed.

<h3>Next Goal</h3>

- Need to implement the word difficulty with word frequency (easiest way to go)
- Begin experiment procedure ?
