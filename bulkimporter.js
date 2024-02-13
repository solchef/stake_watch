const fs = require('fs');
const csv = require('csv-parser');
const { exit } = require('process');


const bukkExport = () =>{


const data = [];

fs.createReadStream('./1900.csv')

  .pipe(csv())
  .on('data', async (row) => {

    console.log(row);

    // exit();

    const brand = row['Brand'];
    const brandURL = row['Brand_URL'];
    const collection = row['Collection'];
    const collectionURL = row['Collection_URL'];
    const reference = row['Reference'];
    const style = row['Style'];
    const styleURL = row['Style_URL'];
    const complications = row['Complications'];
    const complicationsURL = row['Complications_URL'];
    const features = row['Features'];
    const features1 = row['Features1'];
    const featuresURL = row['Features_URL'];
    const features2 = row['Features2'];
    const featuresURL1 = row['Features_URL1'];
    const features3 = row['Features3'];
    const featuresURL2 = row['Features_URL2'];
    const features4 = row['Features4'];
    const featuresURL3 = row['Features_URL3'];
    const features5 = row['Features5'];
    const featuresURL4 = row['Features_URL4'];
    const features6 = row['Features6'];
    const featuresURL5 = row['Features_URL5'];
    const bezelMaterial = row['BezelMaterial'];
    const bezelMaterialURL = row['BezelMaterial_URL'];
    const crystal = row['Crystal'];
    const crystalURL = row['Crystal_URL'];
    const caseMaterial = row['CaseMaterial'];
    const caseMaterialURL = row['CaseMaterial_URL'];
    const dialNumerals = row['DialNumerals'];
    const dialNumeralsURL = row['DialNumerals_URL'];
    const caseDiameter = row['CaseDiameter'];
    const caseDiameterURL = row['CaseDiameter_URL'];
    const dialColor = row['DialColor'];
    const dialColor1 = row['DialColor1'];
    const dialColorURL = row['DialColor_URL'];
    const dialColor1URL = row['DialColor_URL1'];
    const waterResistance = row['WaterResistance'];
    const waterResistanceURL = row['WaterResistance_URL'];
    const movementType = row['MovementType'];
    const movementTypeURL = row['MovementType_URL'];
    const frequency = row['Frequency'];
    const frequencyURL = row['Frequency_URL'];
    const numberOfJewels = row['NumberofJewels'];
    const numberOfJewelsURL = row['NumberofJewels_URL'];
    const powerReserve = row['PowerReserve'];
    const powerReserveURL = row['PowerReserve_URL'];
    const movementCaliber = row['MovementCaliber'];
    const model = row['Model'];

    
    const connections = [
      {
        name: 'Manufacturer',
        value: row['Manufacturer']
      },
      {
        name: 'Retailer',
        value: row['Retailer']
      }
    ];

    const jsonData = {
      title: title,
      meta: {
        "market-price": marketPrice,
        "retail-price": retailPrice,
        "last_market-index-position": lastIndexPosition,
        "percentage-change": percentageChange,
        "last-index-weight": lastWeight,
        "featured-image": featuredImage,
        "watch-description": watchDescription,
        "market-value": marketValue,
        "6m-change": sixMonthsChange,
        "group-name": groupName,
        "brand": {
          "name": brandName,
          "country": brandCountry
        },
        "collections": collections,
        "styles": styles,
        "case-material": caseMaterial,
        "features": features,
        "reference": references,
        "number-of-jewels": numberOfJewels,
        "power-reserve": powerReserve,
        "frequency": frequency,
        "movement-caliber": movementCaliber,
        "lug-width": lugWidth,
        "movement-type": movementType,
        "water_resistance": waterResistance,
        "bezel-material": bezelMaterials,
        "complication": complications,
        "crystal": crystals,
        "dial-color": dialColor,
        "dial-numerals": dialNumerals,
        "extra-case-fields": extraCaseFields,
        "connections": connections
      }
    };

    data.push(jsonData);
      
    const apiUrl =  "https://stakewatch.dubbydesign.com/wp-json/jet-cct/market_index";
    const response = await axios.post(apiUrl, data, { headers });

    console.log(response);
  })
  .on('end', () => {
    console.log(JSON.stringify(data, null, 2));
  })
}

// module.exports = bukkExport;

bukkExport()