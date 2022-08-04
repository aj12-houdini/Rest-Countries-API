//ELEMENTS: INDEX

const country = document.querySelector(".country");
const selectCountry = document.querySelector("#country-filter");
const main = document.querySelector("main");
const body = document.querySelector("body");
const nav = document.querySelector("nav");

const mode = document.querySelector(".mode");

const form = document.querySelector("form");
const input = document.querySelector("input");
const API = `https://restcountries.com/v3.1/all`;

let lightMode = 0;

async function getCountry(API) {
  const res = await fetch(API);
  const data = await res.json();
  return data;
}

const countryData = async function (API) {
  let data = await getCountry(API);
  simplify(data);
  if (lightMode % 2 === 0)
    changeTheme("Light Mode", "hsl(0, 0%, 98%)", "#ffff", "black");
  else
    changeTheme(
      "Dark Mode",
      "hsl(207, 26%, 17%)",
      "hsl(209, 23%, 22%)",
      "white"
    );
};
countryData(API);

//FUNCTION TO DESTRUCTURE DATA FROM API
function simplify(arr) {
  country.innerHTML = "";
  for (let country of arr) {
    const {
      name: { common, nativeName },
      flags: { svg },
      region,
      population,
      subregion,
      tld,
      currencies,
      languages,
      borders,
      capital,
    } = country;
    createDiv(
      common,
      region,
      population,
      capital,
      svg,
      subregion,
      tld,
      currencies,
      languages,
      nativeName,
      borders
    );
  }
}

function createDiv(
  common,
  region,
  population,
  capital,
  png,
  subregion,
  tld,
  currencies,
  languages,
  nativeName,
  borders
) {
  //Created the white box to hold country info
  population = new Intl.NumberFormat("en-US").format(population);

  const countryBox = document.createElement("div");
  countryBox.classList.add("country-box");
  const regionElement = getParaElements("Region", region);
  const nameElement = getName(common);
  const populationElement = getParaElements("Population", population);
  const capitalElement = getParaElements("Capital", capital);
  const flagElement = getFlag(png);

  countryBox.appendChild(flagElement);
  const info = document.createElement("div");
  info.classList.add("info");

  info.appendChild(nameElement);
  info.appendChild(populationElement);
  info.appendChild(regionElement);
  info.appendChild(capitalElement);

  countryBox.appendChild(info);
  country.appendChild(countryBox);
  main.appendChild(country);

  countryBox.addEventListener("click", function (e) {
    country.classList.add("active");
    main.innerHTML = "";
    country.innerHTML = ` 
    <div class="country-detail">
    <div class="first col-lg-6">
      <a href=""
        <i class="fa-solid fa-arrow-left-long"></i>
        Back</a
      >
      <img src = "${png}">
    </div>
    <div class="second col-lg-6">
      <h2>${common}</h2>
      <div class="content">
        <ul>
          <li><span>Native Name</span><span>: ${
            Object.values(nativeName)[0].common
          } </span></li>
          <li><span>Population</span><span>: ${population} </span></li>
          <li><span>Region</span><span>: ${region}</span></li>
          <li><span>Sub Region</span><span>: ${subregion}</span></li>
          <li><span>Capital</span><span>: ${capital}</span></li>
        </ul>
        <ul>
          <li><span>Top Level Domain</span><span>: ${tld} </span></li>
          <li><span>Currencies</span><span>: ${
            Object.values(currencies)[0].name
          }</span></li>
          <li><span>Languages</span><span>: ${Object.values(
            languages
          )}</span></li>
        </ul>
      </div>
      <div class="borderDiv">
        <span>Border Countries: </span>
        <ul>
          ${borders ? createElement().join("") : "<li> No borders </li>"}
        </ul>
      </div>
</div>
</div>`;

    function createElement() {
      const arr = [];
      for (let i of borders) {
        if (arr.length === 3) break;
        const li = document.createElement("li");
        li.innerText = i;
        arr.push(li.outerHTML);
      }
      return arr;
    }

    main.appendChild(country);

    lightMode % 2 === 0
      ? changeTheme("Light Mode", "hsl(0, 0%, 98%)", "#ffff", "black")
      : changeTheme(
          "Dark Mode",
          "hsl(207, 26%, 17%)",
          "hsl(209, 23%, 22%)",
          "white"
        );
  });
}

function getParaElements(labelText, countryInfo) {
  const label = document.createElement("span");
  const info = document.createElement("span");
  label.innerText = labelText;
  info.innerText = countryInfo;
  const infoDiv = document.createElement("div");
  infoDiv.appendChild(label);
  infoDiv.appendChild(info);
  return infoDiv;
}

function getName(common) {
  const h1 = document.createElement("h1");
  h1.innerText = common;
  return h1;
}

function getFlag(png) {
  const img = document.createElement("img");
  img.setAttribute("src", png);
  return img;
}

//SELECTION BY REGION
selectCountry.addEventListener("change", async function (value) {
  const option = selectCountry.value;
  option === ""
    ? countryData(API)
    : countryData(`https://restcountries.com/v3.1/region/${option}`);
});

//SEARCHING
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const search = input.value;
  search === "" && search
    ? location.reload()
    : countryData(`https://restcountries.com/v3.1/name/${search}`);
});

//DARK MODE LIGHT MODE
mode.addEventListener("click", function () {
  lightMode++;
  lightMode % 2 === 0
    ? changeTheme("Light Mode", "hsl(0, 0%, 98%)", "#ffff", "black")
    : changeTheme(
        "Dark Mode",
        "hsl(207, 26%, 17%)",
        "hsl(209, 23%, 22%)",
        "white"
      );
});

// CHANGE THEME
function changeTheme(text, bodyColor, containerColor, textColor) {
  try {
    const containerDiv = document.querySelector(".country-detail");
    containerDiv.style.color = textColor;
  } catch (e) {}
  mode.querySelector("span").innerText = text;
  body.style.backgroundColor = bodyColor;
  nav.style.backgroundColor = bodyColor;
  const countryBox = country.childNodes;
  try {
    countryBox.forEach((c) => {
      c.style.backgroundColor = containerColor;
      for (let child of c.children) child.style.color = textColor;
    });
  } catch (e) {}
  nav.querySelector("h1").style.color = textColor;
  for (let child of mode.children) child.style.color = textColor;
  input.style.backgroundColor = containerColor;
  input.style.color = textColor;
  selectCountry.style.backgroundColor = containerColor;
  input.classList.contains("lightmode") && input.classList.remove("lightmode");
  input.classList.contains("darkmode") && input.classList.remove("darkmode");
  input.classList.toggle(text.replace(" ", "").toLowerCase());
  selectCountry.style.color = textColor;
  document.querySelectorAll("option").forEach((option) => {
    option.style.color = textColor;
  });
}
