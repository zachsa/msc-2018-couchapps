'use strict';
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const docs2Way = [
    { "anonIDnew": 1, "Eng Grd12 Fin Rslt": 84, "Math Grd12 Fin Rslt": 88, "Mth Lit Grd12 Fin Rslt": "", "Adv Mth Grd12 Fin Rslt": "", "Phy Sci Grd12 Fin Rslt": 94, "NBT AL Score": 80, "NBT QL Score": 76, "NBT Math Score": 89, "RegAcadYear": 2016, "type_": "benchmark" },
    { "RegAcadYear": 2016, "anonIDnew": 1, "Course": "CSC1015F", "Percent": 70, "type_": "grade" },
    { "anonIDnew": 2, "Eng Grd12 Fin Rslt": 76, "Math Grd12 Fin Rslt": 78, "Mth Lit Grd12 Fin Rslt": "", "Adv Mth Grd12 Fin Rslt": "", "Phy Sci Grd12 Fin Rslt": 76, "NBT AL Score": 75, "NBT QL Score": 58, "NBT Math Score": 61, "RegAcadYear": 2016, "type_": "benchmark" },
    { "RegAcadYear": 2016, "anonIDnew": 2, "Course": "CSC1015F", "Percent": 55, "type_": "grade" },
    { "anonIDnew": 3, "Eng Grd12 Fin Rslt": 75, "Math Grd12 Fin Rslt": 78, "Mth Lit Grd12 Fin Rslt": "", "Adv Mth Grd12 Fin Rslt": "", "Phy Sci Grd12 Fin Rslt": 84, "NBT AL Score": 0, "NBT QL Score": 0, "NBT Math Score": 0, "RegAcadYear": 2015, "type_": "benchmark" },
    { "RegAcadYear": 2015, "anonIDnew": 3, "Course": "CSC1015F", "Percent": 77, "type_": "grade" },
    { "anonIDnew": 4, "Eng Grd12 Fin Rslt": 82, "Math Grd12 Fin Rslt": 85, "Mth Lit Grd12 Fin Rslt": "", "Adv Mth Grd12 Fin Rslt": "", "Phy Sci Grd12 Fin Rslt": 94, "NBT AL Score": 73, "NBT QL Score": 71, "NBT Math Score": 86, "RegAcadYear": 2015, "type_": "benchmark" },
    { "RegAcadYear": 2015, "anonIDnew": 4, "Course": "CSC1015F", "Percent": 39, "type_": "grade" },
    { "RegAcadYear": 2016, "anonIDnew": 4, "Course": "CSC1015F", "Percent": 54, "type_": "grade" }

];
const docs3Way = [
    { "anonIDnew": 1, "Eng Grd12 Fin Rslt": 84, "Math Grd12 Fin Rslt": 88, "Mth Lit Grd12 Fin Rslt": "", "Adv Mth Grd12 Fin Rslt": "", "Phy Sci Grd12 Fin Rslt": 94, "NBT AL Score": 80, "NBT QL Score": 76, "NBT Math Score": 89, "RegAcadYear": 2016, "type_": "benchmark" },
    { "event_date": "2016-02-18T15:12:00.000Z", "event_id": 281, "uct_id": 1, "site_key": 50680, "type_": "event" },
    { "event_date": "2016-10-18T15:12:00.000Z", "event_id": 281, "uct_id": 1, "site_key": 27933, "type_": "event" },
    { "RegAcadYear": 2016, "anonIDnew": 1, "Course": "CSC1015F", "Percent": 70, "type_": "grade" },
    { "anonIDnew": 2, "Eng Grd12 Fin Rslt": 76, "Math Grd12 Fin Rslt": 78, "Mth Lit Grd12 Fin Rslt": "", "Adv Mth Grd12 Fin Rslt": "", "Phy Sci Grd12 Fin Rslt": 76, "NBT AL Score": 75, "NBT QL Score": 58, "NBT Math Score": 61, "RegAcadYear": 2016, "type_": "benchmark" },
    { "event_date": "2016-09-18T15:12:00.000Z", "event_id": 281, "uct_id": 2, "site_key": 27933, "type_": "event" },
    { "event_date": "2016-05-18T15:12:00.000Z", "event_id": 281, "uct_id": 2, "site_key": 50680, "type_": "event" },
    { "event_date": "2016-05-19T15:12:00.000Z", "event_id": 281, "uct_id": 2, "site_key": 27933, "type_": "event" },
    { "RegAcadYear": 2016, "anonIDnew": 2, "Course": "CSC1015F", "Percent": 55, "type_": "grade" },
    { "anonIDnew": 3, "Eng Grd12 Fin Rslt": 75, "Math Grd12 Fin Rslt": 78, "Mth Lit Grd12 Fin Rslt": "", "Adv Mth Grd12 Fin Rslt": "", "Phy Sci Grd12 Fin Rslt": 84, "NBT AL Score": 0, "NBT QL Score": 0, "NBT Math Score": 0, "RegAcadYear": 2015, "type_": "benchmark" },
    { "event_date": "2016-04-18T15:12:00.000Z", "event_id": 281, "uct_id": 3, "site_key": 50680, "type_": "event" },
    { "event_date": "2016-04-18T15:12:00.000Z", "event_id": 281, "uct_id": 3, "site_key": 27933, "type_": "event" },
    { "event_date": "2016-05-18T15:12:00.000Z", "event_id": 281, "uct_id": 3, "site_key": 27933, "type_": "event" },
    { "event_date": "2016-06-18T15:12:00.000Z", "event_id": 281, "uct_id": 3, "site_key": 31585, "type_": "event" },
    { "anonIDnew": 4, "Eng Grd12 Fin Rslt": 82, "Math Grd12 Fin Rslt": 85, "Mth Lit Grd12 Fin Rslt": "", "Adv Mth Grd12 Fin Rslt": "", "Phy Sci Grd12 Fin Rslt": 94, "NBT AL Score": 73, "NBT QL Score": 71, "NBT Math Score": 86, "RegAcadYear": 2015, "type_": "benchmark" },
    { "event_date": "2016-11-18T15:12:00.000Z", "event_id": 281, "uct_id": 4, "site_key": 31585, "type_": "event" },
    { "RegAcadYear": 2016, "anonIDnew": 4, "Course": "CSC1015F", "Percent": 54, "type_": "grade" }
];

