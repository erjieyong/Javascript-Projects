# yourstage
A PERN stack application to assist users with keeping track of cargo being staged after packing, but pending for driver pick up.

This application is currently hosted on heroku.

## Background
I created this stack after learning javascript and nodejs to solve an issue at work.

- In the warehousing industry, the general process for an outbound shipment is to
  - Pick from location
  - Packing of picked cargo
  - Staging of packed cargo
  - Release packed cargo to driver
- The issue arises when after the packing stage, the cargo is being staged the packing area without its own location. Generally at this stage, the cargo has also been pgi (post goods issued) from the warehouse management system. If this is not managed properly, it would be time-consuming to search for the packed cargo to release to driver. Chance of mix up will also increase dramatically
- This application aims to resolve the issue by allowing users to continue tracking the cargo location asynchronously with other users in the same warehouse

![picture alt](http://via.placeholder.com/200x150 "Title is optional")

## Screenshots
![picture alt](http://via.placeholder.com/200x150 "Title is optional")
