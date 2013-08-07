define(function() {
        
        /**
         * The QueryString utility can be used to retrieve URL parameter
         * values from the query string, given the name of the parameter.
         *
         * @param { String } name - The name of the parameter to retrieve.
         */
        var QueryString = function(name) {

            var name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.search);

            if(results === null) {
                return "";
            } else {
                return decodeURIComponent(results[1].replace(/\+/g, " "));
            }
        }

        return QueryString;
            
    }

);