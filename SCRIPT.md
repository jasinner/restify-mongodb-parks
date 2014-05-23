HACKAKL Getting Started with OpenShift
====================

This is a step-by-step cheat sheet for the HACKAKL workshop.

Demo restify-mongodb-atstops
---------------------

1. Setup rhc client tools. Enter username and password and enter 'yes' authorization token

    ```
    rhc setup
    ```

2. Create app (first command fails to show nodejs options)

    ```
    rhc app create atstops nodejs  
    cd atstops  
    ls -la  
    rhc cartridge add mongodb-2.4
    ```   
    
3. Login to OpenShift Online web console and show atstops app

4. Clone and deploy restify-mongodb-parks project

    ```
    git remote add upstream https://github.com/ryanj/restify-mongodb-parks  
    git pull -s recursive -X theirs upstream master  
    git push  
    ```   
   
5. Get the app URL and browse to the map 

    ```
    rhc domain show
    ```

6. Edit .openshift/action_hooks/deploy and insert the following line before `npm run initdb`. This makes sure MongoDB data set is cleaned up for every deploy.

    ```
    npm run flushdb
    ```
    ```   
   
7. Show park coordinates file and prepared stop coordinates then overwrite

    ```
    nano parkcoord.json  
    nano ~/hackakl/parkcoord.json  
    cp ~/hackakl/parkcoord.json parkcoord.json
    ```
   
8. Modify index.html based on diff cheat sheet and then deploy to OpenShift

    ```
    git add --all  
    git commit  
    git push
    ```