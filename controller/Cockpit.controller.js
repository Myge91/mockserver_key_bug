sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("db_cockpit.controller.Cockpit", {

        onClickMe: function(oEvent) {
            this.getView().getModel().read("/MPResultTreeSet(Cycle='%20%20%207%2C000000000000000')", {
                urlParameters: {"$expand":"MPGanttSet"},
            	success: function(oResult) {

                },
                error: function(oError) {
                }
            });
		},

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        onRoutePatternMatched: function (oEvent) {

        },

        onInit: function() {
            this.getRouter().getRoute("cockpit").attachPatternMatched(this.onRoutePatternMatched, this);
        },



        
    });
});
