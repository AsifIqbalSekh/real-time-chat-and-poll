Real-time Polling and Chat Application

 Real-time Polling and Chat Application is a web-based platform that allows users to create polls in real-time and participate in chat conversations seamlessly.


	

A. Overview

  The Real-time Polling and Chat Application combines WebSocket-based real-time communication with a simple polling system. Users can register, log in, create polls, vote on polls, 
  and engage in real-time chat conversations.

B. Features

 1. User Authentication:

   a. Register new users with a username and password.
   b. Authenticate users with registered credentials.

 2. Polling System:

   a. Create polls with custom topics and options.
   b. Vote on available poll options (users can vote only once per poll).

 3. Real-time Chat:

   a. Send and receive messages in real-time.
   b. Receive notifications when other users join or leave the chat.
   c. See typing indicators when other users are typing.

C. Technologies Used

  1. Backend: Node.js , Express.js , Socket.io
    
  2. Frontend: HTML/CSS/JavaScript
    
  3. Deployment Platforms: AWS , EC2 , Github Actions

  4. Version control (Git, GitHub)

D. Getting Started

   To get the Real-time Polling and Chat Application up and running locally, follow these steps:

E. Prerequisites

   Ensure you have the following software installed on your local machine:
   Node.js (version 10 or higher) , npm (Node Package Manager, usually comes with Node.js installation) , Git

F. Installation & Start The Application

 1.	Clone the repository:

        git clone https://github.com/AsifIqbalSekh/real-time-chat-and-poll.git
        cd real-time-chat-and-poll

 2.	Install dependencies:

        npm install

3.	Start the server:

        npm server/server.js

G. Usage

  1.	Above command starts the server at http://localhost:3000.
  2.	Open the application in a web browser:
            Open your web browser and go to http://localhost:3000. You should see the login and registration forms.
  3.	Register/Login:
              •	If you are a new user, register with a username and password.
              •	If you are an existing user, log in with your registered credentials.
  4.	Create Polls:
              •	After logging in, navigate to the Poll section.
              •	Enter a topic and two options, then click “Create Poll”.
  5.	Vote on Polls:
              •	Once a poll is created, you can vote on it by clicking the respective option.
  6.	Chat:
              •	Navigate to the Chat section to send and receive real-time messages.
              •	See notifications for users joining/leaving and typing indicators.

H. Deployment

  To deploy the Real-time Polling and Chat Application to a production environment:

  1.	Set up a production server (AWS EC2 instance).
  2.	Developed CI CD Pipeline using GitHub Actions
  3.	Install Node.js, pm2, nginx in the EC2 instance
  5.	Start the application with a process manager - PM2

I. Authors

  • SK Asif Iqbal - GitHub

J. License

  This project is licensed under the MIT License - see the LICENSE file for details.
