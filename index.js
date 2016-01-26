var trello = require('node-trello'),
    _ = require('lodash'),
    util = require('./util'),
    pickInputs = {
        idList: { key: 'idList', validate: { req: true } }
    },
    pickOutputs = {
        dateLastActivity: { key: 'data', fields: ['dateLastActivity'] },
        due: { key: 'data', fields: ['due'] },
        email: { key: 'data', fields: ['email'] },
        idBoard: { key: 'data', fields: ['idBoard'] },
        idList: { key: 'data', fields: ['idList'] },
        name: { key: 'data', fields: ['name'] },
        shortLink: { key: 'data', fields: ['shortLink'] },
        url: { key: 'data', fields: ['url'] }
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var credentials = dexter.provider('trello').credentials(),
            t = new trello(_.get(credentials, 'consumer_key'), _.get(credentials, 'access_token'));
        var inputs = util.pickInputs(step, pickInputs),
            validationErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validationErrors)
            return this.fail(validationErrors);

        t.get("1/lists/" + inputs.idList + "/cards", function(err, data) {
            if (!err)
                this.complete(util.pickOutputs({data: data}, pickOutputs));
            else
                this.fail(err);
        }.bind(this));
    }
};
