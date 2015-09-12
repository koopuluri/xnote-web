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

## React.js:

The front-end is built with React.js (http://facebook.github.io/react/) using the flux architecture (https://facebook.github.io/flux/docs/overview.html). A good tutorial to get up to speed quickly is (https://scotch.io/tutorials/learning-react-getting-started-and-concepts). 

React.js allows us 

Planned Improvements and Bugs:
------------------------------





Questions?
----------

If you have any questions, or need some help better understanding Xnote or building it, hit us up at:
xnotelabs@gmail.com
