async function fetchCocktails() {
    const sheetID = "1bcO9UTkYFoOqzs0oSgH4dbCNWuNNNZgiHSOyFaSPa3A"; // Replace with your actual Sheet ID
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

    try {
        const response = await fetch(url);
        let text = await response.text();
        
        // Clean up response (Google Sheets API returns extra text)
        text = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
        const data = JSON.parse(text);
        
        // Extract rows
        const rows = data.table.rows;
        let cocktails = rows.map(row => ({
            name: row.c[0].v,
            ingredients: row.c[1].v,
            lastHad: row.c[2]?.v || "N/A",
            rating: row.c[3]?.v || "N/A",
            flavor: row.c[4]?.v || "N/A"
        }));

        displayCocktails(cocktails);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayCocktails(cocktails) {
    const listDiv = document.getElementById("cocktailList");
    listDiv.innerHTML = "<h2>Available Cocktails</h2>";
    
    cocktails.forEach(cocktail => {
        listDiv.innerHTML += `
            <p><strong>${cocktail.name}</strong> - ${cocktail.ingredients}</p>
            <p>Last Had: ${cocktail.lastHad} | Rating: ${cocktail.rating} | Flavor: ${cocktail.flavor}</p>
            <hr>
        `;
    });
}

// Run on page load
fetchCocktails();
