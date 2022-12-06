const async = require("async");
const _Order = require('../models').ORDER;
const _Owner = require('../models').OWNER;
const moment = require('moment-timezone');

function chartData(monthArray, ownerId, timezone, month = 0) {
    return new Promise((resolve, reject) => {
        let startDtTimeStamp = (new Date(new Date(monthArray.startDate).toLocaleString('en-US', {timeZone: timezone}))).getTime();
        let endDtTimeStamp = (new Date(new Date(monthArray.endDate).toLocaleString('en-US', {timeZone: timezone}))).getTime();
                        
        let whereClause = {
            owner_id: ownerId,
            status: 1,
            order_time: {
                $gte: startDtTimeStamp,
                $lte: endDtTimeStamp
            }
        }
        _Order.read(whereClause, 'chart')
            .then(orderResult => {
                // console.log('orderResult.length ==> ', monthArray);
                orderResult.month = month + 1;
                resolve(orderResult);
            })
            .catch(error => {
                // console.log('error ==> ', error);
                reject(error);
            });
    })
}
class chartController {
    constructor() {}

    getReport(req, res, next) {
        if(!req.body.type || req.body.type==='' || !req.body.year || !req.body.timezone || req.body.timezone==='') {
            res.message = "Parameters missing";
            next()
        } else {
            var ownerWhereClause = {
                token_list: {
                    $elemMatch: {
                        access_token: req.headers.auth_token
                    }
                }
            };
            _Owner.read(ownerWhereClause)
                .then(ownerResponse => {
                    let type = req.body.type;
                    let getYear = req.body.year;
                    let timezone = req.body.timezone;
                    let monthArray = [];
                    let monthNameArray = [];
                    if(type==='Month') {
                        for(let i=0; i<12; i++) {
                            monthArray.push({
                                startDate: getYear+'-'+(i+1)+'-1 00:00:01',
                                endDate: getYear+'-'+(i+1)+'-'+new Date(getYear, i +1, 0).getDate()+' 23:59:59'
                            })
                        };
                        monthNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    } if (type==='Quarter') {
                        for(let i=0; i<4; i++) {
                            let startMonthNumber = (4*i)-i;
                            monthArray.push({
                                startDate: getYear+'-'+(startMonthNumber+1)+'-1 00:00:01',
                                endDate: getYear+'-'+(startMonthNumber+3)+'-'+new Date(getYear, startMonthNumber+3, 0).getDate()+' 23:59:59'
                            })
                        }
                        monthNameArray = ['Jan - Mar', 'Apr - Jun', 'Jul - Sep', 'Oct - Dec'];
                    } if (type==='Year') {
                        monthArray.push({
                            startDate: getYear+'-1-1 00:00:01',
                            endDate: getYear+'-12-'+new Date(getYear, 12, 0).getDate()+' 23:59:59'
                        });
                        monthNameArray = ['Jan - Dec'];
                    }
                    //console.log('MonthArray => ', monthArray);
                    const promises = [];
       
                    for (let i = 0; i < monthArray.length; ++i) {
                        promises.push(chartData(monthArray[i], ownerResponse._id, timezone, i));
                    }                       
                    Promise.all(promises)
                        .then((chartResponse) => {
                            // console.log("All done", chartResponse);
                            let dataOutput = [];
                            if(chartResponse.length) {
                                chartResponse.map((dataObject, dataIndex) => {
                                    let totalPrice = 0;
                                    let clientObj = [];
                                    let clientDetails = {};
                                    let productObj = [];
                                    let productDetails = {};
                                    dataObject.map(otherObject => {
                                        totalPrice = totalPrice + otherObject.price_after_discount;
                                        // Start to integrate client details
                                        if(otherObject.price_after_discount) {
                                            if(clientObj.findIndex(x => x.client_id === otherObject.client_details._id)!==-1) {
                                                let clientIndex = clientObj.findIndex(x => x.client_id === otherObject.client_details._id);
                                                clientObj[clientIndex].client_price = clientObj[clientIndex].client_price+otherObject.price_after_discount;
                                            } else {
                                                clientObj.push({
                                                    client_id: otherObject.client_details._id,
                                                    client_obj: otherObject.client_details,
                                                    client_price: otherObject.price_after_discount
                                                })
                                            }
                                        }
                                        // End to intergrate client details
                                        // Start to integrate product details
                                        let innerProductObj = {};
                                        otherObject.details.sort(function(a, b) {
                                            return parseFloat(b.price) - parseFloat(a.price);
                                        });
                                        innerProductObj = otherObject.details[0];
                                        if(innerProductObj.price) {
                                            if(productObj.findIndex(x => x.product_id === innerProductObj._id)!==-1) {
                                                let productIndex = productObj.findIndex(x => x.product_id === innerProductObj._id);
                                                productObj[productIndex].product_price = productObj[productIndex].product_price+innerProductObj.price;
                                            } else {
                                                productObj.push({
                                                    product_id: innerProductObj._id,
                                                    product_name: innerProductObj.product.name,
                                                    product_price: innerProductObj.price
                                                })
                                            }
                                        }
                                        // End to integrate product details
                                    });
                                    if(clientObj.length) {
                                        clientObj.sort(function(a, b) {
                                            return parseFloat(b.client_price) - parseFloat(a.client_price);
                                        });
                                        let clientNameArray = [];
                                        if(clientObj[0].client_obj.first_name!='') {
                                            clientNameArray.push(clientObj[0].client_obj.first_name);
                                        } if(clientObj[0].client_obj.last_name!='') {
                                            clientNameArray.push(clientObj[0].client_obj.last_name);
                                        }
                                        clientDetails = {
                                            client_id: clientObj[0].client_id,
                                            client_name: (clientNameArray.length)? clientNameArray.join(' '):'',
                                            total_price: clientObj[0].client_price
                                        }
                                    }
                                    if(productObj.length) {
                                        productObj.sort(function(a, b) {
                                            return parseFloat(b.product_price) - parseFloat(a.product_price);
                                        });
                                        productDetails = {
                                            product_id: productObj[0].product_id,
                                            product_name: productObj[0].product_name,
                                            total_price: productObj[0].product_price
                                        }
                                    }
                                    dataOutput.push({
                                        month: dataObject.month,
                                        monthNameArray: monthNameArray[dataObject.month-1],
                                        total_price: totalPrice,
                                        client_details: clientDetails,
                                        product_details: productDetails
                                    })
                                })
                            }
                            return res.json({
                                'status': 1,
                                'message': 'Get List',
                                'dataArray': dataOutput
                            })
                        })
                        .catch((error) => {
                            // Handle errors here
                            res.message = error.msg;
                            next();
                        });
                    
                })
                .catch(ownerError => {
                    res.message = ownerError.msg;
                    next();
                })
        }
    }


