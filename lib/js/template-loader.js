// Array of tags to be created and populated with templates
// in the template folder
var arr = ['navbar', 'results-modal'];

arr.forEach(function (val, index) {
    CreateTag(val);
});

page_templates.forEach(function (val) {
    CreateTag(val);
})


// This method create html custom tags
// the convention is to use <comp353-"filename">
function CreateTag(tag_name) {
    var tag = Object.create(HTMLLinkElement.prototype);

    tag.createdCallback = function () {
        this.innerHTML = LoadTemplate(this, tag_name);
    }
    document.registerElement('comp353-' + tag_name, {prototype: tag});
}

// This method is responsible for loading a template from "templates"
// Folder based on the "template_name" passed as a parameter using
// Ajax request and load the content in the "tag"
// In google chrome you will need a local server in order to allow the
// Browser to access the file system. is should be fine on the production
// Server
function LoadTemplate(tag, template_name) {
    $.ajax({
        url: '../templates/' + template_name + ".html",
        dataType: 'text',
        success: function (data) {
            tag.innerHTML = data;
        },
        error: function (data) {
            alert(template_name + " didn't load");
        }

    });

};
