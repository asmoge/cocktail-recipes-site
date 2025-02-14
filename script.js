async function fetchCocktails() {
    const sheetID = "1bcO9UTkYFoOqzs0oSgH4dbCNWuNNNZgiHSOyFaSPa3A"; // Replace with your actual Sheet ID
    const url = `https://corsproxy.io/?https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

    try {
        const response = await fetch(url);
        let text = await response.text();
        
        // Clean up response (Google Sheets API returns extra text)
        text = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
        const data = JSON.parse(text);
        
        // Extract rows
        const rows = data.table.rows;
        let cocktails = rows.map(row => ({
            name: row.c[2]?.v || "Unnamed Cocktail",  // Cocktail Name
            style: row.c[3]?.v || "Unknown Style",   // Cocktail Style / Flavor Profile
            rating: row.c[4]?.v || "N/A",            // Rating
            lastHad: row.c[0]?.v || "N/A",           // Timestamp (Last Had)
            ingredients: extractIngredients(row),    // Extracted Ingredients
            instructions: row.c[35]?.v || "No instructions provided.", // Instructions
            glassware: row.c[36]?.v || "Unknown Glassware", // Glassware
            garnish: row.c[37]?.v || "No garnish",   // Garnish
            link: row.c[39]?.v || "",                // Link (if available)
            picture: row.c[40]?.v || ""              // Picture (if available)
        }));
        
        console.log("Fetched Cocktails:", cocktails);
        displayCocktails(cocktails);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to extract ingredients and amounts, while filtering out "Yes" and "No"
function extractIngredients(row) {
    let ingredients = [];
    for (let i = 11; i <= 31; i += 3) { // Ingredients start at column 11, every 3rd column contains the next ingredient
        if (row.c[i] && row.c[i].v && row.c[i].v !== "Yes" && row.c[i].v !== "No") {
            let amount = row.c[i + 1]?.v || "";
            ingredients.push(`${row.c[i].v} ${amount}`.trim());
        }
    }
    return ingredients.length > 0 ? ingredients.join(", ") : "No ingredients listed.";
}

// Function to display cocktails on the webpage
function displayCocktails(cocktails) {
    console.log("Displaying Cocktails:", cocktails);
    const listDiv = document.getElementById("cocktailList");

    // Ensure the div exists in index.html
    if (!listDiv) {
        console.error("Error: 'cocktailList' div not found in HTML.");
        return;
    }

    listDiv.innerHTML = "<h2>Available Cocktails</h2>";

    cocktails.forEach(cocktail => {
        listDiv.innerHTML += `
            <p><strong>${cocktail.name}</strong> - ${cocktail.style}</p>
            <p>Last Had: ${cocktail.lastHad} | Rating: ${cocktail.rating}</p>
            <p>Ingredients: ${cocktail.ingredients}</p>
            <p>Instructions: ${cocktail.instructions}</p>
            <p>Glassware: ${cocktail.glassware} | Garnish: ${cocktail.garnish}</p>
            <hr>
        `;
    });
}

// Call fetchCocktails when the page loads
document.addEventListener("DOMContentLoaded", fetchCocktails);
