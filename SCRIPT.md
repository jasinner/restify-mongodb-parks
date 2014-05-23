HACKAKL Getting Started with OpenShift
====================

This is a step-by-step cheat sheet for the HACKAKL workshop.

Demo restify-mongodb-atstops
---------------------

1. Setup rhc client tools

```bash
    rhc setup
```

Enter username and password and enter 'yes' authorization token

2. Create app (first command fails to show nodejs options)

```bash
    rhc app create atstops nodejs
    cd atstops
    ls -la
    rhc cartridge add mongodb-2.4
```   
   
3. Login to OpenShift Online web console and show atstops app

4. Clone and deploy restify-mongodb-parks project

```bash
    git remote add upstream https://github.com/ryanj/restify-mongodb-parks
    git pull -s recursive -X theirs upstream master
    git push
```   
   
5. Get the app URL and browse to the map 

```bash
    rhc domain show
```

6. Edit .openshift/action_hooks/deploy and insert the following line before `npm run initdb`

```node
    npm run flushdb
```
    
This makes sure MongoDB data set is cleaned up for every deploy

7. Edit server.js and insert the following lines after call to _selectAll_ 

```node
   app.get('/initdb', db.initDB);
   app.get('/flushdb', db.flushDB);
```

This allows REST urls for deleting and importing data from the frontend

8. Deploy changes to OpenShift and invoke _flushdb_ REST interface 

```bash
   git add --all
   git commit
   git push
```   
   
9. Show park coordinates file and prepared stop coordinates then overwrite

```bash
   nano parkcoord.json
   nano ~/hackakl/parkcoord.json
   cp ~/hackakl/parkcoord.json parkcoord.json
```
   
10. Modify index.html based on diff cheat sheet and then deploy to OpenShift

```bash
   git add --all
   git commit
   git push
```