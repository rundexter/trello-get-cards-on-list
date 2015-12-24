var trello = require('node-trello'),
    _ = require('lodash'),
    util = require('./util'),
    pickInputs = {
        "idList": "idList"
    },
    pickOutputs = {
        '-': {
            keyName: 'data',
            fields: {
                dateLastActivity: 'dateLastActivity',
                due: 'due',
                email: 'email',
                idBoard: 'idBoard',
                idList: 'idList',
                name: 'name',
                shortLink: 'shortLink',
                url: 'url'
            }
        }
    };

module.exports = {
    authOptions: function (dexter) {
        if (!dexter.environment('trello_api_key') || !dexter.environment('trello_token')) {
            this.fail('A [trello_api_key] or [trello_token] environment variables are required for this module');
            return false;
        } else {
            return {
                api_key: dexter.environment('trello_api_key'),
                token: dexter.environment('trello_token')
            }
        }
    },
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(dexter);

        if (!auth) return;

        var t = new trello(auth.api_key, auth.token);
        var inputs = util.pickStringInputs(step, pickInputs);

        if (_.isEmpty(inputs.idList)) {
            return this.fail('A [idList] variable is required for this module');
        } else {
            var listId = inputs.idList;
        }

        t.get("1/lists/" + listId + "/cards", function(err, data) {
            if (!err) {
                this.complete(util.pickResult({data: data}, pickOutputs));
            } else {
                this.fail(err);
            }
        }.bind(this));
    }
};
