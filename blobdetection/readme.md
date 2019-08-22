# Blob detection / clustering

Random data is generated, biasing the data towards zero by using an exponent (currently 5) on the random number (betwen 0 and 1). Any values below a threshold are then set to 0. This is to provide random blobs that are fairly disjoint. This is then interpolated in 2 dimensions using cubic interpolation.

Once the data is generated the algorithm can then be applied. The data is thresholded. Below the threshold is set to 0. Above is set to 255. Each blob is then extracted and the bounding box calculated. The bounding boxes are drawn in green and each data point of the blob is drawn in red.

[Demo can be viewed here](http://static1.natfaulk.com/statics/algorithm_tests/blobdetection/blobdetect.html)
