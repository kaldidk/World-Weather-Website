# Countries & Weather Project

This project displays a list of countries along with their capitals. When a country is selected, it fetches and displays the weather details for its capital city.

## Features
- Displays a list of countries in a table format.
- Click on a country to show additional rows with weather details.
- Fetches real-time weather data using the OpenWeather API.
- Simple and lightweight frontend using HTML, CSS, and JavaScript with AngularJS.

## Prerequisites
Make sure you have one of the following installed:
- Python (for running a local server)
- Node.js (for using `http-server`)

## How to Run the Code

### Using Python HTTP Server
1. Open a terminal or command prompt.
2. Navigate to the project directory.
3. Run the following command:
   ```sh
   python3 -m http.server 8000
   ```
4. Open your browser and go to:
   ```
   http://localhost:8000/
   ```

### Using Node.js HTTP Server
1. Ensure you have Node.js installed.
2. Open a terminal or command prompt.
3. Navigate to the project directory.
4. Run the following command:
   ```sh
   npx http-server -p 8000
   ```
5. Open your browser and go to:
   ```
   http://localhost:8000/
   ```

## API References
- **Countries Data**: [REST Countries API](https://restcountries.com/)
- **Weather Data**: [OpenWeather API](https://openweathermap.org/current)

## Project Structure
```
📂 project-folder
 ├── 📄 index.html      # Main HTML file
 ├── 📄 script.js       # JavaScript logic for fetching data
 ├── 📄 styles.css      # CSS styles
 ├── 📄 Readme.md       # Documentation
```

## License
This project is for educational purposes only. Feel free to modify and use it as needed.

## Contributor
- Karunesh Kumar



