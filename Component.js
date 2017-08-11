sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"db_cockpit/model/models",
	"sap/m/MessageBox",
	"sap/ui/model/odata/v2/ODataModel"
], function(UIComponent, Device, models, MessageBox, ODataModel) {
	"use strict";

	return UIComponent.extend("db_cockpit.Component", {

		metadata: {
			manifest: "json"
		},
		
		_bMessageOpen: false,

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.getModel().attachMetadataFailed(function (oEvent) {
                var oDialog = new sap.m.Dialog();
                oDialog.setTitle(oEvent.getParameter("message"));
                oDialog.addContent(new sap.m.Text("", {text: oEvent.getParameter("statusCode") + " " + oEvent.getParameter("statusText")}));
                oDialog.addButton(new sap.m.Button({
                    text: "OK", press: function () {
                        oDialog.close();
                    }
                }));
                oDialog.setState(sap.ui.core.ValueState.Error);
                oDialog.open();
            });
            
            this.getModel().attachMetadataLoaded(function(oEvent) {
            	this.getModel().setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            	this.getModel().setChangeGroups({
					"*": {groupId: "changes", single: true}
				});
            }.bind(this));
			
			/**/
			
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this._initErrorHandler();	
		},
		
		_initErrorHandler: function() {
			this._oDataModel = this.getModel();
			this._oDataModel.attachRequestFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				if (oParams.response.statusCode == "504") {
					this._sErrorText = this.getModel("i18n").getProperty("tooManyResults");
					this._showServiceError();
				} else  if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf("Cannot POST") === 0)) {
					this._showServiceError(oParams.response);
				}
			}, this);
		},
		
		/**
		 * Shows a {@link sap.m.MessageBox} when a service call has failed.
		 * Only the first error message will be display.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showServiceError: function (sDetails, bError) {
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			MessageBox[bError === true ? "error" : "information"](
				this._sErrorText,
				{
					id: "serviceErrorMessageBox",
					details: sDetails,
					actions: [MessageBox.Action.CLOSE],
					onClose: function () {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);	
		},
	});
});
