module.exports = imgUpload;

function imgUpload() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var canvas = document.createElement("canvas");
            var extensions = 'jpeg, jpg, png, gif';
            
            elem.on('change', function() {
                if (!elem[0].files.length) {
                    return;
                }
                reader.readAsDataURL(elem[0].files[0]);
                var filename = elem[0].files[0].name;

                var extensionlist = filename.split('.');
                var extension = extensionlist[extensionlist.length - 1].toLocaleLowerCase();
                if (extensions.indexOf(extension) == -1)
                    alert("文件扩展名，只允许'jpeg'、'jpg'、'png'、'gif'、'bmp'");
                else {
                    scope.file = elem[0].files[0];
                    scope.imageName = filename;
                }
            });

            var reader = new FileReader();
            reader.onload = function(e) {
                scope.image = e.target.result;
                scope.$apply();
            }
        }
    }
}