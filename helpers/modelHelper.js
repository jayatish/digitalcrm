'use strict';

class modelHelper {
    modelHelper() {

    }

    getModelName(model) {
        return model.name;
    }

    getModelDescription(model) {
        return model.description;
    }
}

module.exports = new modelHelper();