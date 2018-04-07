function(head, req) {
    provides('html', function() {
        var row;
        while (row = getRow()) {
            var val = row.value.anonIDnew;
            send(val + "<br>");
        };
    });
};