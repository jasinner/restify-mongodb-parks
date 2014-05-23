HACKAKL Getting Started with OpenShift
====================

This is a step-by-step cheat sheet for the HACKAKL workshop.

Demo restify-mongodb-atstops
---------------------

1. Setup rhc client tools

    rhc setup

Enter username and password and enter 'yes' authorization token

2. Create app (first command fails to show nodejs options)

    rhc app create atstops nodejs
    cd atstops
    ls -la
    rhc cartridge add mongodb-2.4
   
3. Login to OpenShift Online web console and show atstops app

4. Clone and deploy restify-mongodb-parks project

    git remote add upstream https://github.com/ryanj/restify-mongodb-parks
    git pull -s recursive -X theirs upstream master
    git push
   
5. Get the app URL and browse to the map 

    rhc domain show

6. Edit .openshift/action_hooks/deploy and insert the following line before _popd_

    npm run flushdb
    
This makes sure MongoDB data set is cleaned up for every deploy

7. Edit server.js and insert the following lines after call to _selectAll_ 

   app.get('/initdb', db.initDB);
   app.get('/flushdb', db.flushDB);

This allows REST urls for deleting and importing data from the frontend

8. Deploy changes to OpenShift and invoke _flushdb_ REST interface 

   git add --all
   git commit
   git push
   
