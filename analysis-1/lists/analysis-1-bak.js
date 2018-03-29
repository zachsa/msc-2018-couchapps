function(head, req) {
    provides('csv', function() {
        /* Send the headers */
        var headers = "Year,StudentAnonID,Course,Course %,Gr12 Eng %,Gr12 Sci %,Gr12 Mth %,Gr12 Mth Lit %,Gr12 Mth Adv %,NBT AL %,NBT QL %,NBT Mth %";
        send(headers);

        /* Helper function to send line */
        function sendLine(obj) {
            /* Only take lines with benchmark and grade */
            if (obj.benchmark && obj.grade) {
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
                        "," + obj["Gr12 Mth %"] +
                        "," + obj["Gr12 Mth Lit %"] +
                        "," + obj["Gr12 Mth Lit %"] +
                        "," + obj["NBT AL %"] +
                        "," + obj["NBT QL %"] +
                        "," + obj["NBT Mth %"];
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
        var row;
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
            var type = (course === 0 && year === 0) ? 'benchmark' : 'grade';
            switch (type) {
                case 'benchmark':
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

                case 'grade':

                    /* Send previous line if it is a new year */
                    if (currentYear !== year) {
                        sendLine(currentLine);
                        currentYear = year;
                    };

                    currentLine.grade = true;
                    currentLine.id = id; // In case no demographic doc exists
                    currentLine.year = year;
                    currentLine.course = course;
                    currentLine["Course %"] = value;
                    break;

                default:
                    continue;
            };
        };

        /* Send last line if required */
        sendLine(currentLine);
    });
};