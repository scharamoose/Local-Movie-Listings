# Local-Movie-Listings
JS Widget which uses Browser Geolocation to determine closest cinema and retrieve current listings and travel directions.

## Getting Started
Open Movies.html (preferably in Chrome... but any modern browser will do).

The user will be prompted to 'Allow or Deny' Geolocation access

After granting permission, the user's location will be loaded onto Google Maps, along with DRIVING directions to closest cinema.

Following that, all current movies showing will be retrieved, along with a detailed synopsis, ratings, genres and showtimes for each movie.

User can click on movie posters, and view current trailers.

## Caveats
If the user decides to deny permission, they are prompted to reconsider. The 'Try Again' button will attempt reload the page from the server. 

Due to different browsers handling of navigator permissions, the user's decision may be retained after reload. 

Pressing 'CTRL' + 'F5' keys may resolve the issue, but in some cases the user may have to force the permission change either through the browser's settings or clicking on the location denied icon to left of the address bar, if present.

## Apologies
Unit tests are a bit of a disaster zone, not used to QUnit.

