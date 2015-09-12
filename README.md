[Xnote](www.xnote.io) — Social Annotation
==================================================

What is Xnote?
--------------------------------------

A collaborative annotation tool.


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

`React is a JavaScript library for creating user interfaces by Facebook and Instagram. Many people choose to think of React as the V in MVC.

We built React to solve one problem: building large applications with data that changes over time.`

The application is modularized into 4 react folders, each corresponding to a page in the app:
- **/xnote-article**: deals with reading and annotating a single article
- **/xnote-social**: main page that allows user to see all articles posted within the group and interact with other users in the group.
- **/xnote-dashboard**: Shows all groups that the user is a part of with notifications
- **/xnote-landing**: landing page (uses template: ).


Planned Improvements and Bugs:
------------------------------
- mobile compatability
- https 


Questions?
----------

If you have any questions, or need some help better understanding Xnote or building it, hit us up at:
xnotelabs@gmail.com
