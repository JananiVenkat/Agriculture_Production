let fs = require('fs');
let readline = require('readline');
let arr=[];
let keyLine = readline.createInterface({
  input: fs.createReadStream('data/Production-Department_of_Agriculture_and_Cooperation_1.csv')// csv file
});
keyLine.on('line', (line) => { arr.push(line);  })
  .on('close', () => {out(arr);
  process.exit(0);
});

function out(arr)
{
  let row=arr.length;//csv rows
  let header=arr[0].split(','); //header part
  let col=header.length; 
  let inx=(header.indexOf(' 3-2013'))+1;

  oilseedsProduction();
  foodgrainsProduction();
  commercialCrops();
  riceProduction();

  /* ----Commercial Crops---- */

  function commercialCrops()
  {
    let inx1= (header.indexOf(' 3-1993'))+1;//storing the year index
    let inxN= (header.indexOf(' 3-2014'))+1;
    let arrValue=[];//storing the total values

    //Extracting the values for the required graph
    for(let j=inx1;j<=inx;j++)
    {
      let total=0;
      for(let i=0;i<row;i++)
      {
        var tempObject={};//object for commercial crops for the year 2013
        var headerNew=arr[i].split(',');
        var headerCol=headerNew[0]; //first column
        var count1=(headerCol.match(/Commercial Crops/i) || []).length; 
        var count2=(headerCol.match(/Jute and Mesta/g) || []).length;  
        if(count1==1 && (!(headerNew[j]=="NA")) && count2!=1)
        {    
          var production=Number(headerNew[j]);
          total=total+production;
        }  
      }//end row for loop
      tempObject["year"]=header[j-1].replace(' 3-','');
      tempObject["aggregateValue"]=total;
      arrValue.push(tempObject);
    
   }//end inx for loop    

   /*-------create Json file------*/
   fs.writeFileSync('output/CommercialCropsData.json',JSON.stringify(arrValue));  
  
  }//end function commercial crops 

  /*-----Oil Seeds Production-----*/

  function oilseedsProduction()
  {
    var keyValue=[];//array for storing the the key value pairs of oilseeds
    for(let i=0;i<row;i++)
    {
      let header1=arr[i].split(',');
      let col1=header1[0];
      let count1=(col1.match(/Oilseeds /i) || []).length;
      
    //Extracting the required data from the csv file
        if(count1>0)
       {
        let count2=(col1.match(/area/i) || []).length;
        let count3=(col1.match(/Production/g) || []).length;
        let count4=(col1.match(/yield/i) || []).length;
        let count5=(col1.match(/major crops/i) || []).length;
        
          if(count2==0 && count3==1 && count4==0 && count5==0)
          {
            let firstObj={};
            firstObj['Particulars']= header1[0].replace('Agricultural Production Oilseeds ','');
            firstObj['value']=header1[inx];
            keyValue.push(firstObj);
          }
        }
      
    }//end of loop  

     /*-------create Json file------*/
    fs.writeFileSync('output/OilseedsData.json',JSON.stringify(keyValue));
      
         
  }//end function oilseeds production

    /*-----Food Grains Production------*/
  function foodgrainsProduction()
  {
    let keyValue1=[];//array for storing foodgrains and production  
    for(let i=0;i<row;i++)
    {
      let header2=arr[i].split(',');
      let col2=header2[0];
      let count=(col2.match(/Foodgrains /i) || []).length; //finds all foodgrains in the csv
      
      //Extracting the required data from the csv file
      if(count>0)
      {
        let count1=(col2.match(/area/i) || []).length;
        let count2=(col2.match(/volume/i) || []).length;
        let count3=(col2.match(/yield/i) || []).length;
        let count4=(col2.match(/Production/g) || []).length;
        let count5=(col2.match(/major crops/i) || []).length;
        if(count1==0 && count2==0 && count3==0 && count4==1 && count5==0)
        {
          let secondObj = {};
          secondObj['Particulars']=header2[0].replace('Agricultural Production Foodgrains ','');
          secondObj['value'] = header2[inx];
          keyValue1.push(secondObj);     
        }
      }
    }//end of loop  

     /*-------create Json file------*/
    fs.writeFileSync('output/FoodgrainsData.json',JSON.stringify(keyValue1));
       
  
  }//end foodgrainsProduction     
  
  /*-------Rice Production------*/

  function riceProduction()
  {
    let keyValue2=[]; 
    let firstYear=header.indexOf(' 3-1993');//storing the year index
    let lastYear=header.indexOf(' 3-2014')+1;

    //extracting the values for the given graph
    for(let i=firstYear;i<lastYear;i++)
    {
     let rice_Prod_Obj={};
     for(let j=0;j<row;j++)
     {
        let headerNew=arr[j].split(',');//the required rows for the rice production
        let headerCurrent=headerNew[0];
        rice_Prod_Obj['year']=header[i].replace(' 3-', '');
        
        let occurence=(headerCurrent.match(/Rice Yield/g) || []).length;
        if(occurence>0)
        {
          let count1=(headerCurrent.match(/Andhra Pradesh/g) || []).length;
          let count2=(headerCurrent.match(/Karnataka/g) || []).length;
          let count3=(headerCurrent.match(/Kerala/g) || []).length;
          let count4=(headerCurrent.match(/Tamil Nadu/g) || []).length;
          if( count1>0 || count2>0 || count3>0 || count4>0)
          {
            //assigning 0 for NA
            if(headerNew[i+1]=="NA")
            {
               headerNew[i+1]="0";
            }
              rice_Prod_Obj[headerNew[0].replace('Agricultural Production Foodgrains Rice Yield ','')]=Number(headerNew[i+1]);
          }
        }
      }//end of loop
      keyValue2.push(rice_Prod_Obj);
    }// end of loop

     /*-------create Json file------*/                    
    fs.writeFileSync('output/StateRiceProductionData.json',JSON.stringify(keyValue2));
  }//end Rice production

}//end of function



