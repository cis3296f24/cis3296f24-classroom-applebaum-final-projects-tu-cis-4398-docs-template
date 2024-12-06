[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=16892546)
<div align="center">

# Bassline Burn
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/BASSB/issues?jql=project%20%3D%20%22BASSB%22%20ORDER%20BY%20created%20DESC)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/cis3296f24/applebaum-final-projects-bassline-burn/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://cis3296f24.github.io/applebaum-final-projects-bassline-burn/)


</div>


## Keywords

Section 5, Top Down Pixel Driving Game made in Unity with C#.

## Project Abstract

This videogame introduces an interesting game mechanic of a live radio system affecting in game factors, like car max speed, acceleration, and turning power. To support this crisp mechanic, the game will feature a multiplayer system in which you and your friends can pick from an array of race courses based on real locations around the world and race eachother to see who is the best driver.

## High Level Requirement

This game has very simple parts but can get very complicated quickly. A lot of this is because of the multiplayer aspect of the game. For this reason, I think tackling the easy parts first like the base game then moving on to the multiplayer later will create a concise schedule that will allow us to make a smooth feeling game. On my own time I will attempt to create some art assests in order to make the game feel like our own and truly unique.

## Conceptual Design

The conceptual design involves creating a basic multiplayer racing game with Unity and C# and then building off of that. Once when we create amazing controls and this state of the art radio system, we can build off of this by adding a lobby to hold our multiplayer in which racers can vote on maps and even add bots to their game if there are not enough players. While to start we will just have a simple host/join multiplayer system, I would like to add on a system that will add you to a random game that has some players in it already.


### Sequence Diagram for Hosting a Game:
```mermaid
    sequenceDiagram
    
    User ->> Interface Manager: Load Game 
    Activate User
    Activate Interface Manager
    Activate Interface Manager
    Interface Manager ->> Interface Manager: Fetch Client Info
    Deactivate Interface Manager
    
    Interface Manager ->> CreateGameUI: Start()
    Activate Interface Manager
    Activate CreateGameUI
    Activate CreateGameUI
    CreateGameUI ->> CreateGameUI: SetTrack, LobbyName, Users
    Deactivate CreateGameUI
    CreateGameUI ->> Level Manager: Load Track
    Activate Level Manager
    Activate CreateGameUI

    Level Manager ->> GameUI: Spawn Players
    Activate GameUI
    GameUI --) Level Manager: 
    Deactivate GameUI
    Deactivate CreateGameUI
    Level Manager --) CreateGameUI: 
    Deactivate Level Manager
    Deactivate CreateGameUI
    CreateGameUI --) Interface Manager: 
    Interface Manager --) User: 
    Deactivate Interface Manager
    Deactivate Interface Manager
    Deactivate User
```

### Sequence Diagram for Joining a Game:
```mermaid
    sequenceDiagram
    
    User ->> Interface Manager: Load Game 
    Activate User
    Activate Interface Manager
    Activate Interface Manager
    Interface Manager ->> Interface Manager: Fetch Client Info
    Deactivate Interface Manager
    
    Interface Manager ->> JoinGameUI: Start()
    Activate Interface Manager
    Activate JoinGameUI
    Activate JoinGameUI
    JoinGameUI ->> JoinGameUI: Fetch Lobby Info
    Deactivate JoinGameUI
    JoinGameUI ->> Level Manager: Load Track
    Activate Level Manager
    Activate JoinGameUI

    Level Manager ->> GameUI: Spawn Players
    Activate GameUI
    GameUI --) Level Manager: 
    Deactivate GameUI
    Deactivate JoinGameUI
    Level Manager --) JoinGameUI: 
    Deactivate Level Manager
    Deactivate JoinGameUI
    JoinGameUI --) Interface Manager: 
    Interface Manager --) User: 
    Deactivate Interface Manager
    Deactivate Interface Manager
    Deactivate User
   

    
```
### Sequence Diagram for Game Loop
```mermaid
sequenceDiagram
    
   User ->> GameManager: ReadyState()
   Activate User
    Activate GameManager
   GameManager ->> GameUI: StartCountdown()
   Activate GameUI
   Activate GameManager
   GameUI --) GameManager: 
   Deactivate GameUI
   Deactivate GameManager
    Deactivate GameManager
   GameManager --) User: 
   Deactivate User
   User ->> GameUI: LapCount
   Activate GameUI
   Activate User
   GameUI --) User: 
   Deactivate GameUI
   Deactivate User
   User ->> GameUI: Time Passed
   Activate GameUI
    Activate User
   GameUI --) User: 
   Deactivate GameUI
    Deactivate User

   User ->> GameManager: Finished()
   Activate GameManager
   Activate User
   GameManager ->> GameUI: Finished()
   Activate GameUI
   GameUI --) User: 
   Deactivate GameUI
   Deactivate GameManager
   Deactivate User
```
## Background

Growing up one of the most popular video games were Mariokart. Something about the fun controls made it entertaining for both the casual and hardcore racers. Now that I am a lot older, I want to replicate the game and combine it with my other interest in music. Live radios in games is not a new thing, from Forza to GTA, these games have all had in game radios. What will make this different is the fact that the radio actually affects the games and is not just an extra feature.

## Required Resources

This project just requires Unity and an IDE to edit C# code in. There are a vast amount on optional resources, like a way to create art and music, and a platform to post the final game with.

## Collaborators

[//]: # ( readme: collaborators -start )
<table>
<tr>
    <td align="center">
        <a href="https://github.com/ChristopherBrousseau">
            <img src="https://avatars.githubusercontent.com/u/156946433?s=96&v=4" width="100;" alt="ChristopherBrousseau"/>
            <br />
            <sub><b>Christopher Brousseau</b></sub>
        </a>  
    </td>
    <td align="center"> 
        <a href="https://github.com/glantig1">
            <img src="https://avatars.githubusercontent.com/u/143743234?v=4&size=64" width="100;" alt="glantig1"/>
            <br />
            <sub><b>Gabriel Lantigua</b></sub>
        </a> 
    </td>
    <td align="center"> 
        <a href="https://github.com/Random76520">
            <img src="https://avatars.githubusercontent.com/u/123013478?s=400&v=4" width="100;" alt="Augustin"/>
            <br />
            <sub><b>Jonathan Augustin</b></sub>
        </a> 
    </td>
    <td align="center"> 
        <a href="https://github.com/Gunlords">
            <img src="https://avatars.githubusercontent.com/u/180465432?v=4" width="100;" alt="Ankur"/>
            <br />
            <sub><b>Ankur Chowdhury</b></sub>
        </a> 
    </td>
    <td align="center"> 
        <a href="https://github.com/tus40499">
            <img src="https://avatars.githubusercontent.com/u/157192065?v=4" width="100;" alt="JackMartin"/>
            <br />
            <sub><b>Jack Martin</b></sub>
        </a> 
    </td>
    
    

</table>

[//]: # ( readme: collaborators -end )
