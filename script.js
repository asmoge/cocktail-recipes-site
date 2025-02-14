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

        displayCocktails(cocktails);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to extract ingredients and amounts
function extractIngredients(row) {
    let ingredients = [];
    for (let i = 11; i <= 31; i += 3) { // Ingredients start at column 11, every 3rd column contains the next ingredient
        if (row.c[i] && row.c[i].v) {
            let amount = row.c[i + 1]?.v || "";
            ingredients.push(`${row.c[i].v} (${amount})`);
        }
    }
    return ingredients.length > 0 ? ingredients.join(", ") : "No ingredients listed.";
}

// Function to display cocktails
function displayCocktails(cocktails) {
    const listDiv = document.getElementById("cocktailList");
    listDiv.innerHTML = "<h2>Available Cocktails</h2>";
    
    cocktails.forEach(cocktail => {
        listDiv.innerHTML += `
            <div style="border-bottom: 1px solid #ccc; padding: 10px;">
                <h3>${cocktail.name}</h3>
                <p><strong>Style:</strong> ${cocktail.style}</p>
                <p><strong>Last Had:</strong> ${cocktail.lastHad} | <strong>Rating:</strong> ${cocktail.rating}</p>
                <p><strong>Ingredients:</strong> ${cocktail.ingredients}</p>
                <p><strong>Instructions:</strong> ${cocktail.instructions}</p>
                <p><strong>Glassware:</strong> ${cocktail.glassware} | <strong>Garnish:</strong> ${cocktail.garnish}</p>
                ${cocktail.link ? `<p><a href="${cocktail.link}" target="_blank">Recipe Link</a></p>` : ""}
                ${cocktail.picture ? `<img src="${cocktail.picture}" alt="${cocktail.name}" style="max-width: 200px;">` : ""}
            </div>
        `;
    });
}

// Run on page load
fetchCocktails();
