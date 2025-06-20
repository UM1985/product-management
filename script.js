 let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    let usage = JSON.parse(localStorage.getItem('usage')) || [];
    let invoice = [];

    const addProductForm = document.getElementById('addProductForm');
    const inventoryList = document.getElementById('inventoryList');
    const productSelect = document.getElementById('productSelect');
    const invoiceList = document.getElementById('invoiceList');
    const totalPrice = document.getElementById('totalPrice');
    const usageHistory = document.getElementById('usageHistory');

    function saveInventory() {
      localStorage.setItem('inventory', JSON.stringify(inventory));
      renderInventory();
    }

    function saveUsage(productName, dateTime) {
      usage.push({ name: productName, date: dateTime });
      localStorage.setItem('usage', JSON.stringify(usage));
      renderUsage();
    }

    function renderInventory() {
      inventoryList.innerHTML = '';
      productSelect.innerHTML = '<option disabled selected>Select product</option>';
      inventory.forEach((product, index) => {
        inventoryList.innerHTML += `<li class="list-group-item d-flex justify-content-between">
          ${product.name} - Qty: ${product.qty} - ₹${product.price}
        </li>`;
        if (product.qty > 0) {
          productSelect.innerHTML += `<option value="${index}">${product.name} (₹${product.price})</option>`;
        }
        if (product.qty === 3) {
          alert(`⚠️ Low stock alert: Only 3 ${product.name}s left!`);
        }
      });
    }

    function renderUsage() {
      usageHistory.innerHTML = '';
      usage.forEach(entry => {
        usageHistory.innerHTML += `<li class="list-group-item">${entry.name} - ${entry.date}</li>`;
      });
    }

    addProductForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('productName').value.trim();
      const qty = parseInt(document.getElementById('productQty').value);
      const price = parseFloat(document.getElementById('productPrice').value);
      inventory.push({ name, qty, price });
      addProductForm.reset();
      saveInventory();
    });

    function addToInvoice() {
      const index = productSelect.value;
      if (index !== '') {
        const product = inventory[index];
        if (product.qty > 0) {
          invoice.push(product);
          product.qty--;
          saveInventory();
          saveUsage(product.name, new Date().toLocaleString());
          renderInvoice();
        } else {
          alert('❌ Product out of stock!');
        }
      }
    }

    function renderInvoice() {
      invoiceList.innerHTML = '';
      let total = 0;
      invoice.forEach(item => {
        invoiceList.innerHTML += `<li class="list-group-item d-flex justify-content-between">
          ${item.name} - ₹${item.price}
        </li>`;
        total += item.price;
      });
      totalPrice.textContent = total;
    }

    function downloadPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("Krishna Automobiles - Invoice", 10, 10);
      let y = 20;
      invoice.forEach(item => {
        doc.text(`${item.name} - ₹${item.price}`, 10, y);
        y += 10;
      });
      doc.text(`Total: ₹${totalPrice.textContent}`, 10, y);
      doc.save("invoice.pdf");
    }

    // Initial load
    renderInventory();
    renderUsage();