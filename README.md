# Atlas-Arena
Map-based Trivia Web application
http://atlasarena.azurewebsites.net

# Documentation
https://docs.google.com/document/d/1HjUPVJGl04Ei1Hbpmwz_745R7FpQtfxipPZ1s1LzXGw/edit?usp=sharing

# SQL Prompt to give a user admin access to the db (run in query editor in azure)
CREATE USER [user@domain.com] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [user@domain.com];
ALTER ROLE db_datawriter ADD MEMBER [user@domain.com];
ALTER ROLE db_ddladmin ADD MEMBER [user@domain.com];

Additionally, make sure they use az login in their terminal, have azure permissions added for the project, and have the proper .env setup
