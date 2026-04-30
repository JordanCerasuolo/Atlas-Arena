# Atlas-Arena
Map-based Trivia Web application
http://atlasarena.azurewebsites.net

# SQL Prompt to give a user admin access to the db (run in query editor in azure)
CREATE USER [user@domain.com] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [user@domain.com];
ALTER ROLE db_datawriter ADD MEMBER [user@domain.com];
ALTER ROLE db_ddladmin ADD MEMBER [user@domain.com];

Additionally, make sure they use az login in their terminal, have azure permissions added for the project, and have the proper .env setup