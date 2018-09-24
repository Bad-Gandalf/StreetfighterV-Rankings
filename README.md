# Milestone Project 2 - StreetFighter 5 Top 50 Professionals Dashboard
#### by Patrick Doherty

## CREATE A DATA DASHBOARD

The brief given for this project was:
- Build a data dashboard that visualizes a dataset of your choice
- Your data can be stored locally (e.g., in a js file) or sourced from an API
- Visualise your data using D3.js and dc.js
 
The dataset of my choice is from Capcom Pro Tour detailing the participants. This is based on the 
professional e-sport StreetFighter 5.
The data is stored locally on a csv file after being ripped from a website detailing the scores. 
I have used D3.js and dc.js to create a dashboard displaying charts regarding the Capcom Pro Tour. 

This information could be interesting to the players and the fans of the Fighting Game Community. By detailing
statistics such as these, people will have hard facts to help them decide upon which character to choose.
With more work it can also help the community track player form, season to season taking into account patches
for the game.

## UX

User wished to check statistics based on a particular variable, ie country, gender, team. They click on this 
variable in the form of a bar/slice of a chart and instantly we can see the rest of the charts adjust for that 
specific variable. 
Alot of users will struggle to make sense of these charts by just looking at them and reading the outputs. I have
included descriptions of what is happening beside or below each of the charts.
Even with descriptions attached to the charts this may not be enough. The user can click on "Start the Tour" and
they will be guided around each chart by intro.js. To further explain the features the dashboard possesses,
the tour will explain how to use these features such as clicking on bar/slices to isolate a particular variable,
as previously mentioned.


## Technolgies used:

- HTML, CSS, Javascript 
- [Bootstrap](https://getbootstrap.com/)
    - Used for its grid system to help in design going from mobile to larger displays.
- [crossfilter](https://github.com/crossfilter/crossfilter)
    - to parse and compare data
- [d3](https://d3js.org/)
    - to create charts from data
- [dc](https://dc-js.github.io/dc.js/)
    - to create charts from data
- [JQuery](https://jquery.com)
    - The project uses **JQuery** to simplify DOM manipulation.
- [queue](https://github.com/d3/d3-queue)
    - This allows us to await collection of data before running scripts.
- [intro.js](https://github.com/usablica/intro.js)
    - For guided tour of charts with explanations.

## Testing

- I carried out testing based on the UX section above. 
    - Select different bars/slices across the page to check for interactions
    - Take the tour. I followed the tour from start to finish testing all the buttons.
    - I took the tour backwards, making sure I checked every button that could be pressed.
    - I printed to the console any data that had been parsed and compared it to the csv file.
    - During development I checked for any errors in the console and eventually resolved all.
    - I considered developing Jasmine tests for the site however after some research it seemed a bit over the top, time-consuming and unnecessary for this simple site.
    


## The Future

I could potentially find an api for the data and run it through that, it would keep it up to date automatically.
If this were impossible I may use a webscraper to get the data whenever required.
More likely i will just create a recent csv if I ever wished to show it to any Streetfighter fans. 

## Deployment
I deployed the site to github pages, it can be found at "https://bad-gandalf.github.io/StreetfighterV-Rankings/". I only had one issue
with the deployment and that was the csv file could not be found. It was a simple fix though, as I removed backslash in front of the
address in graphs.js and it worked immediately. 


## Credits
- Shoryuken.com 
    - Provided the data from the Capcom Pro Tour from which I could make the dashboard. 

