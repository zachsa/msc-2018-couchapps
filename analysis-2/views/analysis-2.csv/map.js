/**
 * A simplified output of the map tasks for each document type
 * 
 * 1) Grades
 *    => [doc.anonIDnew, doc.Course, doc.RegAcadYear] : [doc.Percent]
 * 
 * 2) Demographics
 *    => [doc.anonIDnew, 0, 0] : [
 *         Gr12 Eng %,
 *         Gr12 Sci %,
 *         Gr12 Mth %,
 *         Gr12 Mth Lit %,
 *         Gr12 Mth Adv %,
 *         NBT AL %,
 *         NBT QL %,
 *         NBT Mth %
 *    ]
 * 
 * 3) Entities
 *    => [doc.uct_id, 0, year] : [S1 Event, S2 Event]
 *    // S1 and S2 are effectively binary fields, either 1 or 0
 * 
 * @param {Object} doc 
 */
function(doc) {
    /* Compound key */
    var id;
    var course;
    var year;

    /* Decision tree */
    var type = doc.type_;
    switch (type) {
        case 'grade':
            /* Key and other vars */
            var RegCareer = doc.RegCareer;
            id = doc.anonIDnew;
            course = doc.Course;
            year = doc.RegAcadYear;

            /* Filters */
            if (course !== 'CSC1015F') return;
            if (year !== 2016) return;
            if (RegCareer !== "UGRD") return;

            /* Value */
            var percent = doc.Percent || '';

            /* Normalize the percent field to a number */
            if (typeof percent !== 'number') {
                if (typeof percent !== 'string') return;
                var percentCleaned = percent.toUpperCase().trim();

                /* Return if percent is a disallowed symbol */
                if ([
                        'ATT',
                        'DE',
                        'GIP',
                        'LOA',
                        'OS',
                        'OSS',
                        'PA',
                        'SAT',
                        'UNS',
                        'AB',
                        ''
                    ].indexOf(percentCleaned) >= 0) return;

                /* Get the percentage */
                switch (percentCleaned) {
                    case 'F':
                        percent = 40;
                        break;
                    case 'DPR':
                        percent = 30;
                        break;
                    case 'INC':
                        percent = 30;
                        break;
                    case 'UF':
                        percent = 49;
                        break;
                    case 'UP':
                        percent = 45;
                        break;
                    default:
                        /* Convert percent to number */
                        percent = parseFloat(percent.substring(0, percent.length - 1));
                        if (isNaN(percent)) return;
                        break;
                };
            };

            /* Output */
            emit([id, course, year], percent);
            break;

        case 'benchmark':
            /* Key and other vars */
            var allowedCareers = ["UGRD", "First Year", "Second Year", "Third Year"];
            var allowedResidence = ["SA Citizen", "Permanent Resident", "C", "P"];
            id = doc.anonIDnew;
            course = 0;
            year = 0;

            /* Filters */
            if (allowedCareers.indexOf(career) < 0) return;
            if (allowedResidence.indexOf(residency) < 0) return;

            /* Value (each index corresponds to a benchmark) */
            var benchmarks = [0, 0, 0, 0, 0, 0, 0, 0];

            /* Normalize symbols to numbers */
            var fuDictionary = {
                "A*": 90,
                "A": 80,
                "B": 70,
                "C": 60,
                "D": 55,
                "E": 50
            };

            function getDemographicGrade(gr) {
                var g = parseInt(gr);
                var retG;
                if (isNaN(g)) { // True for symbols, false for numbers
                    if (typeof gr !== 'string') return 0;
                    retG = fuDictionary[gr.toUpperCase().trim()] || 0;
                } else {
                    retG = g;
                };
                return retG;
            };

            // Gr12 Eng
            var gEng12 = getDemographicGrade(doc["Eng Grd12 Fin Rslt"] || "");
            benchmarks[0] = gEng12;

            // Gr12 Sci
            var gSci12 = getDemographicGrade(doc["Phy Sci Grd12 Fin Rslt"] || "");
            benchmarks[1] = gSci12;

            // Gr12 Mth
            var gMth12 = getDemographicGrade(doc["Math Grd12 Fin Rslt"] || "");
            benchmarks[2] = gMth12;

            // Gr12 Mth Lit
            var gMthLit12 = getDemographicGrade(doc["Mth Lit Grd12 Fin Rslt"] || "");
            benchmarks[3] = gMthLit12;

            // Gr12 Mth Adv
            var gMthAdv12 = getDemographicGrade(doc["Adv Mth Grd12 Fin Rslt"] || "");
            benchmarks[4] = gMthAdv12;

            // NBT AL
            var gNbtAl = getDemographicGrade(doc["NBT AL Score"] || "");
            benchmarks[5] = gNbtAl;

            // NBT QL
            var gNbtQl = getDemographicGrade(doc["NBT QL Score"] || "");
            benchmarks[6] = gNbtQl;

            // NBT Mth
            var gNbtMth = getDemographicGrade(doc["NBT Math Score"] || "");
            benchmarks[7] = gNbtMth;

            /* Output */
            emit([id, course, year], benchmarks);
            break;

        case 'event':
            /* Key and other vars */
            var date = new Date(doc.event_date);
            var epoch = date.getTime();
            var event_id = doc.event_id;
            id = doc.uct_id;
            course = 0;
            year = date.getFullYear();

            /* Filter */
            if (doc.event_id !== 281) return;

            /* Value */
            var event = [0, 0];

            /* Midpoint =  Sunday, July 17, 2016 10:00:00 PM */
            var midDate = 1468792800000
            var semester = (epoch - midDate >= 0) ? 2 : 1;
            if (semester === 1) {
                event[0] = 1;
            } else {
                event[1] = 1;
            };

            /* Output */
            emit([id, course, year], event);
            break;

        default:
            break;
    };
};