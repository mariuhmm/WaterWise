# Deployment instructions

## Initial Setup

1. Make sure your project compiles, builds and runs with docker compose
2. There are two docker compose files in the project. For deployment use the one that has deploy in the name.
3. Edit the deployment compose file to ensure that the ngnix proxy has the correct configuration for your server and not the devedify server.
4. Edit the configuration file for the ngnix proxy in the swag folder.  You will need to edit the server name.
5. Create a deployment branch in your git repo and merge the working, deployable version of your code to that branch.
6. Log in to your assigned server
    - groupname.socs.uoguelph.ca
    - ssh to server
    - make sure you have the vpn running or are on campus
    - username is `socs`
    - the password was sent to your team in your private channel
7. On your server, create an ssh key pair
    - `ssh-keygen -t ed25519`
    - hit enter to skip creating a passphrase
    - hit enter to accept default save location and filenames
    - copy the generated key
        - `cat ~/.ssh/id_ed25519.pub`
        - copy the output to your clipboard
8. Create an deploy token in gitlab
    - navigate to the project (not the group)
    - go to settings|repository
    - scroll down to the `deploy keys` section
    - add a new key
        - the name doesn't matter
        - paste in the copied key
        - do not grant write permission
        - click add key    
9. clone your repo onto your assigned server
    - use ssh to clone, not https
    - the deploy key will take care of authentication. do not use your own username/password
    - check out the deployment branch
    - `sudo docker compose -f compose.deploy.yaml up -d`
10. Connect to your service
    - [https://eauchart.socs.uoguelph.ca](https://eauchart.socs.uoguelph.ca)
    - you will get the security risk message, just accept it for the moment
    - check the operations of your program to make sure it is all working
11. Remove staging flag
    - if the program is working correctly, take it down with
        - `sudo docker compose -f compose.deploy.yaml down`
    - edit the production compose file to change `staging = true` to `staging = false`
    - restart the service
        - `sudo docker compose -f compose.deploy.yaml up -d`
        - ngnix will automatically get a certificate from letsencrypt that will allow for warning-free https interactions
        - it might take a few minutes.  Be patient

## Regular deployment

1. Log in to the eauchart.socs.uoguelph.ca server through ssh
    - ssh to server
    - make sure you have the vpn running or are on campus
    - username is `socs`
    - the password is in the teams channel
2. Cd into the `yatdl` project
3. Checkout to the deploy branch if you are not on it already (i.e. main) and perform a git pull
4. Re-build the images with `sudo docker compose -f compose.deploy.yaml build --pull`
5. Re-run the docker containers to re-deploy the server with the new changes
    - take it down with `sudo docker compose -f compose.deploy.yaml down`
    - edit the compose.deploy.yaml file to change `staging = true` to `staging = false` if not already done
    - restart the service with `sudo docker compose -f compose.deploy.yaml up -d`
        - it might take a few minutes. Be patient




