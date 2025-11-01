import "./styles/index.scss";

// Car Data

const cars = [
  {
    model: "Fiesta",
    year: 2018,
    price: 9891,
    transmission: "Manual",
    mileage: 31639,
    fuelType: "Petrol",
    tax: 145,
    mpg: 65.7,
    engineSize: 1,
    Manufacturer: "ford",
  },
  {
    model: "Golf",
    year: 2019,
    price: 21998,
    transmission: "Manual",
    mileage: 50,
    fuelType: "Petrol",
    tax: 150,
    mpg: 47.9,
    engineSize: 1.5,
    Manufacturer: "volkswagen",
  },
  {
    model: "C-HR",
    year: 2019,
    price: 26791,
    transmission: "Automatic",
    mileage: 2373,
    fuelType: "Hybrid",
    tax: 135,
    mpg: 74.3,
    engineSize: 1.8,
    Manufacturer: "toyota",
  },
  {
    model: "A Class",
    year: 2017,
    price: 17498,
    transmission: "Manual",
    mileage: 9663,
    fuelType: "Diesel",
    tax: 30,
    mpg: 62.8,
    engineSize: 2.1,
    Manufacturer: "Mercedes",
  },
  {
    model: "1 Series",
    year: 2016,
    price: 10550,
    transmission: "Manual",
    mileage: 40313,
    fuelType: "Diesel",
    tax: 0,
    mpg: 78.5,
    engineSize: 1.5,
    Manufacturer: "BMW",
  },
];

//  Error Class

class FinderError extends Error {
  constructor(message) {
    super(message);
    this.name = "FinderError";
  }
}

// OOP Classes

class Vehicle {
  constructor({ model, year, Manufacturer: make, ...details }) {
    this.model = model;
    this.year = year;
    this.make = make;
    this.details = details;
  }

  getInfo() {
    const { price, fuelType, mileage, transmission } = this.details;
    return `${this.year} ${this.make} ${this.model} - ${fuelType}, ${transmission}, $${price}, ${mileage} miles`;
  }
}

class CarFinder {
  constructor(data = []) {
    if (!Array.isArray(data))
      throw new FinderError("CarFinder expects an array of cars.");
    this.data = data;
  }

  getYears() {
    return [...new Set(this.data.map(({ year }) => year))].sort();
  }

  getManufacturersByYear(year) {
    const makes = this.data
      .filter((car) => car.year === year)
      .map(({ Manufacturer }) => Manufacturer);
    if (!makes.length)
      throw new FinderError(`No manufacturers found for year ${year}`);
    return [...new Set(makes)];
  }

  getModelsByYearAndMake(year, make) {
    const models = this.data
      .filter((car) => car.year === year && car.Manufacturer === make)
      .map(({ model }) => model);
    if (!models.length)
      throw new FinderError(`No models found for ${make} (${year})`);
    return [...new Set(models)];
  }

  findCar(year, make, model) {
    const found = this.data.find(
      (car) =>
        car.year === year && car.Manufacturer === make && car.model === model
    );
    if (!found) throw new FinderError("Car not found!");
    return new Vehicle(found);
  }
}

const yearSelect = document.getElementById("yearSelect");
const makeSelect = document.getElementById("manufacturerSelect");
const modelSelect = document.getElementById("modelSelect");

const finder = new CarFinder(cars);

// Fill Year dropdown
for (const year of finder.getYears()) {
  yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
}

// Handle selections
yearSelect.addEventListener("change", () => {
  const selectedYear = parseInt(yearSelect.value);
  makeSelect.innerHTML = "<option value=''>Vehicle Make</option>";
  modelSelect.innerHTML = "<option value=''>Vehicle Model</option>";
  makeSelect.disabled = true;
  modelSelect.disabled = true;

  try {
    const makes = finder.getManufacturersByYear(selectedYear);
    makes.forEach(
      (make) =>
        (makeSelect.innerHTML += `<option value="${make}">${make}</option>`)
    );
    makeSelect.disabled = false;
  } catch (err) {
    console.error(err.message);
  }
});

makeSelect.addEventListener("change", () => {
  const selectedYear = parseInt(yearSelect.value);
  const selectedMake = makeSelect.value;
  modelSelect.innerHTML = "<option value=''>Vehicle Model</option>";
  modelSelect.disabled = true;

  try {
    const models = finder.getModelsByYearAndMake(selectedYear, selectedMake);
    models.forEach(
      (model) =>
        (modelSelect.innerHTML += `<option value="${model}">${model}</option>`)
    );
    modelSelect.disabled = false;
  } catch (err) {
    console.error(err.message);
  }
});

modelSelect.addEventListener("change", () => {
  const [year, make, model] = [
    parseInt(yearSelect.value),
    makeSelect.value,
    modelSelect.value,
  ];
  try {
    const car = finder.findCar(year, make, model);
    console.log("Selected Car Details:", car.getInfo());
  } catch (err) {
    console.error("Error:", err.message);
  }
});
