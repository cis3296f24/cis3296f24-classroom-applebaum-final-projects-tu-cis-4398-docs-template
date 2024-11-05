[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=16933936)
<div align="center">

# SpeakSense
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/DT/issues)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://applebaumian.github.io/tu-cis-4398-docs-template/)


</div>


## Keywords
Section # 1<br>
Speech-Analysis, Word Frequency Tracking, Taser, Java/Kotlin, Android app, Speech Pattern Analysis, Word Detection, Voice Activation, Profanity Detection

## Project Abstract

This document proposes a novel application of a text message (SMS or Email) read-out and hands-free call interacted between an Android Smartphone and an infotainment platform (headunit) in a car environment. When a phone receives an SMS or Email, the text message is transferred from the phone to the headunit through a Bluetooth connection. On the headunit, user can control which and when the received SMS or E-mail to be read out through the in-vehicle audio system. The user may press one button on the headunit to activate the hands-free feature to call back the SMS sender.

## High Level Requirement

Local data logging of detected words, including timestamps and frequency counts.
Real-time (or regular intervals) updating of statistics, such as most-used words, filler word percentages, profanity counts, and general word variety.
Use of predefined dictionaries for categorizing words (e.g., filler words, conjunctions, profanities).
Option for the user to review data through a dashboard displaying summary statistics and trend insights on language use.
Privacy and storage management, including an option to delete logs after a certain period.

## Conceptual Design

This is a template from Figma that is touched up. The intention is for the web app to also be accessible to mobile, but this gets the idea of what we want to display well.
![image](https://github.com/user-attachments/assets/c2eeaaad-d67d-44dd-9542-12750150a1d5)

## Background

By analyzing patterns of speech, we seek to create a tool that can study speech patterns. We'd like to help users explore how they sound in presentation settings. Does their word choice indicate they are assertive or passive? Abstract or practical? Verbose or redundant?

We also wish to assist in getting rid of negative talking behaviors. By seeking to implement a buzzer in a mobile device, users can be alerted whenever they use a word they deem innapropriate or undesirable. This could be cursing, vague language, or filler words.

## Required Resources

### Software Resources:

SQLite, and APIs for speech-to-text processing.
### Hardware Resources:

A laptop with audio recording capabilities. Cellular devices (both android and apple)
### Additional Needs:

Development of predefined dictionaries for word categorization (filler words, conjunctions, profanities).
## Collaborators

[//]: # ( readme: collaborators -start )
<table>
<tr>
    <td align="center">
        <a href="https://github.com/ApplebaumIan">
            <img src="https://avatars.githubusercontent.com/u/9451941?v=4" width="100;" alt="ApplebaumIan"/>
            <br />
            <sub><b>Josh Rhee</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/leighflagg">
            <img src="https://avatars.githubusercontent.com/u/77810293?v=4" width="100;" alt="leighflagg"/>
            <br />
            <sub><b>Sophie </b></sub>
        </a>
    </td></tr>
    <td align="center">
        <a href="https://github.com/leighflagg">
            <img src="https://avatars.githubusercontent.com/u/77810293?v=4" width="100;" alt="leighflagg"/>
            <br />
            <sub><b>Josh </b></sub>
        </a>
    </td></tr>
    <td align="center">
        <a href="https://github.com/leighflagg">
            <img src="https://avatars.githubusercontent.com/u/77810293?v=4" width="100;" alt="leighflagg"/>
            <br />
            <sub><b>Omar </b></sub>
        </a>
    </td></tr>
</table>

[//]: # ( readme: collaborators -end )