    productReport(req, res, next) {
        if(!req.body.type || req.body.type==='' || !req.body.year || !req.body.timezone || req.body.timezone==='') {
            res.message = "Parameters missing";
            next()
        } else {
            var ownerWhereClause = {
                token_list: {
                    $elemMatch: {
                        access_token: req.headers.auth_token
                    }
                }
            };
            _Owner.read(ownerWhereClause)
                .then(ownerResponse => {
                    let type = req.body.type;
                    let getYear = req.body.year;
                    let timezone = req.body.timezone;
                    let pageNumber = req.body.page_number;
                    let itemCounter = req.body.page_count;
                    let startIndexNumber = (pageNumber*itemCounter)-itemCounter;
                    let pruductListData = [];
                    let barChartData = [];
                    let monthArray = [];
                    let monthNameArray = [];
                    if(type==='Month') {
                        for(let i=0; i<12; i++) {
                            monthArray.push({
                                startDate: getYear+'-'+(i+1)+'-1 00:00:01',
                                endDate: getYear+'-'+(i+1)+'-'+new Date(getYear, i +1, 0).getDate()+' 23:59:59'
                            })
                        };
                        monthNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        
                    } if (type==='Quarter') {
                        for(let i=0; i<4; i++) {
                            let startMonthNumber = (4*i)-i;
                            monthArray.push({
                                startDate: getYear+'-'+(startMonthNumber+1)+'-1 00:00:01',
                                endDate: getYear+'-'+(startMonthNumber+3)+'-'+new Date(getYear, startMonthNumber+3, 0).getDate()+' 23:59:59'
                            })
                        }
                        monthNameArray = ['Jan - Mar', 'Apr - Jun', 'Jul - Sep', 'Oct - Dec'];
                    } if (type==='Year') {
                        monthArray.push({
                            startDate: getYear+'-1-1 00:00:01',
                            endDate: getYear+'-12-'+new Date(getYear, 12, 0).getDate()+' 23:59:59'
                        });
                        monthNameArray = ['Jan - Dec'];
                    }
                    let monthObject = monthArray[(type!=='Year')?monthNameArray.indexOf(req.body.month):0]
                    let startProductDtTimeStamp = (new Date(new Date(monthObject.startDate).toLocaleString('en-US', {timeZone: timezone}))).getTime();
                    let endProductDtTimeStamp = (new Date(new Date(monthObject.endDate).toLocaleString('en-US', {timeZone: timezone}))).getTime();
                    let whereProductClause = {
                        owner_id: ownerResponse._id,
                        status: 1,
                        order_time: {
                            $gte: startProductDtTimeStamp,
                            $lte: endProductDtTimeStamp
                        }
                    }
                    let productArray = [];
                    _Order.read(whereProductClause, 'chart')
                        .then(orderResponse => {
                            // console.log('orderResponse ==> ', orderResponse);
                            if(orderResponse.length) {
                                orderResponse.map(orderObject => {
                                    orderObject.details.map(productObject => {
                                        productArray.push(productObject);
                                    })
                                })
                            }
                            let productResponseArray = [];
                            for(let i=0; i<productArray.length; i++) {
                                if(productArray[i].price) {
                                    if(productResponseArray.findIndex(x => x.product_id===productArray[i].product._id)!==-1) {
                                        let productChartIndex = productResponseArray.findIndex(x => x.product_id===productArray[i].product._id);
                                        let productQuantity = productResponseArray[productChartIndex].total_quantity+productArray[i].quantity;
                                        productResponseArray[productChartIndex].total_quantity = productQuantity;
                                        productResponseArray[productChartIndex].total_price = productResponseArray[productChartIndex].total_price+(productArray[i].quantity*productArray[i].price);
                                    } else {
                                        productResponseArray.push({
                                            product_id: productArray[i].product._id,
                                            product_name: productArray[i].product.name,
                                            total_quantity: productArray[i].quantity,
                                            total_price: (productArray[i].quantity*productArray[i].price)
                                        })
                                    }
                                }
                            }
                            // console.log('productResponseArray ==> ', productResponseArray);
                            if(productResponseArray.length) {
                                productResponseArray.sort(function(a, b) {
                                    return parseFloat(b.total_quantity) - parseFloat(a.total_quantity);
                                });
                                // productResponseArray.slice(0, 5);
                                let productQuantitySameArr = [],
                                    productQuantityCheckArr = [];
                                productResponseArray.map(singleProduct => {
                                    if(productQuantityCheckArr.indexOf(singleProduct.total_quantity)!==-1) {
                                        productQuantitySameArr.push(singleProduct.total_quantity);
                                    } else {
                                        productQuantityCheckArr.push(singleProduct.total_quantity);
                                    }
                                });
                                if(productQuantitySameArr.length) {
                                    for(let j=0;j<productQuantitySameArr.length;j++) {
                                        let productTotalPriceArr = [],
                                            productTotalIndexArr = [];
                                        productResponseArray.map((singleProduct, singleIndex) => {
                                            if(singleProduct.total_quantity===productQuantitySameArr[j]) {
                                                productTotalIndexArr.push(singleIndex);
                                                productTotalPriceArr.push(singleProduct);
                                            }
                                        });
                                        productTotalPriceArr.sort(function(a, b) {
                                            return parseFloat(b.total_price) - parseFloat(a.total_price)
                                        });
                                        productTotalPriceArr.map((singleObject, singleIndex) => {
                                            productResponseArray[productTotalIndexArr[singleIndex]] = singleObject;
                                        })
                                    }
                                }
                                // console.log('productQuantitySameArr ==> ', productQuantitySameArr);
                                barChartData = productResponseArray.slice(0, 5);
                                pruductListData = productResponseArray.slice(startIndexNumber, (pageNumber*itemCounter));
                            }
                            return res.json({
                                'status': 1,
                                'message': 'Get List',
                                'total_page': Math.ceil(productResponseArray.length/itemCounter),
                                'barChartData': barChartData,
                                'allData': pruductListData
                            })
                        })
                        .catch(error => {
                            res.message = error.msg;
                            next();
                        })
                })
                .catch(ownerError => {
                    res.message = ownerError.msg;
                    next();
                })
        }
    }

