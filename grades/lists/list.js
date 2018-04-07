function(head, req) {
    provides('csv', function() {
        var row;
        while (row = getRow()) {
            send(row + ",");
        };
    });
};