document.addEventListener('DOMContentLoaded', function() {
    let transactionHistory = [];
    const depositModal = document.getElementById('deposit-modal');
    depositModal.style.width = '400px'; // Increased width
    depositModal.style.height = 'auto'; // Adjust height automatically based on content
    let watchlist = { stocks: [], commodities: [] };
    let portfolio = { stocks: [], commodities: [], cash: 5857.92 }; // Initial cash value
    let marketData = generateInitialMarketData();
    let investmentChart;
    let previousMarketData = JSON.parse(JSON.stringify(marketData)); // Clone initial market data for comparison
    document.getElementById('deposit-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally
    const amount = parseFloat(document.getElementById('deposit-amount').value); // Parse the amount as a float

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.'); // Alert if the amount is not a number or is less than or equal to zero
        return;
    }

    depositMoney(amount); // Call the function to handle the deposit
    document.getElementById('deposit-modal').style.display = 'none'; // Hide the deposit modal
});

function depositMoney(amount) {
    if (amount > 0) {
        portfolio.cash += amount; // Add the deposited amount to the cash available in the portfolio
        alert(`Successfully deposited $${amount.toFixed(2)}. Current Cash: $${portfolio.cash.toFixed(2)}`);
        document.getElementById('cash-available').textContent = portfolio.cash.toFixed(2); // Update the cash display
    } else {
        alert('Please enter a valid amount greater than zero.'); // Alert if the entered amount is not valid
    }
}


    // Withdraw button event listener
    document.getElementById('withdraw-button').addEventListener('click', function() {
        document.getElementById('withdrawal-form').style.display = 'block'; // Show the withdrawal form
    });

    // Close button for deposit modal
    document.querySelector('#deposit-modal .close-button').addEventListener('click', function() {
        document.getElementById('deposit-modal').style.display = 'none'; // Hide the deposit modal
    });

    document.getElementById('withdrawal-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const withdrawalAmount = parseFloat(document.getElementById('withdrawal-amount').value);
        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            alert('Please enter a valid amount to withdraw.');
            return;
        }
        withdrawMoney(withdrawalAmount);
    });
    function withdrawMoney(amount) {
        if (amount > portfolio.cash) {
            alert('You do not have sufficient funds to withdraw that amount.');
            return;
        }
        portfolio.cash -= amount; // Deduct withdrawn amount from the available cash
        alert(`Successfully withdrew $${amount.toFixed(2)}. Current Cash: $${portfolio.cash.toFixed(2)}`);
        updatePortfolioDisplay(); // Update the portfolio display
    }


    function depositMoney(amount) {
        portfolio.cash += amount; // Add deposited amount to the available cash
        alert(`Successfully deposited $${amount.toFixed(2)}. Current Cash: $${portfolio.cash.toFixed(2)}`);
        updatePortfolioDisplay();
    }

    function addToTransactionHistory(type, amount) {
        const transaction = {
            type: type,
            amount: amount,
            date: new Date().toLocaleString(),
            status: 'Completed'
        };
        transactionHistory.push(transaction); // Add transaction to history
        displayTransactionHistory(); // Update the transaction history display
    }
    
    function displayTransactionHistory() {
        const transactionList = document.getElementById('transaction-list');
        transactionList.innerHTML = '';
        transactionHistory.forEach(transaction => {
            const listItem = document.createElement('div');
            listItem.classList.add('transaction-item');
            listItem.innerHTML = `<span>Type: ${transaction.type}</span><span>Amount: $${transaction.amount.toFixed(2)}</span><span>Date: ${transaction.date}</span><span>Status: ${transaction.status}</span>`;
            transactionList.appendChild(listItem);
        });
    }
    
    // Simulate market update every 5 seconds
    setInterval(() => {
        updateInventoryDisplay()
        updateMarketData();
        displayMarketItems();
        displayWatchlistItems();
        updatePopupPrice();
        updateProfit();
    }, 5000);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            showSection(targetId);
        });
    });

    function showSection(sectionId) {
        document.querySelectorAll('section').forEach(section => {
            section.id === sectionId ? section.classList.remove('hidden') : section.classList.add('hidden');
        });
        if (sectionId === 'portfolio') {
            updatePortfolioDisplay();
        }
    }

    function generateInitialMarketData() {
        const stocks = [];
        const commodities = [];
        for (let i = 1; i <= 6; i++) { // Generate 20 stocks
            stocks.push({ name: `Stock ${i}`, price: randomPrice() });
        }
        for (let i = 1; i <= 3; i++) { // Generate only 3 commodities
            commodities.push({ name: `Commodity ${i}`, price: randomPrice() });
        }
        return { stocks, commodities };
    }
    
    function randomPrice() {
        return parseFloat((Math.random() * 100 + 50).toFixed(2));
    }

    function updateMarketData() {
        marketData.stocks.forEach((stock, index) => {
            // Generate a price change within the range of -10 to +10
            const priceChange = Math.random() * 20 - 10; // Adjusts the range to -10 to +10
            const newPrice = Math.max(0, stock.price + priceChange).toFixed(2); // Ensure price doesn't go below 0
            previousMarketData.stocks[index].price = stock.price; // Store the current price as previous
            stock.price = parseFloat(newPrice); // Update with the new price
        });
        marketData.commodities.forEach((commodity, index) => {
            // Generate a price change within the range of -10 to +10
            const priceChange = Math.random() * 20 - 10; // Adjusts the range to -10 to +10
            const newPrice = Math.max(0, commodity.price + priceChange).toFixed(2); // Ensure price doesn't go below 0
            previousMarketData.commodities[index].price = commodity.price; // Store the current price as previous
            commodity.price = parseFloat(newPrice); // Update with the new price
        });
    }

    function displayMarketItems() {
        displayItems('stock-list', marketData.stocks, previousMarketData.stocks);
        displayItems('commodity-list', marketData.commodities, previousMarketData.commodities);
    }
    function displayItems(elementId, items, previousItems) {
        const listElement = document.getElementById(elementId);
        listElement.innerHTML = '';
        items.forEach((item, index) => {
            const itemElement = document.createElement('li');
    
            // Create image element
            const image = document.createElement('img');
            image.src = `images/${item.name.toLowerCase().replace(/ /g, '-')}.jpg`; // Assuming image filenames are based on the item names
            image.alt = item.name;
            image.className = 'item-image'; // Add a class for styling
            itemElement.appendChild(image);
    
            // Create text content for name and price
            const text = document.createElement('span');
            const priceChange = item.price - previousItems[index].price;
            text.textContent = `${item.name}: $${item.price.toFixed(2)}`;
            itemElement.classList.add('item'); // Add 'item' class to apply common styles
            if (priceChange > 0) {
                itemElement.classList.add('green', 'animate'); // Add 'green' class for positive changes
            } else if (priceChange < 0) {
                itemElement.classList.add('red', 'animate'); // Add 'red' class for negative changes
            }
    
            // Create button to add to watchlist
            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Watchlist';
            addButton.onclick = () => addToWatchlist(item);
    
            // Append elements to the list item
            itemElement.appendChild(text);
            itemElement.appendChild(addButton);
    
            // Append list item to the list
            listElement.appendChild(itemElement);
        });
    }
    

    function addToWatchlist(item) {
        const list = item.name.includes('Stock') ? watchlist.stocks : watchlist.commodities;
        if (!list.some(i => i.name === item.name)) {
            list.push({ ...item, quantity: 0 });
            alert(`${item.name} added to watchlist.`);
        }
        displayWatchlistItems();
    }
    function displayWatchlistItems() {
        const sections = { 'watchlist-stocks': watchlist.stocks, 'watchlist-commodities': watchlist.commodities };
        Object.keys(sections).forEach(section => {
            const listElement = document.getElementById(section);
            listElement.innerHTML = '';
            sections[section].forEach(item => {
                // Find the current market price of the item
                const currentItem = marketData.stocks.concat(marketData.commodities).find(marketItem => marketItem.name === item.name);
                const currentPrice = currentItem ? currentItem.price : item.price; // Use the market price if available, else use the stored price
        
                const itemElement = document.createElement('li');
                const itemContainer = document.createElement('div');
                itemContainer.className = 'item-container';
        
                // Create image element
                const image = document.createElement('img');
                image.src = `images/${item.name.toLowerCase().replace(/ /g, '-')}.jpg`; // Assuming image filenames are based on the item names
                image.alt = item.name;
                image.className = 'item-image'; // Add a class for styling
                itemContainer.appendChild(image);
        
                // Display the name and current price
                const text = document.createElement('span');
                text.textContent = `${item.name}: $${currentPrice.toFixed(2)}`;
                text.className = 'item-text'; // Add a class for styling
                itemContainer.appendChild(text);
        
                // Add spacing between text and buy button
                const spacer = document.createElement('span');
                spacer.textContent = ' '; // Add a space
                itemContainer.appendChild(spacer);
        
                // Add buy button
                const buyButton = document.createElement('button');
                buyButton.textContent = 'Buy';
                buyButton.className = 'add-to-watchlist'; // Add a class for styling
                buyButton.onclick = () => buyItem({ ...item, price: currentPrice }); // Ensure to pass the current price when buying
                itemContainer.appendChild(buyButton);
        
                itemElement.appendChild(itemContainer);
                listElement.appendChild(itemElement);
            });
        });
    }
    

    function buyItem(item) {
        // Overlay setup
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;';
        document.body.appendChild(overlay);

        // Pop-up setup
        const popUp = document.createElement('div');
        popUp.style.cssText = 'background: white; padding: 20px; border-radius: 5px; display: flex; flex-direction: column; align-items: center;';
        
        const itemNameAndPrice = document.createElement('h2');
        popUp.appendChild(itemNameAndPrice);

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = '1';
        quantityInput.value = '1';
        quantityInput.style.cssText = 'margin-top: 10px;';
        popUp.appendChild(quantityInput);

        const buyButton = document.createElement('button');
        buyButton.textContent = 'Confirm Purchase';
        buyButton.style.cssText = 'margin-top: 20px;';
        popUp.appendChild(buyButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = 'margin-top: 10px;';
        popUp.appendChild(cancelButton);

        overlay.appendChild(popUp);

        // Close and clean-up function
        const closeAndCleanup = () => {
            clearInterval(priceUpdateInterval);
            document.body.removeChild(overlay);
        };

        cancelButton.addEventListener('click', closeAndCleanup);
        overlay.addEventListener('click', event => {
            if (event.target === overlay) closeAndCleanup();
        });

        // Dynamic price update function
        const updatePriceDisplay = () => {
            const currentMarketItem = marketData.stocks.concat(marketData.commodities).find(marketItem => marketItem.name === item.name) || item;
            itemNameAndPrice.textContent = `${item.name}: $${currentMarketItem.price.toFixed(2)}`;
            const priceChange = currentMarketItem.price - item.price;
            itemNameAndPrice.style.color = priceChange > 0 ? 'green' : priceChange < 0 ? 'red' : 'black';
        };
        updatePriceDisplay(); // Initial update

        // Start interval for dynamic price updates
        const priceUpdateInterval = setInterval(updatePriceDisplay, 5000);

        // Confirm purchase event
        buyButton.addEventListener('click', () => {
            confirmPurchase(item, parseInt(quantityInput.value, 10));
            closeAndCleanup();
        });
        addToTransactionHistory('Buy', totalCost);
    }

    function confirmPurchase(item, quantity) {
    if (isNaN(quantity) || quantity <= 0) {
        alert('Invalid quantity.');
        return;
    }

    const totalCost = item.price * quantity;
    if (totalCost > portfolio.cash) {
        alert('Insufficient funds.');
        return;
    }

    portfolio.cash -= totalCost; // Deduct the total cost from the available cash

    const portfolioList = item.name.includes('Stock') ? portfolio.stocks : portfolio.commodities;
    const portfolioItem = portfolioList.find(i => i.name === item.name);
    if (portfolioItem) {
        // If buying more of an existing item, average the purchase price
        const totalQuantity = portfolioItem.quantity + quantity;
        portfolioItem.purchasePrice = ((portfolioItem.purchasePrice * portfolioItem.quantity) + (item.price * quantity)) / totalQuantity;
        portfolioItem.quantity = totalQuantity; // Update quantity
    } else {
        portfolioList.push({
            ...item,
            quantity: quantity,
            purchasePrice: item.price, // Set the purchase price at the time of buying
        });
    }

    alert(`Purchased ${quantity} ${item.name} for $${totalCost.toFixed(2)}. Current Cash: $${portfolio.cash.toFixed(2)}`);

    // Update displays
    updatePortfolioDisplay();
    displayWatchlistItems(); // Refresh watchlist to update any displayed information
}


    function updatePortfolioDisplay() {
        document.getElementById('cash-available').textContent = portfolio.cash.toFixed(2);
        const totalInvested = getTotalInvested();
        document.getElementById('amount-invested').textContent = totalInvested.toFixed(2);
        document.getElementById('portfolio-value').textContent = (portfolio.cash + totalInvested).toFixed(2);

        updatePieChart();
    }

    function getTotalInvested() {
        return [...portfolio.stocks, ...portfolio.commodities].reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    function updatePieChart() {
        const ctx = document.getElementById('investment-chart').getContext('2d');
        if (investmentChart) {
            investmentChart.data.datasets[0].data = [sumItems(portfolio.stocks), sumItems(portfolio.commodities), portfolio.cash];
            investmentChart.update();
        } else {
            investmentChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Stocks', 'Commodities', 'Cash Available'],
                    datasets: [{
                        label: 'Portfolio Distribution',
                        data: [sumItems(portfolio.stocks), sumItems(portfolio.commodities), portfolio.cash],
                        backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top', },
                        title: { display: true, text: 'Portfolio Distribution' }
                    }
                }
            });
        }
    }

    function sumItems(items) {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function updateProfit() {
    const profitElement = document.getElementById('profit');
    const profit = calculateProfit();
    console.log(`Updating profit display: ${profit}`);  // Debug statement to trace profit calculation
    profitElement.textContent = profit.toFixed(2);
    profitElement.style.color = profit >= 0 ? 'green' : 'red';
}

// This function will be explicitly called after every market update and purchase
function refreshAllDisplays() {
    updateMarketData(); // Update market data first
    displayMarketItems(); // Then refresh market item displays
    displayWatchlistItems(); // Refresh watchlist items
    updatePortfolioDisplay(); // Update the portfolio view
    updateProfit(); // Finally, refresh the profit calculation and display
}

// Update the interval call to use the new refresh function
setInterval(refreshAllDisplays, 5000);


    function calculateProfit() {
    let totalProfit = 0;
    [...portfolio.stocks, ...portfolio.commodities].forEach(item => {
        const marketItem = marketData.stocks.concat(marketData.commodities)
            .find(marketItem => marketItem.name === item.name);
        if (marketItem && item.purchasePrice && item.quantity) {
            const profitPerItem = (marketItem.price - item.purchasePrice) * item.quantity;
            totalProfit += profitPerItem;
        }
    });
    return totalProfit;
  }

  function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.id === sectionId ? section.classList.remove('hidden') : section.classList.add('hidden');
    });
    switch (sectionId) {
        case 'portfolio':
            updatePortfolioDisplay();
            break;
        case 'inventory':
            updateInventoryDisplay();
            break;
    }
}

