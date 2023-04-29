// fetch api using localhost:2000/name

// Path: Middleware\middleware.js

const graphql_client = require('graphql-client');
const client = graphql_client({
    url: 'http://localhost:2000/name',
});

const output = client.query(`
    query {
        name {
            name
        }
    }
`).then((data) => {
    console.log(data);
});


console.log("got data"  + output);