/**
 * Returns a list of documents with the specified ids
 * @param {object} doc CouchDB parsed-JSON document
 */
function(doc) {
    if (doc.type_ !== 'grade') return;
    if (!doc.anonIDnew) return;

    /* RegCareer Filter */
    if (doc.RegCareer !== 'UGRD') return;

    /* Course Filter */
    var courseCode = doc.Course;
    var allowedCourses = ['CSC1015F'];
    if (allowedCourses.indexOf(courseCode) < 0) return;

    /* Emit document */
    emit(doc._id, doc.anonIDnew);
};