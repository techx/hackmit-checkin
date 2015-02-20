# HackMIT Checkin System

## Installation

* Download the driver software for [Windows][dymo-win] or [Mac][dymo-mac]

* Install the `montserrat.ttf` font on your computer

## Running

* Run the `server/server.py` server software
    * You can invoke this by running `./server/server.py`

* Open index.html in your web browser (Google Chrome recommended)

* When prompted about plugin installation by your web browser, make sure you
  allow the plugin to run

* If you are using Google Chrome, use Presentation Mode (go to `View`, and then
  click on `Enter Presentation Mode`).

## Usage

* Type to search for a name
    * Searching uses fuzzy search
    * Insert spaces between terms

* Use the up and down arrow keys to choose a name

* Use the right arrow key to enter custom data
    * When adding a mentor, put "y" in the mentor box

* Hit the enter key to make a selection

* Use the tab key (and shift+tab) to move between fields if they need to be edited

* Enter the number of luggage tags to print (0 to 5) if necessary

* The system will tell you if you need to hand out a TechCash card

* Press the escape key to reset the system

* Hit the enter key to print all tags

[dymo-win]: http://download.dymo.com/dymo/Software/Win/DLS8Setup.8.5.1.exe
[dymo-mac]: http://download.dymo.com/dymo/Software/Mac/DLS8Setup.8.5.1.dmg
