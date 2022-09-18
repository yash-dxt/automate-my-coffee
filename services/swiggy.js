const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const url = "https://www.swiggy.com/";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Caution: These delay(1000) are used to wait for the loading time. 
 * 
 * It takes in an address, a dish and a number of results and returns an array of objects containing
 * the name of the cafe, the delivery time, the price of the dish and the name of the dish.
 * @param address - The address where you want to order from.
 * @param dish - The dish you want to order.
 * @param [numberOfResults=25] - The number of results you want to fetch.
 * @returns An array of cafes you can order from.
 */

async function fetchAllCafes(address, dish, numberOfResults=25){

    if(!address || !dish){
        throw "I can't deliver to boo & can't deliver boo";
    }
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get(url);

    const locationTextBox = await driver.findElement(By.id("location")); 
    locationTextBox.sendKeys(address);
    
    await delay(1000);

    const firstOption = await driver.findElement(By.className("_2W-T9"));
    firstOption.click();
    
    await delay(3000);

    const searchButton = await driver.findElement(By.xpath("//span[text()='Search']"))
    
    searchButton.click();
    
    await delay(1000);

    const searchTextBox = await driver.findElement(By.className("_2FkHZ"));

    searchTextBox.click();
    searchTextBox.sendKeys(dish);

    await delay(1000);
    searchTextBox.sendKeys(Key.ENTER);

    await delay(3000);
    
    const xpathForFetchingDeliveryTime="(//span[@class='styles_restaurantMetaDot__usB4d']/following-sibling::div)";
    const xpathForFetchingPricesOfDishes="//span[@class='rupee']"

    const cafesServing = await driver.findElements(By.className("styles_restaurantName__5VIQZ styles_restaurantNameBold__2OmFY"));
    const deliveryTimes = await driver.findElements(By.xpath(xpathForFetchingDeliveryTime));
    const closestNames = await driver.findElements(By.className("styles_itemNameText__3ZmZZ"))
    const prices = await driver.findElements(By.xpath(xpathForFetchingPricesOfDishes))

    const cafes = [];
    for(let idx=0; idx<numberOfResults; idx++){
        const cafeName = await cafesServing[idx].getText();
        const deliveryTime = await deliveryTimes[idx].getText();
        const price = await prices[idx].getText();
        const itemName = await closestNames[idx].getText();
        cafes.push({
            name: cafeName,
            deliveryTime,
            price,
            itemName
        });
    }

    return cafes; 

}

module.exports = {
    fetchAllCafes
}
