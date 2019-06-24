# Equal spacing

Adds a large number of random points. Each iteration of the algorithm then finds the average distance between each dot and its N-nearest neighbours. It then applies a force to each point from each of its nearest neighbours. The force is proportional to the difference between the distance from said neighbour and the population average distance.

Whilst the algorithm doesn't equally space every object, it does clump them nicely into fairly organic looking bunches where the points are fairly evenly spaced from each other.  

Finding the N nearest neighbours is very computationally expensive so will update to use Quadtrees to improve the speed. Paper: [Ranking in Spatial Databases](https://dl.acm.org/citation.cfm?id=718930)
