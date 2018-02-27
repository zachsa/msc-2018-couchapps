function(head, req) {
    provides('csv', function() {
        /* Send the headers */
        var headers = "Year,StudentAnonID,Course,Course %,Gr12 Eng %,Gr12 Sci %,Gr12 Mth %,Gr12 Mth Lit %,Gr12 Mth Adv %,NBT AL %,NBT QL %,NBT Mth %,S1 Events, S2 Events";
        send(headers);

        /* Helper function to send line */
        function sendLine(obj) {
            /* Only send rows with info from all entities */
            if (obj.benchmark && obj.event && obj.grade) {
                /* Only send rows with all benchmarks */
                if (
                    obj["Course %"] !== 0 &&
                    obj["Gr12 Eng %"] !== 0 &&
                    obj["Gr12 Sci %"] !== 0 &&
                    obj["Gr12 Mth %"] !== 0 &&
                    obj["NBT AL %"] !== 0 &&
                    obj["NBT QL %"] !== 0 &&
                    obj["NBT Mth %"] !== 0
                ) {
                    var line =
                        "\n" + obj.year +
                        "," + obj.id +
                        "," + obj.course +
                        "," + obj["Course %"] +
                        "," + obj["Gr12 Eng %"] +
                        "," + obj["Gr12 Sci %"] +
                        "," + obj["Gr12 Mth %"] +
                        "," + obj["Gr12 Mth Lit %"] +
                        "," + obj["Gr12 Mth Lit %"] +
                        "," + obj["NBT AL %"] +
                        "," + obj["NBT QL %"] +
                        "," + obj["NBT Mth %"] +
                        "," + obj.S1 +
                        "," + obj.S2;
                    send(line);
                };
            };
        };

        /* Current function scope variables */
        var currentStudent = null;
        var currentYear = null;
        var currentLine = {};
        var key;
        var id;
        var course;
        var year;
        var value;

        /* Iterate through view results */
        while (row = getRow()) {

            /* Key */
            key = row.key;
            id = key[0];
            course = key[1];
            year = key[2];

            /* Value */
            value = row.value;

            /* Send previous line if it is a new student and then reset id */
            if (currentStudent !== id) {
                sendLine(currentLine);
                currentLine = {};
                currentStudent = id;
            };

            /* Append to/adjust current line */
            var type = (course === 0 && year === 0) ?
                'benchmark' : ((course === 0) ?
                    'event' : 'grade');

            switch (type) {
                case 'benchmark':
                    currentYear = null; // Reset currentYear
                    currentLine.benchmark = true;
                    currentLine.id = id;
                    currentLine["Gr12 Eng %"] = value[0];
                    currentLine["Gr12 Sci %"] = value[1];
                    currentLine["Gr12 Mth %"] = value[2];
                    currentLine["Gr12 Mth Lit %"] = value[3];
                    currentLine["Gr12 Mth Adv %"] = value[4];
                    currentLine["NBT AL %"] = value[5];
                    currentLine["NBT QL %"] = value[6];
                    currentLine["NBT Mth %"] = value[7];
                    break;

                case 'event':
                    currentLine.event = true;
                    currentLine.id = id;
                    currentLine.year = year // In case no benchmark or grade exists
                    currentLine.S1 = value[0];
                    currentLine.S2 = value[1];
                    break;

                case 'grade':

                    /* Send previous line if it is a new year */
                    if (currentYear !== year) {
                        sendLine(currentLine);
                        currentYear = year;
                    };

                    currentLine.grade = true;
                    currentLine.id = id; // In case no benchmark or event exists
                    currentLine.year = year;
                    currentLine.course = course;
                    currentLine["Course %"] = value;
                    break;

                default:
                    send({ error: "Document type unexpected" });
                    break;
            };
        };

        /* Send last line if required */
        sendLine(currentLine);
    });
};