Three versions of a simple drag-and-drop app.

Version 1: Store all positions in Mongo on every mouse move.  Works,
but updates are slow.

Version 2: Store all positions in a minimongo-backed in-memory
databse.  Fast, but restarting the server loses track of positions.

Version 3: A hybrid approach -- while dragging, store position in
memory; on drop, store in Mongo.

See the three revisions at
https://github.com/avital/drag-and-drop/commits/master