    productDetailReport(req, res, next) {
        if(!req.body.type || req.body.type==='' || 
            !req.body.product_id || req.body.product_id==='' || 
            !req.body.timezone || req.body.timezone==='') {
            res.message = "Parameters missing";
            next()
        } else {
            var ownerWhereClause = {
                token_list: {
                    $elemMatch: {
                        access_token: req.headers.auth_token
                    }
                }
            };
            _Owner.read(ownerWhereClause)
                .then(ownerResponse => {
                    let productName = '';
                    let product_id = req.body.product_id;
                    let timezone = req.body.timezone;
                    let type = req.body.type;
                    let pageNumber = req.body.page_number;
                    let itemCounter = req.body.page_count;
                    let startIndexNumber = (pageNumber*itemCounter)-itemCounter;
                    var dateObj = new Date();
                    // let getYear = dateObj.getFullYear();
                    let getYear = req.body.year;
                    let getMonth = dateObj.getMonth();
                    let monthArray = [];
                    let monthNameArray = [];
                    let monthFullNameArray = [];
                    let monthQuarterArray = [{
                        month: 'Jan',
                        quarter: 'Jan - Mar'
                    }, {
                        month: 'Feb',
                        quarter: 'Jan - Mar'
                    }, {
                        month: 'Mar',
                        quarter: 'Jan - Mar'
                    }, {
                        month: 'Apr',
                        quarter: 'Apr - Jun'
                    }, {
                        month: 'May',
                        quarter: 'Apr - Jun'
                    }, {
                        month: 'Jun',
                        quarter: 'Apr - Jun'
                    }, {
                        month: 'Jul',
                        quarter: 'Jul - Sep'
                    }, {
                        month: 'Aug',
                        quarter: 'Jul - Sep'
                    }, {
                        month: 'Sep',
                        quarter: 'Jul - Sep'
                    }, {
                        month: 'Oct',
                        quarter: 'Oct - Dec'
                    }, {
                        month: 'Nov',
                        quarter: 'Oct - Dec'
                    }, {
                        month: 'Dec',
                        quarter: 'Oct - Dec'
                    }];
                    let monthObject = {};
                    if(type==='Month') {
                        monthNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        monthFullNameArray = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        let startWholeMonth = {
                            startDate: getYear+'-1-1 00:00:01',
                            endDate: getYear+'-12-'+new Date(getYear, 12, 0).getDate()+' 00:00:01'
                        }
                        monthObject = startWholeMonth;
                    } if (type==='Quarter') {
                        for(let i=0; i<4; i++) {
                            let startMonthNumber = (4*i)-i;
                            monthArray.push({
                                startDate: getYear+'-'+(startMonthNumber+1)+'-1 00:00:01',
                                endDate: getYear+'-'+(startMonthNumber+3)+'-'+new Date(getYear, startMonthNumber+3, 0).getDate()+' 23:59:59'
                            })
                        }
                        monthNameArray = ['Jan - Mar', 'Apr - Jun', 'Jul - Sep', 'Oct - Dec'];
                        monthObject = monthArray[monthNameArray[monthQuarterArray[getMonth].quarter]];
                    } if (type==='Year') {
                        monthArray.push({
                            startDate: getYear+'-1-1 00:00:01',
                            endDate: getYear+'-12-'+new Date(getYear, 12, 0).getDate()+' 23:59:59'
                        });
                        monthNameArray = ['Jan - Dec'];
                        monthObject = monthArray[0];
                    }
                    let startProductDtTimeStamp = (new Date(new Date(monthObject.startDate).toLocaleString('en-US', {timeZone: timezone}))).getTime();
                    let endProductDtTimeStamp = (new Date(new Date(monthObject.endDate).toLocaleString('en-US', {timeZone: timezone}))).getTime();
                    let whereProductDetailClause = {
                        owner_id: ownerResponse._id,
                        status: 1,
                        startProductDtTimeStamp: startProductDtTimeStamp,
                        endProductDtTimeStamp: endProductDtTimeStamp,
                        product_id: product_id
                    }
                    _Order.productDetailReport(whereProductDetailClause)
                        .then(orderResponse => {
                            let dataArray = [];
                            orderResponse.map(orderObject => {
                                let getMonthName = new Date(orderObject.order_time).getMonth();
                                // productName = orderObject.details[0].product.name;
                                if(orderObject.details[0].price) {
                                    if(dataArray.findIndex(x => x.monthName === monthNameArray[getMonthName])!==-1) {
                                        let monthIndex = dataArray.findIndex(x => x.monthName === monthNameArray[getMonthName]);
                                        if(dataArray[monthIndex].clientDetails.findIndex(x => x.company_id.toString()===orderObject.client_id.toString())!==-1) {
                                            let clientIndex = dataArray[monthIndex].clientDetails.findIndex(x => x.company_id.toString()===orderObject.client_id.toString());
                                            let clientTotalQuantity = dataArray[monthIndex].clientDetails[clientIndex].quantity+orderObject.details[0].quantity;
                                            let clientTotalAmount = dataArray[monthIndex].clientDetails[clientIndex].total_amount+(orderObject.details[0].quantity*orderObject.details[0].price);
                                            dataArray[monthIndex].clientDetails[clientIndex].quantity = clientTotalQuantity;
                                            dataArray[monthIndex].clientDetails[clientIndex].total_amount = clientTotalAmount;
                                        } else {
                                            dataArray[monthIndex].clientDetails.push({
                                                company_id: orderObject.client_id.toString(),
                                                company_name: orderObject.client_details.company_name,
                                                quantity: orderObject.details[0].quantity,
                                                total_amount: (orderObject.details[0].quantity*orderObject.details[0].price)
                                            })
                                        }
                                    } else {
                                        dataArray.push({
                                            monthName: monthNameArray[getMonthName],
                                            clientDetails: [{
                                                company_id: orderObject.client_id,
                                                company_name: orderObject.client_details.company_name,
                                                quantity: orderObject.details[0].quantity,
                                                total_amount: (orderObject.details[0].quantity*orderObject.details[0].price)
                                            }],
                                            monthWiseTotalAmount: 0
                                        })
                                    }
                                }
                            });
                            dataArray.map(dataObject => {
                                dataObject.clientDetails.map(clientObject => {
                                    dataObject.monthWiseTotalAmount = dataObject.monthWiseTotalAmount+clientObject.total_amount
                                })
                                dataObject.clientDetails.sort(function(a, b) {
                                    return parseFloat(b.total_amount) - parseFloat(a.total_amount);
                                });
                            });
                            
                            let allSumData = [];
                            let clientListData = [];
                            for(let i=0; i<monthNameArray.length; i++) {
                                if(dataArray.findIndex(x => x.monthName === monthNameArray[i])!=-1) {
                                    let indexNumber = dataArray.findIndex(x => x.monthName === monthNameArray[i]);
                                    allSumData.push({
                                        total_amount: dataArray[indexNumber].monthWiseTotalAmount,
                                        month: i+1,
                                        monthNameArray: monthNameArray[i]
                                    });
                                    dataArray[indexNumber].clientDetails.map(clientObject => {
                                        clientListData.push({
                                            month: monthFullNameArray[i],
                                            month_no: i+1,
                                            company_id: clientObject.company_id,
                                            company_name: clientObject.company_name,
                                            quantity: clientObject.quantity,
                                            total_amount: clientObject.total_amount
                                        })
                                    })
                                } else {
                                    allSumData.push({
                                        total_amount: 0,
                                        month: i+1,
                                        monthNameArray: monthNameArray[i]
                                    });
                                    clientListData.push({
                                        month: monthFullNameArray[i],
                                        month_no: i+1,
                                        company_id: '',
                                        company_name: '',
                                        quantity: 0,
                                        total_amount: 0
                                    })
                                }
                            }
                            let allData = clientListData.slice(startIndexNumber, (pageNumber*itemCounter));
                            let startMonthIndex = getMonth-4;
                            if(startMonthIndex<=0) {
                                startMonthIndex = 0;
                            }
                            let endMonthIndex = getMonth;
                            let barChartData = [];
                            for(let i=startMonthIndex;i<=endMonthIndex;i++) {
                                barChartData.push(allSumData[i]);
                            }

                            return res.json({
                                'status': 1,
                                'message': 'Get List',
                                'total_page': Math.ceil(clientListData.length/itemCounter),
                                'product_name': productName,
                                'allData': allData,
                                'dataBarchart': barChartData,
                                'dataByMonth': allSumData
                            })
                        })
                        .catch(orderError => {

                        })
                    
                })
                .catch(ownerError => {
                    console.log('ownerError ==> ', ownerError);
                    res.message = ownerError.msg;
                    next();
                })
            
        }   
    }