function updateInventoryDisplay() {
    const inventoryElement = document.getElementById('inventory-items');
    inventoryElement.innerHTML = '';  // Clear existing content

    [...portfolio.stocks, ...portfolio.commodities].forEach(item => {
        const marketItem = marketData.stocks.concat(marketData.commodities)
            .find(marketItem => marketItem.name === item.name);

        const currentMarketPrice = marketItem ? marketItem.price : item.price;  // Use market price if available

        const li = document.createElement('li');
        li.className = 'inventory-item';

        // Image
        const image = document.createElement('img');
        const imageName = item.name.toLowerCase().replace(/ /g, '-') + ".jpg";
        image.src = `images/${imageName}`;
        // Path should be set correctly
        image.alt = item.name;
        image.className = 'item-image';

        // Text Content
        const text = document.createElement('span');
        text.textContent = `${item.name} - Quantity: ${item.quantity}, Current Value: $${(currentMarketPrice * item.quantity).toFixed(2)}`;

        li.appendChild(image);
        li.appendChild(text);
        inventoryElement.appendChild(li);
    });
}

// Ensure this function is called when market data updates
setInterval(() => {
    updateMarketData();
    updateInventoryDisplay();  // This will refresh the inventory with updated prices
}, 5000);



    displayMarketItems();
    displayWatchlistItems();
    updatePortfolioDisplay();
});

document.getElementById('deposit-button').addEventListener('click', function() {
    document.getElementById('deposit-modal').classList.remove('hidden');
});

document.getElementById('withdraw-button').addEventListener('click', function() {
    document.getElementById('withdrawal-modal').classList.remove('hidden');
});

document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('deposit-modal').classList.add('hidden');
});


document.getElementById('deposit-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally
    const firstName = document.getElementById('first-name').value;
    const middleName = document.getElementById('middle-name').value;
    const lastName = document.getElementById('last-name').value;
    const cardNumber = document.getElementById('card-number').value;
    const cvv = document.getElementById('cvv').value;
    const amount = parseFloat(document.getElementById('deposit-amount').value);

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    console.log('Depositing:', amount, 'Name:', firstName + ' ' + middleName + ' ' + lastName, 'Card Number:', cardNumber, 'CVV:', cvv);
    // Here you can add the logic to actually process the deposit to the server or API
    portfolio.cash += amount; // Simulating deposit by adding to the cash available
    document.getElementById('cash-available').textContent = portfolio.cash.toFixed(2);
    document.getElementById('deposit-modal').classList.add('hidden');
    alert('Deposit successful!');
});

