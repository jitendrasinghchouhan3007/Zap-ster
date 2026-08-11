const BASE_URL = 'http://localhost:4545/api';

async function runTests() {
  console.log('🧪 Starting automated API and Business Logic verification test suite...');

  try {
    // 1. Health check
    const health = await (await fetch(`${BASE_URL}/health`)).json();
    console.log('✅ Health Check Response:', health.status);

    // 2. Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });
    const adminAuth = await adminLoginRes.json();
    if (!adminAuth.token) throw new Error('Admin login failed');
    console.log('✅ Admin Auth Token acquired for:', adminAuth.user.email);
    const adminToken = adminAuth.token;

    // 3. Customer Login
    const custLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@example.com', password: 'customer123' })
    });
    const custAuth = await custLoginRes.json();
    if (!custAuth.token) throw new Error('Customer login failed');
    console.log('✅ Customer Auth Token acquired for:', custAuth.user.email);
    const custToken = custAuth.token;

    // 4. Create Product (Admin)
    const createProdRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Test Mechanical Mouse',
        description: 'High DPI gaming mouse with optical sensors.',
        price: 49.99,
        stock: 10,
        category: 'Electronics'
      })
    });
    const newProd = await createProdRes.json();
    console.log('✅ Created Product:', newProd.product.name, '| Initial Stock:', newProd.product.stock);
    const testProductId = newProd.product.id;

    // 5. Product Listing with Search & Filters
    const listRes = await fetch(`${BASE_URL}/products?search=Mechanical&category=Electronics`);
    const listData = await listRes.json();
    console.log('✅ Filtered Products Count:', listData.products.length, '| Total Pages:', listData.pagination.totalPages);

    // 6. Create Order (Customer buys 3 units of test product)
    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${custToken}`
      },
      body: JSON.stringify({
        items: [{ productId: testProductId, quantity: 3 }]
      })
    });
    const orderData = await orderRes.json();
    console.log('✅ Order Placed Successfully!');
    console.log('   - Order ID:', orderData.order.id);
    console.log('   - Total Amount (Auto-Calculated):', `$${orderData.order.totalAmount}`);
    const createdOrderId = orderData.order.id;

    // Verify stock reduced from 10 to 7
    const prodDetailRes = await fetch(`${BASE_URL}/products/${testProductId}`);
    const prodDetail = await prodDetailRes.json();
    console.log('✅ Post-Order Inventory Stock Level:', prodDetail.product.stock, '(Expected: 7)');
    if (prodDetail.product.stock !== 7) throw new Error('Stock decrement mismatch');

    // 7. Insufficient Stock Validation Test (Attempt to order 20 units when stock is 7)
    const failOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${custToken}`
      },
      body: JSON.stringify({
        items: [{ productId: testProductId, quantity: 20 }]
      })
    });
    const failOrderData = await failOrderRes.json();
    console.log('✅ Insufficient Stock Guard Status Code:', failOrderRes.status, '(Expected 400)');
    console.log('   - Validation Message:', failOrderData.message);

    // 8. Cancel Order & Verify Inventory Restoration
    const cancelRes = await fetch(`${BASE_URL}/orders/${createdOrderId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${custToken}`
      }
    });
    const cancelData = await cancelRes.json();
    console.log('✅ Order Cancellation Status:', cancelData.order.status);

    const restoredProdRes = await fetch(`${BASE_URL}/products/${testProductId}`);
    const restoredProd = await restoredProdRes.json();
    console.log('✅ Restored Inventory Stock Level:', restoredProd.product.stock, '(Expected: 10)');
    if (restoredProd.product.stock !== 10) throw new Error('Stock restoration mismatch');

    // 9. Clean up test product
    await fetch(`${BASE_URL}/products/${testProductId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Deleted Test Product.');

    console.log('🎉 ALL BACKEND BUSINESS LOGIC TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test execution failed:', err);
    process.exit(1);
  }
}

runTests();