/**
 * Runtime evaluation loads functions into the maps and list objects
 * Global environment cannot be modified when using 'strict' mode
 * So eval("var fn = function() {...}") isn't allowed
 */
const maps = {};
const lists = {};
eval(`maps["2-way"] = ${fs.readFileSync(__dirname + '/../two-way-join/views/2-way-join.csv/map.js')}`);
eval(`maps["3-way"] = ${fs.readFileSync(__dirname + '/../three-way-join/views/3-way-join.csv/map.js')}`);
eval(`lists["2-way"] = ${fs.readFileSync(__dirname + '/../two-way-join/lists/2-way-join.js')}`);
eval(`lists["3-way"] = ${fs.readFileSync(__dirname + '/../three-way-join/lists/3-way-join.js')}`);

/**
 * Evaluated functions can only (easily) access global scope variables
 * These variables are reset for every test, so tests MUST be synchronous
 */
var mappedDocs;
var listResuts;

/* CouchDB function stubs */
function emit(v1, v2) { mappedDocs.push([v1, v2]); };

function provides(str, cb) { cb(); };

function send(str) { listResuts.push(str); };

/* More complicated getRow function stub */
const iterator = (function*() {
    var i = 0;
    while (docs2Way[i]) {
        yield docs2Way[i];
        i++;
    };
})();

function getRow() {
    var currentRow = iterator.next();
    if (currentRow.done) {
        return false;
    } else {
        mappedDocs = [];
        maps["2-way"](currentRow.value);
        if (mappedDocs[0]) return { key: mappedDocs[0][0], value: mappedDocs[0][1] }
    };
};

/**
 * Run 2-Way tests
 */
(function run2WayTests() {
    describe('2-Way Join:', function() {
        describe('Map Function', function() {
            mappedDocs = [];
            docs2Way.forEach(function(doc, i) {
                maps["2-way"](doc);
            });
            it("Emits the correct keys for grade and benchmark docs", function() {
                assert.deepEqual(mappedDocs[0][0], [2448646, 0, 0]);
                assert.deepEqual(mappedDocs[1][0], [2448646, 'CSC1015F', 2016]);
                assert.deepEqual(mappedDocs[2][0], [2448647, 'CSC1015F', 2014]);
            });
            it("Translates grades to numbers correctly", function() {
                assert.deepEqual(mappedDocs[0][1], [82, 96, 94, 0, 0, 64, 72, 86]);
                assert.equal(mappedDocs[2][1], 30);
                assert.equal(mappedDocs[3][1], 30);
                assert.equal(mappedDocs[4][1], 49);
                assert.equal(mappedDocs[5][1], 45);
                assert.equal(mappedDocs[6][1], 99);
            });
            it("Doesn't emit docs for ignored symbols", function() {
                assert.equal(mappedDocs[7], undefined);
            });
        });
        describe('List Function', function() {
            listResuts = [];
            // Run the List function in the it() cb to force synchronous
            it('Run generator..', function() {
                lists["2-way"](null, null);
            });
            it('Headers should be emitted', function() {
                assert.deepEqual(listResuts[1], '\n2016,2448646,CSC1015F,40,82,96,94,0,0,64,72,86');
            });
            it('Join of student grade and benchmark should be correct', function() {
                assert.deepEqual(listResuts[1], '\n2016,2448646,CSC1015F,40,82,96,94,0,0,64,72,86');
            });
        });
    });
})();

/**
 * Run 3-Way tests
 */
(function run3WayTests() {
    describe('3-Way Join:', function() {
        describe('Map Function', function() {
            it("...", function() {
                mappedDocs = [];
            });
        });
        describe('List Function', function() {
            it('...', function() {

            });
        });
    });
})();