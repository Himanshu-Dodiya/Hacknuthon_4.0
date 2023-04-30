# Hacknuthon_4.0
```
NOTE :- every single file is an different system or say different server so all server(File) need to be started.
```

## How To Start Server
```
1. cd to that file
2. npm install
3. npm start
-- if not having nodemon you can do 
3. node File Name
```

## APIs
```
1. shop-1
 - /sellItem - POST - {id,name,quantity}
 - /itemChange - POST

2. graphQl
 - /getAllNames - query{
    addName{
        orderId: String!,orderName: String!, orderPrice: String, orderQuantity: String!
    }
 }

 3.warehouse - middleware
  - /itemSell - POST - internally called
  methods - internal which update the database
```

## how to connect database
```
1. create config.env file in warehouse
2. create a mongodb database and copy the node js connection link
3. insert below data in config file
 - URL=url data
 - PASSWORD=your password for db access
4.you can uncomment the middleware code to insert dummy data.
```


npm start will start the server on different port and postman can be used to fire all the apis