
let subtotal = parseFloat(localStorage.getItem('cartTotal')) || 0;
let deliveryFee = 23.50;
let currentTip = 0;
let discount = 0;


function updateSummary() {
    let total = subtotal + deliveryFee + currentTip - discount;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('delivery').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('tip').textContent = `$${currentTip.toFixed(2)}`;
    document.getElementById('discount').textContent = `$${discount.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function addTip(amount) {
    currentTip += amount;
    alert(`Tip added: $${amount}. Total tip: $${currentTip}`);
    updateSummary();
}


document.getElementById('visaRadio').addEventListener('change', function () {
    document.getElementById('visaDetails').style.display = 'block';
});

document.querySelector('input[name="paymentMethod"][value="Cash"]').addEventListener('change', function () {
    document.getElementById('visaDetails').style.display = 'none';
});


document.getElementById('applyPromoBtn').addEventListener('click', function () {
    let promoCode = document.getElementById('promoCode').value.trim();
    if (promoCode === 'FIRST10') {
        discount = 10;
        alert('Promo code applied. You saved $10!');
        updateSummary();
    } else {
        alert('Invalid promo code.');
        discount = 0; 
    }
});


updateSummary();

function redirectToAfterCheck(event) {
    event.preventDefault();

    // Retrieve form values
    const address = document.getElementById('address').value.trim();
    const deliveryTime = document.getElementById('deliveryTime').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const promoCode = document.getElementById('promoCode').value.trim();
    const tipAmount = currentTip;

    if (!address || !deliveryTime || !paymentMethod) {
        alert('Please complete all required fields.');
        return;
    }

   
    let cardNumber = "", expiryDate = "", cvv = "";
    if (paymentMethod === 'Visa') {
        cardNumber = document.getElementById('cardNumber').value;
        expiryDate = document.getElementById('expiryDate').value;
        cvv = document.getElementById('cvv').value;

        const cardNumberValid = /^\d{16}$/.test(cardNumber);
        const expiryDateValid = /^\d{2}\/\d{2}$/.test(expiryDate);
        const cvvValid = /^\d{3}$/.test(cvv);

        if (!cardNumberValid || !expiryDateValid || !cvvValid) {
            alert('Please enter valid Visa card details.');
            return;
        }
    }

    
    const orderDetails = {
        deliveryAddress: address,
        deliveryTime: deliveryTime,
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        promoCode: promoCode,
        tipAmount: tipAmount,
        subtotal: subtotal,
        delivery: deliveryFee,
        discount: discount,
        total: subtotal + deliveryFee + tipAmount - discount
    };
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    localStorage.removeItem('cart'); 
    localStorage.removeItem('cartTotal'); 

    alert("Order submitted successfully! Redirecting to receipt page.");
    window.location.href = "../views/aftercheck.ejs"; 

    console.log("Form is valid; redirecting to aftercheck.ejs");
   
}
