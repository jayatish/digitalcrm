// const Redis = require('../services/redis');
// let redis = new Redis();

class Utility {

    /**
     * This function is used for covvert mongoose object to simple 
     * javascript object
     * @param  {object} obj [mongoose obejct]
     * @return {Object}     [simple javascript object]
     */
    mongooseObjectToSimpleObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * [This function is used for get a random number between a specific range]
     * @param  {[Number]} min [The minimum value of the range]
     * @param  {[Number]} max [The maximum value of the range]
     * @return {[Number]}     [The random number between min and max]
     */
    getRandomNumberWithinRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * This function is used to pick particular value from an array.
     * @param  {Array} arr         [The array of value]
     * @return {Number/String}     [The picked value]
     */
    selectOneValueFromAnArray(arr) {
        let index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    /**
     * [This function is checked that Id is valid mongoose Object Id ]
     * @param  {[String]} id [The Id]
     * @return {[Boolean]}    [description]
     */
    checkObjectIdValidation(id) {
        var checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

        if (id === "undefined") {
            return false;
        }
        return checkForHexRegExp.test(id);
    };
    /**
     * [This function is used to conevet normal string to mongoose Id ]
     * @param  {[String]} id [The Id]
     * @return {[Boolean]}    [description]
     */
    convertNormalIdtoMongooseObjectId(id) {
        var mongoose = require('mongoose');
        return mongoose.Types.ObjectId(id);
    }
    /**
       This function is used get indexof a particular value in array.
       It is only used to fetch in the array which has duplicate values.
    */
    getIndexOfValue(arr, value) {
        let index = [];
        for (var i = 0; i < arr.length; i++) {

            if (arr[i] === value) {
                index.push(i);
            }

        }
        return index;

    }

    /**
     * This function is used for add process by the process id 
     * in the redis.
     * @param {Object} worker  The newly created process.
     */
    // addProcessInRedis(worker) {
    //     return new Promise((resolve, reject) => {

    //         let allProcess;

    //         redis.hmget("workerProcess")
    //             .then(obj => {

    //                 (!obj) && (allProcess = {})

    //                 allProcess = obj;
    //                 console.log("allProcess:- ", allProcess)
    //                 // allProcess[worker.pid] = worker;
    //                 redis.hmset("workerProcess", allProcess);
    //                 resolve(worker);
    //             })

    //     })
    // }
    /**
     * This function is used for delete process by the process id 
     * in the redis
     * 
     * @param  {String} workerId   The worker id
     
     */
    // deleteIdFromRedis(workerId) {
    //     return new Promise((resolve, reject) => {

    //         let allProcess;

    //         redis.hmget("workerProcess")
    //             .then(obj => {


    //                 if (obj) {
    //                     allProcess = obj;

    //                     delete allProcess[workerId];

    //                     redis.hmset("workerProcess", allProcess);
    //                     resolve();
    //                 } else {

    //                     resolve()
    //                 }

    //             })

    //     })
    // }

    /**
     * This function is used for getting the difference two arry
     * @param  {Array} mainArray  [description]
     * @param  {Array} childArray [description]
     * @return {Array}            [description]
     */
    getDifferenceTwoArrays(mainArray, childArray) {

        let differArry;

        differArry = mainArray.filter(function (i) { return childArray.indexOf(i) < 0; });

        return differArry

    }
    /**
     * This function is used for getting the common part between two arry
     * @param  {Array} mainArray  [description]
     * @param  {Array} childArray [description]
     * @return {Array}            [description]
     */
    getCommonPartTwoArrays(mainArray, childArray) {
        let commonArry;

        commonArry = mainArray.filter(function (i) { return childArray.indexOf(i) >= 0; });

        return commonArry

    }

    /**
     * This function is used to find occurrence the particular item
     * @param  {Array} arr  The array of item
     * @return {Object}     
     */
    getDuplicatedValueinArray(arr) {


        let duplicate = {}

        const count = arr =>
            arr.reduce((a, b) =>
                Object.assign(a, {
                    [b]: (a[b] || 0) + 1
                }), {})

        let latest = count(arr)

        for (var i in latest) {

            if (latest[i] > 1) {
                duplicate[i] = latest[i]
            }

        }


        return duplicate;


    }


}

module.exports = new Utility();