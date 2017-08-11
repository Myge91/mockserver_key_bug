sap.ui.define([
	"sap/ui/core/util/MockServer"
], function (MockServer) {
	"use strict";
 
	return {
 
		init: function (sODataServiceUrl) {
			var oMockServer, sLocalServicePath, aRequests, oErrorResponse, fnResponse;
 
			// create
			oMockServer = new MockServer({
				rootUri: sODataServiceUrl
			});
 
			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 1
			});
			sLocalServicePath = jQuery.sap.getModulePath("db_cockpit/localService/ZPM_S_COCKPIT_SRV");
 
			// simulate
			oMockServer.simulate(sLocalServicePath + "/metadata.xml", {
				sMockdataBaseUrl : sLocalServicePath + "/mockdata",
				bGenerateMissingMockData: false
			});
 
			// start
			oMockServer.start();
			
			var dMockDate = new Date("2017-07-24T22:00:00.00Z");
				// overwrite Date constructor to deliver mockdate combined with current time for a zero arguments call i.e. new Date()
            	var UTC = Date.UTC;
            	var DateOriginal = Date;
				Date = function () {
				    	var date;
				        if (arguments.length === 0) {
				        	date = new DateOriginal();
				        	date.setFullYear(dMockDate.getFullYear(), dMockDate.getMonth(), dMockDate.getDate());
				        } else {
		            		var q = [];
		            		for(var i = 0; i < arguments.length; i++)
		            			q.push("arguments[" + i + "]");
		            		date = eval("new DateOriginal(" + q.join(",") + ")");
				        }
				        return date;
				    };
				Date.prototype = DateOriginal.prototype;
				Date.DateOriginal = DateOriginal;
				Date.UTC = UTC;
				Date.now = function() {
					return new Date().getTime();
				};
				
				Date.timezoneOffset = function() {
					return 0;	
				};

		}
 
	};
 
});