    productStaticDetailReport(req, res, next) {
        if(!req.body.type || req.body.type==='' || 
            !req.body.timezone || req.body.timezone==='') {
            res.message = "Parameters missing";
            next()
        } else {
            var ownerWhereClause = {
                token_list: {
                    $elemMatch: {
                        access_token: req.headers.auth_token
                    }
                }
            };
            _Owner.read(ownerWhereClause)
                .then(ownerResponse => {
                    // console.log('ownerResponse ==> ', ownerResponse);
                    let type = req.body.type;
                    let productDetailPageNumber = req.body.page_number;
                    let productDetailItemCounter = req.body.page_count;
                    let productDetailStartIndexNumber = (productDetailPageNumber*productDetailItemCounter)-productDetailItemCounter;
                    let data = [];
                    let barData = [];
                    if(type=='Month') {
                        barData = [
                            {
                                month: 'Jan',
                                total_amount: 600
                            }, {
                                month: 'Apr',
                                total_amount: 400
                            }, {
                                month: 'May',
                                total_amount: 350
                            }, {
                                month: 'Nov',
                                total_amount: 200
                            }
                        ];
                        data = [
                            {
                                month: 'Jan',
                                month_no: 1,
                                company_id: '1',
                                company_name: 'One',
                                quantity: 1,
                                total_amount: 10
                            },
                            {
                                month: 'Jan',
                                month_no: 1,
                                company_id: '2',
                                company_name: 'Two',
                                quantity: 2,
                                total_amount: 20
                            },
                            {
                                month: 'Feb',
                                month_no: 2,
                                company_id: '3',
                                company_name: 'Three',
                                quantity: 3,
                                total_amount: 30
                            },
                            {
                                month: 'Feb',
                                month_no: 2,
                                company_id: '4',
                                company_name: 'Four',
                                quantity: 4,
                                total_amount: 40
                            },
                            {
                                month: 'Mar',
                                month_no: 3,
                                company_id: '5',
                                company_name: 'Five',
                                quantity: 5,
                                total_amount: 50
                            },
                            {
                                month: 'Mar',
                                month_no: 3,
                                company_id: '6',
                                company_name: 'Six',
                                quantity: 6,
                                total_amount: 60
                            },
                            {
                                month: 'Apr',
                                month_no: 4,
                                company_id: '7',
                                company_name: 'Seven',
                                quantity: 7,
                                total_amount: 70
                            },
                            {   
                                month: 'Apr',
                                month_no: 4,
                                company_id: '8',
                                company_name: 'Eight',
                                quantity: 8,
                                total_amount: 80
                            },
                            {
                                month: 'May',
                                month_no: 5,
                                company_id: '9',
                                company_name: 'Nine',
                                quantity: 9,
                                total_amount: 90
                            },
                            {
                                month: 'May',
                                month_no: 5,
                                company_id: '10',
                                company_name: 'Ten',
                                quantity: 10,
                                total_amount: 100
                            },
                            {
                                month: 'Jun',
                                month_no: 6,
                                company_id: '11',
                                company_name: 'Eleven',
                                quantity: 11,
                                total_amount: 110
                            },
                            {   
                                month: 'Jun',
                                month_no: 6,
                                company_id: '12',
                                company_name: 'Twelve',
                                quantity: 12,
                                total_amount: 120
                            },
                            {
                                month: 'Jul',
                                month_no: 7,
                                company_id: '13',
                                company_name: 'Thirteen',
                                quantity: 13,
                                total_amount: 130
                            },
                            {
                                month: 'Jul',
                                month_no: 7,
                                company_id: '14',
                                company_name: 'Fourteen',
                                quantity: 14,
                                total_amount: 140
                            },
                            {
                                month: 'Aug',
                                month_no: 8,
                                company_id: '15',
                                company_name: 'Fifteen',
                                quantity: 15,
                                total_amount: 150
                            },
                            {
                                month: 'Aug',
                                month_no: 8,
                                company_id: '16',
                                company_name: 'Sixteen',
                                quantity: 16,
                                total_amount: 160
                            },
                            {
                                month: 'Sep',
                                month_no: 9,
                                company_id: '17',
                                company_name: 'Seventeen',
                                quantity: 17,
                                total_amount: 170
                            },
                            {   
                                month: 'Sep',
                                month_no: 9,
                                company_id: '18',
                                company_name: 'Eighteen',
                                quantity: 18,
                                total_amount: 180
                            },
                            {
                                month: 'Oct',
                                month_no: 10,
                                company_id: '19',
                                company_name: 'Nineteen',
                                quantity: 19,
                                total_amount: 190
                            },
                            {
                                month: 'Oct',
                                month_no: 10,
                                company_id: '20',
                                company_name: 'Twenty',
                                quantity: 20,
                                total_amount: 200
                            },
                            {
                                month: 'Nov',
                                month_no: 11,
                                company_id: '21',
                                company_name: 'Twentyone',
                                quantity: 21,
                                total_amount: 210
                            },
                            {
                                month: 'Nov',
                                month_no: 11,
                                company_id: '22',
                                company_name: 'Twentytwo',
                                quantity: 22,
                                total_amount: 220
                            },
                            {
                                month: 'Dec',
                                month_no: 12,
                                company_id: '23',
                                company_name: 'Twentythree',
                                quantity: 23,
                                total_amount: 230
                            },
                            {
                                month: 'Dec',
                                month_no: 12,
                                company_id: '24',
                                company_name: 'Twentyfour',
                                quantity: 24,
                                total_amount: 240
                            }
                        ]
                    } if (type=='Quarter') {
                        barData = [
                            {
                                month: 'Jan - Mar',
                                total_amount: 900
                            }, {
                                month: 'Apr - Jun',
                                total_amount: 500
                            }, {
                                month: 'Jul - Sep',
                                total_amount: 450
                            }, {
                                month: 'Oct - Dec',
                                total_amount: 350
                            }
                        ];
                        data = [
                            {
                                month: 'Jan - Mar',
                                month_no: 1,
                                company_id: '1',
                                company_name: 'One',
                                quantity: 1,
                                total_amount: 10
                            },
                            {
                                month: 'Jan - Mar',
                                month_no: 1,
                                company_id: '2',
                                company_name: 'Two',
                                quantity: 2,
                                total_amount: 20
                            },
                            {
                                month: 'Jan - Mar',
                                month_no: 1,
                                company_id: '3',
                                company_name: 'Three',
                                quantity: 3,
                                total_amount: 30
                            },
                            {
                                month: 'Jan - Mar',
                                month_no: 1,
                                company_id: '4',
                                company_name: 'Four',
                                quantity: 4,
                                total_amount: 40
                            },
                            {
                                month: 'Apr - Jun',
                                month_no: 2,
                                company_id: '5',
                                company_name: 'Five',
                                quantity: 5,
                                total_amount: 50
                            },
                            {
                                month: 'Apr - Jun',
                                month_no: 2,
                                company_id: '6',
                                company_name: 'Six',
                                quantity: 6,
                                total_amount: 60
                            },
                            {
                                month: 'Apr - Jun',
                                month_no: 2,
                                company_id: '7',
                                company_name: 'Seven',
                                quantity: 7,
                                total_amount: 70
                            },
                            {   
                                month: 'Apr - Jun',
                                month_no: 2,
                                company_id: '8',
                                company_name: 'Eight',
                                quantity: 8,
                                total_amount: 80
                            },
                            {
                                month: 'Jul - Sep',
                                month_no: 3,
                                company_id: '9',
                                company_name: 'Nine',
                                quantity: 9,
                                total_amount: 90
                            },
                            {
                                month: 'Jul - Sep',
                                month_no: 3,
                                company_id: '10',
                                company_name: 'Ten',
                                quantity: 10,
                                total_amount: 100
                            },
                            {
                                month: 'Jul - Sep',
                                month_no: 3,
                                company_id: '11',
                                company_name: 'Eleven',
                                quantity: 11,
                                total_amount: 110
                            },
                            {   
                                month: 'Jul - Sep',
                                month_no: 3,
                                company_id: '12',
                                company_name: 'Twelve',
                                quantity: 12,
                                total_amount: 120
                            },
                            {
                                month: 'Oct - Dec',
                                month_no: 4,
                                company_id: '13',
                                company_name: 'Thirteen',
                                quantity: 13,
                                total_amount: 130
                            },
                            {
                                month: 'Oct - Dec',
                                month_no: 4,
                                company_id: '14',
                                company_name: 'Fourteen',
                                quantity: 14,
                                total_amount: 140
                            },
                            {
                                month: 'Oct - Dec',
                                month_no: 4,
                                company_id: '15',
                                company_name: 'Fifteen',
                                quantity: 15,
                                total_amount: 150
                            },
                            {
                                month: 'Oct - Dec',
                                month_no: 4,
                                company_id: '16',
                                company_name: 'Sixteen',
                                quantity: 16,
                                total_amount: 160
                            }
                        ]
                    }
                    let detailsData = data.slice(productDetailStartIndexNumber, (productDetailPageNumber*productDetailItemCounter));
                    return res.json({
                        'status': 1,
                        'message': 'Get List',
                        'total_page': 10,
                        'barChartData': barData,
                        'allData': detailsData
                    })
                })
                .catch(ownerError => {
                    res.message = ownerError.msg;
                    next();
                })
            
        }
    }
}
module.exports = new chartController();