module.exports = setFocus;

function setFocus() {
    return  function(scope, element) {
        element[0].focus();
    };
}