[Xnote](www.xnote.io) — Social Annotation
==================================================

What is Xnote?
--------------------------------------

Xnote is a tool that allows groups to read and discuss articles via annotations.
The project can be viewed at www.xnote.io. Xnote is built using MongoDB, Express
React and NodeJS among other libraries (discussed later).
The code is divided into two portions, the back end mostly present in routes.js,
server.js, passport.js and DB.js and the front end which is in the reacts folder.
The front end is further divided into 4 components each of which contains the 
code for one page of xnote. The following sections describe each of these sections
briefly.

What you need to build your own Xnote
--------------------------------------

TBD


Understanding the Components
----------------------------

### Backend:

`routes.js and server.js` are the files that define routing, and other node.js formalities. 

`Db.js` - an interface for a MongoDb database. Allows for adding, editing, deleting users, articles, notes, and comments. 

### Authentication:

`Passport.js` (http://passportjs.org/) was used; it provides an easy way to integrate social logins (fb, google), and also custom logins. Expects a config.js file placed on the same level to access social tokens.

# Frontend:
-----------

## React.js:

The front-end is built with React.js (http://facebook.github.io/react/) using the flux architecture (https://facebook.github.io/flux/docs/overview.html). A good tutorial to get up to speed quickly is (https://scotch.io/tutorials/learning-react-getting-started-and-concepts). 

Description from homepage:

"React is a JavaScript library for creating user interfaces by Facebook and Instagram. Many people choose to think of React as the V in MVC.

We built React to solve one problem: building large applications with data that changes over time."

The application is modularized into 4 react folders, each corresponding to a page in the app:
- **/xnote-article**: Deals with reading a single article within a group. Includes a chat window to communicate with other members in group.
- **/xnote-social**: note social contains the code for the groups page. It includes a chat window
a notifications button on the navbar, the feed panel showing the latest activity
in the group and the list of articles. 
- **/xnote-dashboard**: The code shows all the groups the members in the page xnote.io/dashboard. You
can also see notifications for each of the groups indicating how many chat and
feed notifications a user has for his group.
- **/xnote-landing**: This part of the code is responsible for the home page. When sharing a group
link the homepage is modified to show a card for the group, its description
and its members. The landing page template can be found at:
http://startbootstrap.com/template-overviews/creative/


#Dependencies
============
- Google Roboto Font. Included in the ejs files under views.
- Google Font Icons. Included in the ejs files under views. Used primarily for 
the notification and chat icons.
- Mixpanel. Used for tracking user activity.
- Diffbot. Used to parse articles. Note that the diffbot token has been removed
from the code and to use this code you must acquire a new one from the diffbot
website.
- Material UI. Material UI library is used for most of the front end components.
The components are all customized using in line styles. In some areas however the
styling occurs in the css files; the css is predominantly used for positioning 
components, mirroring or inverting them. The details of the material ui library
can be found at https://github.com/callemall/material-ui.
- Flux. All the react sub folders use the flux architecture. More information on
how this is used is available at:
https://scotch.io/tutorials/creating-a-simple-shopping-cart-with-react-js-and-flux


#Planned Improvements and Bugs:
------------------------------
- Chat window lazy loading. Currently the chat window only displays the last 10
messages. We're working on it to make sure that it lazy loads and displays more
messages as you scroll up.
- Modularization. There is a lot of files that are repeated across the react
folders. The reacts are not modularized so there is a lot of redundant code rather
than reusing components. For example the chat window is common to xnote-article 
and xnote-social. However there are two separate files in each of these folders
performing the exact same function.
- Mobile Compatibility. Right now only the landing page is compatible to work on 
mobile. Though we do have an android app, the functioning of the web and android
applications are not linked just yet. We're working on providing a good mobile 
experience to our users.
- mobile compatability
- https 


#Running the Code
================
Perform the following steps to run the code. 
- Make sure to add the tokens that are missing. Diffbot token, Facebook application
token for facebook login, google application token for google login. Most of these
can be found in config.js.
- Set up a database with MongoDB and provide the name and authentication necessary
in DB.js.
- Run npm install in each of the react sub folders as well as the main folder.
- Build the javascript files for each of the react sub folders. You can use npm start
or npm run-script build to build the js files. 
- Start the server by using the command node server.
- The application is now running on localhost:8080. 



Questions?
----------

If you have any questions, or need some help better understanding Xnote or building it, hit us up at:
xnotelabs@gmail.com
