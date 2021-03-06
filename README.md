# Ratehub Frontend Exercise

## What is this?

A simple TODO list exercise to demonstrate understanding of the following libraries:
- `React` for rendering
- `styled-components` for styling
- `mobx` for observable state

## Guidelines
1. Unless otherwise noted, the UX/details for achieving the requirements is up to you. Use your best judgement.
1. Feel free to read up on documentation and tutorials for any of the libraries you're not familiar with.
1. If there's a library you're aware of that feels like it fits really well into the exercise, feel free. Don't fundamentally change or work-around the requirements though!
1. If you have questions, feel free to ask.

## Requirements
1. Allow the user to remove items.
1. Add some styling to the application.
    - Simple styling is fine; don't go overboard.
    - Try to add some transition/animation effects; nothing flashy, simple is better.
    - We are looking for fundamental understanding of modern CSS, not a designer's eye.
1. Add an additional status of "in progress":
    - instead of transitioning from incomplete -> complete, they must transition through this new state.
    - the user needs to be allowed to also transition back from "in progress" to "incomplete".
    - how the user will transition states is up to you; simple/obvious is fine
    - how to show the status is up to you
1. Allow the user to add and remove todo item "tags":
    - *Example:* if I create a todo item with the text "Contact candidates to explain the coding exercise", I might want to add a couple tags like "Hiring" and "Urgent".
    - How this is interacted with and displayed is up to you.
1. Allow all items to be filtered by "tags":
    - Add an additional row of filter buttons to the footer, which contains the unique set of "tags" which have been added.
    - Allow the user to click on an "tag" in this footer section to filter all of the incomplete, in progress and completed todos.
    - *Continuation of previous example:* once I've added "Urgent", and "Hiring" tags to one or more items, I should see two new filter buttons (one for "Urgent", one for "Hiring") and when I click one of these buttons it should filter the list of todos (complete, incomplete and in progress) to only those with the corresponding tag.
1. Under the "Completed Items", show a log of all "actions" taken. An "action" is any of the following:
    - Item name updated (NOTE: only "completed" updates, not each character change)
    - Item added
    - Item removed
    - Item status changed
    - Tag added
    - Tag removed
1. Improve the maintainability of the code
    - We're not looking for any specific style, but we're interested in how you think maintable code should look.

## How to Use
1. clone the repository
1. `npm install`
1. `npm start` which will open a pre-built Storybook story for demonstration.

## Improvement Ideas
1. Getting a Linter installed to control the look and feel of the code.  I have left linter out to highlight how I keep my code clean by default - #high
1. Not sure if something like extractTagsFromUserInput should be inside the store or elsewhere.  This feels like a helper function that should sit outside of the 'store' concept. Need to research this if time permits.
1. When forcing an update on the tags it would be easier to only act on the items that have been processed.
1. The overuse of the word item in the codebase (my doing), will fix if time permitting
1. Use an important file (sass) to import variables for style colors
1. Use a framework to build out css instead of from scratch
1. Code Smell Areas - Class names best practices. Component design (should be more components for buttons and such.  Bare minimum understanding of React (only use Vue.js before).  Overall CSS / Layout, no reset file, no mobile design :(.
