sap.ui.define([
    "sap/ui/core/mvc/Controller"

], function(Controller) {
    "use strict";

    return Controller.extend("db_cockpit.controller.App", {

        /**
         * Convenience method for accessing the router in every controller of the application.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        onRoutePatternMatched: function (oEvent) {
        },

        onInit: function() {
            this.getRouter().getRoute("cockpit").attachPatternMatched(this.onRoutePatternMatched, this);
        }

    });
});
