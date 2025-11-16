const dropDownMenu=document.querySelector('.drop-down');
const filterbyRegion=document.querySelector('.filter');
const regions=document.querySelector('#regions');
const filterValue=document.querySelector('.filter-value');
const card=document.querySelector('.card');
const mainSection=document.querySelector('.main-section');
const detailedCardInfo=document.querySelector('.detailed-card-info');
const borderBtn=document.querySelector('.border');
const borderCountriesContainer=document.querySelector('.border-countries');
const backBtn=document.querySelector('.back');
const inputCountry=document.querySelector('.submit');
const input=document.querySelector('#search');

if(inputCountry){
    inputCountry.addEventListener('submit',(e)=>{
         e.preventDefault();
    const wholeCards=Array.from(mainSection.children);
    wholeCards.forEach((x)=>{
            if(x.getAttribute('name') && x.getAttribute('name').toLowerCase()!=input.value.toLowerCase()){
                x.classList.add('hidden');
            }
    })
    
})
}
if(detailedCardInfo){
    setDetailValue();
}
function setupPopulation(population){
    let str=""
    let count=0;
    population=Array.from(String(population));
    for(let i=population.length-1;i>=0;i--){
        if(count%3==0 && count!=0){
            str=str+",";
        }
        str=str+population[i];
        count++;
    }
    str=Array.from(str);
    str.reverse();
    str=str.join('');
    return str;
}
 async function makeNewCard(countryName){
            let newCard
            const res= await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
            const data= await res.json();
                    newCard=card.cloneNode(true);
                    newCard.classList.remove("hidden");
                    newCard.children[1].children[0].innerText=data[0].name.common;
                    newCard.setAttribute('name',data[0].name.common)
                    newCard.children[0].src=data[0].flags.png
                    newCard.children[1].children[1].children[1].innerText=setupPopulation(data[0].population)
                    newCard.children[1].children[2].children[1].innerText=data[0].region
                    newCard.setAttribute('region',data[0].region)
                    newCard.children[1].children[3].children[1].innerText=data[0].capital  
            return newCard;
}
if(filterbyRegion){
    filterbyRegion.addEventListener('click',()=>{
    dropDownMenu.classList.toggle("hidden");
})
}
let regionValues;
if(regions){
    const regionChilds=Array.from(regions.children);
    regionChilds.forEach((x)=>{
        x.addEventListener('click',async()=>{
        //    console.log(x.innerText);
        deleteAllCards(x.innerText);
        })
    })
     regionValues=Array.from(regions.children);
}
if(regionValues){
    regionValues.forEach((x)=>{
    x.addEventListener('click',(e)=>{
        e.stopPropagation();
        filterValue.innerText=x.innerText;
        dropDownMenu.classList.toggle("hidden");
    })
})
}
// let x;
if(card){
    fetch("https://restcountries.com/v3.1/all?fields=name")
.then((res)=>res.json())
.then((data)=>{
    data.forEach(async (x,i)=>{
                let countryName=x.name.common;
                const brandNewCard= await makeNewCard(countryName);
                mainSection.append(brandNewCard);
    })

}).catch((err)=>{
    console.log(err);
})
}
let detailData;
if(mainSection){
    mainSection.addEventListener('click',async(e)=>{
    let value=e.target;
    while(!(value.classList.contains('card'))){
        value=value.parentElement;
    }
    let country=value.children[1].children[0].innerText
    storeInLocalStorage(country);


})}
if(backBtn){
    backBtn.addEventListener('click',()=>{
        location.href="index.html"
    })
}
function findCard(country){

}
function deleteAllCards(region){
    const allCards=Array.from(mainSection.children)
    allCards.forEach((x,i)=>{
        x.classList.remove('hidden');
    })
        allCards.forEach((x,i)=>{
        
        if(x.getAttribute('region')!=region){
            x.classList.add('hidden');
        }
        
    })
}
function setUpArray(arr){
    let str=""
    for(let i=0;i<arr.length;i++){
        str=str+arr[i]+",";
    }
    str=Array.from(str)
    str.pop();
    str=str.join('');
    return str;
}
async function fetchCountryNames(countryCode){
    const res=await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    const data=await res.json();
    return data[0].name.common;

}
async function setDetailValue(){
    let data=JSON.parse(localStorage.getItem("data"))
    detailedCardInfo.children[0].children[0].src=data.flags.png;
    detailedCardInfo.children[1].children[0].innerText=data.name.common;
   detailedCardInfo.children[1].children[1].children[0].children[0].children[1].innerText=data.name.official;
   let population=setupPopulation(data.population);
   detailedCardInfo.children[1].children[1].children[0].children[1].children[1].innerText=population;
   detailedCardInfo.children[1].children[1].children[0].children[2].children[1].innerText=data.region
   detailedCardInfo.children[1].children[1].children[0].children[3].children[1].innerText=data.subregion
   let capital=setUpArray(data.capital);
   detailedCardInfo.children[1].children[1].children[0].children[4].children[1].innerText=capital
   detailedCardInfo.children[1].children[1].children[1].children[0].children[1].innerText=data.tld[0]
   let currency=data.currencies
    let key=Object.keys(currency);
    key=key[0];
    let currencyName=currency[key]["name"]
    detailedCardInfo.children[1].children[1].children[1].children[1].children[1].innerText=currencyName;
    let languages=Object.entries(data.languages);
    let lan=[];
    for(let x of languages){
        lan.push(x[1]);
    }
    lan=lan.join(' , ');
    detailedCardInfo.children[1].children[1].children[1].children[2].children[1].innerText=lan;
    if(data.borders){
        let borderArray=[data.borders][0]
        for(let x of borderArray){
            let borderCountry=borderBtn.cloneNode(true);
            borderCountry.innerText=await fetchCountryNames(x);
            borderCountry.addEventListener('click',()=>{
                storeInLocalStorage(borderCountry.innerText);
            })
            borderCountriesContainer.append(borderCountry);
        }
        borderBtn.classList.add('hidden');
    }
    

//    console.log(capital)
}
async function storeInLocalStorage(country){
    let res=await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
    let data=await res.json();
    localStorage.setItem("data",JSON.stringify(data[0]))
    location.href="detail.html"
} 

