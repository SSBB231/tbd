    sap.ui.controller("app.controllers.library.LibraryRight", {
    onInit: function() {

    },
    onAfterRendering: function(html) {
        this.initServices();

        var controller = this;
        controller.bindElements();
        controller.bindEvents();
    },
    initServices: function() {
    },
    bindElements: function() {
        var controller = this;

        $("#toolbar").bindBaseLibraryToolbar({
            toolbarButtons: [{
                    text: 'save',
                    onPress: function() {
                        // console.log("yay");
                    },
                    isButton: true,
                    iconFont: "Finance-and-Office",
                    icon: "floppydisc"
                },
                {
                    text: 'cancel',
                    onPress: function() {
                        // console.log("nay")
                    },
                    isButton: true,
                    iconFont: "Sign-and-Symbols",
                    icon: "persign"
                }],
            hideGrid: true
        });

        $("#uf").bindBaseSelect({
            options: [{
                    key: "1",
                    name: "SP"
                }, {
                    key: "2",
                    name: "RJ"
                }],
            onChange: function(oldVal, newVal) {
                console.log(oldVal, newVal, this);
            }
        })
    },
    bindEvents: function() {
        var controller = this;
    }
});