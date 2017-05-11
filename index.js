const fs = require('fs');
const readLine = require('readline');

const col = ' 3-2013';
var arr = [];
var inx = null;
var key = null;
var keyInx = 13;
var sumArr = [];

// Southern States

var state = ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu'];
var stateinx;
var jsonOilseedData = [];
var jsonFoodgrainsData = [];
var jsonCommercialCropData = [];
var jsonRiceProduction = [];

var readStream = fs.createReadStream('data/Production-Department_of_Agriculture_and_Cooperation_1.csv');

var lineReader = readLine.createInterface({
  input: readStream
});

lineReader.on('line',function(line){
  var data = line.split(',');
  key = key || data;
  inx = inx || data.indexOf(col);
  var productionName = data[0];

   // oilseed crop type vs .production
   if(productionName.indexOf('Oilseeds') !== -1 && data[inx + 1] !== 'NA'){
     jsonOilseedData.push({'Particulars' : productionName , '3-2013' : data[inx + 1]});
   }

   //Foodgrains type vs. production
   if(productionName.indexOf('Foodgrains') !== -1 && data[inx + 1] !== 'NA'){
     jsonFoodgrainsData.push({'Particulars' : productionName , '3-2013' : data[inx + 1]});
   }

   //Aggregate commercial crops
   if(productionName.indexOf('Commercial') !== -1){
      var i = 0;
      data.forEach(function(element, index){
        sumArr[i] = sumArr[i] || 0;
        if(index > 13){
          if(element == 'NA')
            element = 0;

          sumArr[i] += parseInt(element);
          i++;
        }
      })
    }

    //stacked chart of rice production
    if(productionName.indexOf('Rice Yield') !== -1){
      var tempState = 0;
      var tempObj = {};
      var keyInx = 13;
      stateinx = stateinx || 0;
      data.forEach(function(element, index){
        if(index > 13){
            if(element == 'NA')
              element = 0;

            if(productionName.indexOf(state[stateinx]) !== -1){
              if(!tempObj.hasOwnProperty('Particulars')){
                tempObj['Particulars'] = state[stateinx];
              }
              if(!tempObj.hasOwnProperty('total')){
                tempObj['total'] = 0;
              }
              var keyVal = key[keyInx];
              tempObj[keyVal] = parseInt(element);
              tempObj['total'] += parseInt(element);
              keyInx += 1;
            }
        }
      });
      if(productionName.indexOf(state[stateinx]) !== -1){
        jsonRiceProduction.push(tempObj);
        stateinx += 1;
      }
    }
})

lineReader.on('close', function(){
    //Sorting
    jsonOilseedData.sort(function(x,y){
      if(x['3-2013'] == y['3-2013']){
        return 0;
      }else {
        return parseInt(x['3-2013']) > parseInt(y['3-2013']) ? -1 : 1;
      }
    });

    jsonFoodgrainsData.sort(function(x,y){
      if(x['3-2013'] == y['3-2013']){
        return 0;
      }else {
        return parseInt(x['3-2013']) > parseInt(y['3-2013']) ? -1 : 1;
      }
    });

    /// all commercial crops and plot the aggregated value vs. year
    sumArr.forEach(function(element, index){
      var year = key[keyInx].slice(3,7);
      jsonCommercialCropData.push({
        'Year' : year,
        'aggregateValue' :  element/5
      });
      keyInx += 1;
    })

    jsonCommercialCropData.sort(function(x,y){
      if(x.aggregateValue == y.aggregateValue){
        return 0;
      }else {
        return x.aggregateValue > y.aggregateValue ? 1 : -1;
      }
    })

    //Creating JSON file 
    fs.writeFileSync('Json/OilseedData.json', JSON.stringify(jsonOilseedData), encoding='utf-8');
    fs.writeFileSync('Json/FoodgrainData.json', JSON.stringify(jsonFoodgrainsData), encoding='utf-8');
    fs.writeFileSync('Json/CommercialCropsData.json', JSON.stringify(jsonCommercialCropData), encoding='utf-8');
    fs.writeFileSync('Json/StateRiceProductionData.json', JSON.stringify(jsonRiceProduction), encoding='utf-8');
})
