# Path smoothing / interpolation

A very basic path smoothing algorithm to go from several waypoints to a smooth path with equally spaced points. The algortihm used is "chase the point". A point follows the path created by the initial waypoints and is effectively tethered to a second object. An equal speed is maintained at the following object by varying the speed of the lead object.

## Key

Red dots: initial path  
Black dots: lead object  
Blue dots: final path  
