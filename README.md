# Calculator Hub

A simple, modern web application featuring a Tip Calculator, a Bill Splitter, and a Discount Calculator. The application is containerized using Docker and served with Nginx.

## Features

-   **Tip Calculator**: Calculate the tip and total amount for a given bill. Includes quick options for 10% and 15% tips, as well as a custom percentage.
-   **Bill Splitter**: Split a total bill, including a tip, among a number of people.
-   **Discount Calculator**: Easily calculate the final price after a discount and see how much you've saved.
-   **Multi-language & Multi-currency**: Supports English and Spanish, and formats currency for USD, EUR, and CLP. The default language is Spanish and the default currency is CLP.
-   **Responsive Design**: The user interface is optimized for both desktop and mobile devices.
-   **Dark Mode**: Automatically adapts to your system's preferred color scheme (light or dark), with a manual override.

## Technologies Used

-   HTML5
-   CSS3
-   JavaScript (ES6+)
-   Nginx
-   Docker & Docker Compose

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You need to have the following software installed on your system:

-   [Git](https://git-scm.com/)
-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

### Installation & Running

#### Running the Application

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/vmhq/calculator-tips.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd calculator-tips
    ```

3.  **Run the application using Docker Compose:**
    ```sh
    docker-compose up -d
    ```
    This command will pull the pre-built Docker image from the GitHub Container Registry (`ghcr.io`) and start the application. If you encounter authentication errors, you may need to log in to `ghcr.io` first.

The application will be available at **`http://localhost:8680`**.

To stop the application, run:
```sh
docker-compose down
```

## How It Works

The application is a single-page application built with vanilla HTML, CSS, and JavaScript.

-   `src/index.html`: Contains the structure for both calculators.
-   `src/style.css`: Provides the styling, including the responsive layout and dark mode support.
-   `src/script.js`: Handles all the logic, including switching between calculators and performing the calculations.

The entire application is served as a static site by an Nginx web server running inside a Docker container.

## Code Documentation

The JavaScript code in `src/script.js` is fully documented with JSDoc comments. These comments explain the purpose of each function, its parameters, and its return values, making it easier to understand and maintain the codebase.
