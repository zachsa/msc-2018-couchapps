## nETL (node.js Extraction Transform load)
This library provides a general purpose framework for extracting, transforming and loading data. All these (extraction source, transformations, and loading) are configurable (see below for examples). The idea is simple - create an iterator over a source, and then incrementally extract from that source, apply transformations and load data.

## How to use
download the source, run `npm install`, and then (from the source code root directory) run `node index <path to config>`

## Config file
This is a JSON file in which all extractions, transformations and loads are configured. Included in the repository is a file `example.config.json` that shows all existing extraction, transform and load tasks. Of course, you can register your own tasks! (to be included in future documentation). Note that the config file can have any extension so long as the format is strictly json - so you may want to call your file `config`.


# Query Deployment
Execute one of following commands from the root folder of the design document

`couchapp push . http://admin:password@localhost:5984/two-way-join`
`couchapp push . http://admin:password@localhost:5984/three-way-join`
`couchapp push . http://admin:password@localhost:5984/variance`
`couchapp push . http://admin:password@localhost:5984/test`