# http-iterable

Http with the power of iterables

## Steps

1. Init request - post the initial request. We will create a id for the request and create a redis entitiy, the key will be the id and the value is the query and the projection fields. we will return the next(id)

2. Then we are starting to iterate with a get request which contain the id(the redis key as well).

3. In the `client.js` file you can look how the client makes the request.

ITS BEAUTIFUL
