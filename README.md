# Openclassrooms JavaScript React Developer project #12: Develop a Dashboard for Analytics with React

## Description
A React-based project featuring custom charts made using the D3 library.

## Installation
1. Clone the repository:
 ```git clone https://github.com/Ingirorhaun/openclassrooms-project-12```
2. Install dependencies
```npm install```

## Usage
Clone and run the back-end repository (needed to fetch data): [https://github.com/OpenClassrooms-Student-Center/SportSee](https://github.com/OpenClassrooms-Student-Center/SportSee)

To start the development server:

```npm start```

To build for production:

```npm run build```

To switch between API data and mocked data:

1. Open `src/App.jsx`
2. Locate the line where `UserApi` is instantiated:
   ```javascript
   const userApi = new UserApi(userId, "http://localhost:3000", false);
3. To use mocked data, change the third parameter to true:
    ```javascript
    const userApi = new UserApi(userId, "http://localhost:3000", true);
4. To use API data, keep it as `false`

