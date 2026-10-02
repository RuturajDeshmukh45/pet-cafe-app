const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('crypto');
const db = require('../config/db');

function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

async function seed() {
  console.log('🌱 Starting database seeding for Pet Café...');
  await db.initDb();

  // Clear existing data (in dependency order)
  console.log('🧹 Cleaning old data...');
  await db.query('DELETE FROM audit_logs');
  await db.query('DELETE FROM reviews');
  await db.query('DELETE FROM payments');
  await db.query('DELETE FROM order_items');
  await db.query('DELETE FROM orders');
  await db.query('DELETE FROM reservations');
  await db.query('DELETE FROM menu_items');
  await db.query('DELETE FROM pets');
  await db.query('DELETE FROM users');
  await db.query('DELETE FROM roles');

  // 1. Seed Roles
  const adminRoleId = generateId('role');
  const staffRoleId = generateId('role');
  const customerRoleId = generateId('role');

  await db.query('INSERT INTO roles (id, name) VALUES ($1, $2)', [adminRoleId, 'Admin']);
  await db.query('INSERT INTO roles (id, name) VALUES ($1, $2)', [staffRoleId, 'Staff']);
  await db.query('INSERT INTO roles (id, name) VALUES ($1, $2)', [customerRoleId, 'Customer']);

  console.log('✅ Roles seeded.');

  // 2. Seed Users
  const adminUserId = generateId('usr');
  const staffUserId = generateId('usr');
  const customerUserId1 = generateId('usr');
  const customerUserId2 = generateId('usr');

  const adminPassHash = await hashPassword('admin123');
  const staffPassHash = await hashPassword('staff123');
  const customerPassHash = await hashPassword('customer123');

  await db.query(
    'INSERT INTO users (id, name, email, phone, password_hash, role_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [adminUserId, 'Café Administrator', 'admin@petcafe.com', '+1 (555) 019-2834', adminPassHash, adminRoleId, 'Active']
  );

  await db.query(
    'INSERT INTO users (id, name, email, phone, password_hash, role_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [staffUserId, 'Emma Johnson (Head Barista)', 'staff@petcafe.com', '+1 (555) 012-4921', staffPassHash, staffRoleId, 'Active']
  );

  await db.query(
    'INSERT INTO users (id, name, email, phone, password_hash, role_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [customerUserId1, 'Alex Smith', 'customer@petcafe.com', '+1 (555) 839-1029', customerPassHash, customerRoleId, 'Active']
  );

  await db.query(
    'INSERT INTO users (id, name, email, phone, password_hash, role_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [customerUserId2, 'Sophia Martinez', 'sophia@example.com', '+1 (555) 948-2710', customerPassHash, customerRoleId, 'Active']
  );

  console.log('✅ Users seeded (Admin: admin@petcafe.com/admin123, Staff: staff@petcafe.com/staff123, Customer: customer@petcafe.com/customer123).');

  // 3. Seed Pets
  const pets = [
    {
      name: 'Luna',
      species: 'Cat',
      breed: 'British Shorthair',
      age: 12,
      description: 'Luna is a serene and gentle feline who loves observing the cafe from cozy window sills. She adores light chin scratches and lavender treats.',
      photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
      status: 'Available',
      careNotes: 'Feed hypoallergenic salmon wet food at 2:00 PM. Keep quiet tones around her nap corner.',
      restrictions: 'Please do not pick up while she is napping in her perch.'
    },
    {
      name: 'Milo',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 24,
      description: 'Milo is the sweetest, sunniest golden boy! High energy, extremely affectionate, and loves making friends with children and first-time dog visitors.',
      photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
      status: 'Available',
      careNotes: 'Daily brushing at 10 AM. Fresh water bowl must be refreshed every 2 hours.',
      restrictions: 'Max 3 safe cafe treats per customer visit.'
    },
    {
      name: 'Bella',
      species: 'Rabbit',
      breed: 'Holland Lop',
      age: 8,
      description: 'Bella is a fluffy Holland Lop with delightfully droopy ears. She is calm, curious, and will happily munch on dried timothy hay from your palms.',
      photoUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
      status: 'Available',
      careNotes: 'Keep temperature cool (68-72°F). Fresh organic romaine leaves provided at 4 PM.',
      restrictions: 'Always sit on the floor mat when petting. Do not lift by ears or ribs.'
    },
    {
      name: 'Oliver',
      species: 'Cat',
      breed: 'Scottish Fold',
      age: 18,
      description: 'Oliver has charming folded ears and big amber eyes. He is extremely peaceful and loves cuddling in customers laps while they enjoy hot lattes.',
      photoUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80',
      status: 'Resting',
      careNotes: 'Rest time 1:00 PM - 3:00 PM in the quiet mezzanine room.',
      restrictions: 'Restricted interaction while resting sign is displayed.'
    },
    {
      name: 'Charlie',
      species: 'Dog',
      breed: 'Welsh Corgi',
      age: 14,
      description: 'Charlie is our energetic little loaf with a big smile! He loves playing with soft chew toys and performing tricks for puppy cookies.',
      photoUrl: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=800&auto=format&fit=crop&q=80',
      status: 'Available',
      careNotes: 'Walked every 3 hours by staff. Avoid stairs due to long spine.',
      restrictions: 'Staff must supervise agility obstacle play.'
    },
    {
      name: 'Daisy',
      species: 'Cat',
      breed: 'Ragdoll',
      age: 10,
      description: 'Daisy goes completely limp and purrs like a motor engine when held. Incredibly soft coat and hypoallergenic grooming routine.',
      photoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=80',
      status: 'Available',
      careNotes: 'Brush twice daily. Eye drops in morning.',
      restrictions: 'Gentle handling only; suitable for quiet reading sessions.'
    },
    {
      name: 'Toby',
      species: 'Dog',
      breed: 'Beagle',
      age: 20,
      description: 'Toby has the most expressive hound eyes and loves gentle head scratches. He is inquisitive, calm, and loves curling up beside tables.',
      photoUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&auto=format&fit=crop&q=80',
      status: 'Available',
      careNotes: 'Strict diet plan to maintain healthy weight. Only vet-approved liver snacks.',
      restrictions: 'Keep customer food away from sniffing range.'
    },
    {
      name: 'Pip',
      species: 'Rabbit',
      breed: 'Netherland Dwarf',
      age: 6,
      description: 'Pip is tiny, energetic, and loves exploring our rabbit play tunnels. He does celebratory binkies when given fresh dill sprigs!',
      photoUrl: 'https://images.unsplash.com/photo-1591382696684-38c427c7547a?w=800&auto=format&fit=crop&q=80',
      status: 'Playing',
      careNotes: 'Provide fresh water bowl and timothy pellet bowl.',
      restrictions: 'Enclosed indoor pen only. Shoes off in rabbit zone.'
    }
  ];

  const petIds = [];
  for (const pet of pets) {
    const petId = generateId('pet');
    petIds.push(petId);
    await db.query(
      `INSERT INTO pets (id, name, species, breed, age, description, photo_url, status, care_notes, restrictions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [petId, pet.name, pet.species, pet.breed, pet.age, pet.description, pet.photoUrl, pet.status, pet.careNotes, pet.restrictions]
    );
  }
  console.log(`✅ ${pets.length} Pets seeded.`);

  // 4. Seed Menu Items
  const menuItems = [
    {
      name: 'Artisan Vanilla Bean Latte',
      category: 'Coffee',
      description: 'Single-origin espresso infused with Madagascar vanilla bean syrup and velvety steamed whole milk, topped with foam paw art.',
      price: 5.75,
      imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    },
    {
      name: 'Caramel Macchiato Swirl',
      category: 'Coffee',
      description: 'Rich dark espresso layered over steamed milk and sweet vanilla, drizzled with buttery artisanal caramel.',
      price: 6.25,
      imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    },
    {
      name: 'Ceremonial Matcha Green Latte',
      category: 'Tea',
      description: 'Uji Japanese ceremonial grade matcha whisked with oat milk and a touch of wild honey.',
      price: 5.95,
      imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    },
    {
      name: 'Golden Butter French Croissant',
      category: 'Bakery',
      description: 'Flaky, buttery multi-layered pastry baked fresh every morning with Normandy butter.',
      price: 4.50,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    },
    {
      name: 'Berry Bliss Belgian Waffle',
      category: 'Desserts',
      description: 'Warm crisp Belgian waffle served with fresh organic strawberries, blueberries, vanilla cream, and maple syrup.',
      price: 8.50,
      imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    },
    {
      name: 'Purr-fect Cinnamon Roll',
      category: 'Bakery',
      description: 'Warm, gooey cinnamon roll glazed with cream cheese frosting and brown sugar crumble.',
      price: 4.95,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    },
    {
      name: 'Iced Peach Blossom Tea',
      category: 'Tea',
      description: 'Refreshing white tea brewed with white peach nectar, mint leaves, and edible organic blossoms.',
      price: 4.75,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    },
    {
      name: 'Avocado Toast with Poached Egg',
      category: 'Savory Snacks',
      description: 'Toasted sourdough topped with smashed Hass avocado, sea salt flakes, red pepper crisps, and a cage-free poached egg.',
      price: 9.25,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    },
    {
      name: 'Truffle & Herb Grilled Cheese',
      category: 'Savory Snacks',
      description: 'Triple cheese blend (aged cheddar, gruyere, and mozzarella) melted with truffle butter on brioche bread.',
      price: 8.95,
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    },
    {
      name: 'Chocolate Fudge Paw Brownie',
      category: 'Desserts',
      description: 'Decadent Belgian dark chocolate brownie topped with chocolate ganache shaped like an adorable puppy paw.',
      price: 4.25,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
      status: 'Available'
    }
  ];

  const menuItemIds = [];
  for (const item of menuItems) {
    const itemId = generateId('item');
    menuItemIds.push(itemId);
    await db.query(
      `INSERT INTO menu_items (id, name, category, description, price, image_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [itemId, item.name, item.category, item.description, item.price, item.imageUrl, item.status]
    );
  }
  console.log(`✅ ${menuItems.length} Menu Items seeded.`);

  // 5. Seed Reservations
  const res1Id = generateId('res');
  const res2Id = generateId('res');

  await db.query(
    `INSERT INTO reservations (id, user_id, date, start_time, party_size, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [res1Id, customerUserId1, '2026-10-05', '14:00', 2, 'Confirmed', 'Window seating preferred. Excited to meet Luna!']
  );

  await db.query(
    `INSERT INTO reservations (id, user_id, date, start_time, party_size, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [res2Id, customerUserId2, '2026-10-06', '16:30', 4, 'Confirmed', 'Celebrating a birthday! First time with rabbits.']
  );

  console.log('✅ Reservations seeded.');

  // 6. Seed Orders
  const order1Id = generateId('ord');
  await db.query(
    `INSERT INTO orders (id, user_id, reservation_id, total_amount, status, order_type)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [order1Id, customerUserId1, res1Id, 15.20, 'Served', 'Dine-In']
  );

  // Order items
  await db.query(
    `INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, subtotal)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [generateId('oi'), order1Id, menuItemIds[0], 1, 5.75, 5.75]
  );
  await db.query(
    `INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, subtotal)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [generateId('oi'), order1Id, menuItemIds[3], 1, 4.50, 4.50]
  );
  await db.query(
    `INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, subtotal)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [generateId('oi'), order1Id, menuItemIds[9], 1, 4.25, 4.25]
  );

  // Payment for Order 1
  await db.query(
    `INSERT INTO payments (id, order_id, reservation_id, amount, method, status, transaction_ref)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [generateId('pay'), order1Id, res1Id, 15.20, 'Online (Card)', 'Completed', 'TXN_CAFE_829104']
  );

  console.log('✅ Orders & Payments seeded.');

  // 7. Seed Reviews
  await db.query(
    `INSERT INTO reviews (id, user_id, reservation_id, rating, comment, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      generateId('rev'),
      customerUserId1,
      res1Id,
      5,
      'The coziest café in town! Luna rested right beside our table while we drank our vanilla lattes. The hygiene protocol is top notch and the animals are so well cared for.',
      'Approved'
    ]
  );

  await db.query(
    `INSERT INTO reviews (id, user_id, reservation_id, rating, comment, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      generateId('rev'),
      customerUserId2,
      res2Id,
      5,
      'Such a wholesome experience! Milo the golden retriever gave us the happiest welcome, and the Belgian waffles were incredible. Highly recommend booking early!',
      'Approved'
    ]
  );

  console.log('✅ Reviews seeded.');

  // 8. Seed Audit Log
  await db.query(
    `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [generateId('audit'), adminUserId, 'INITIAL_SYSTEM_SETUP', 'System', 'ALL']
  );

  console.log('🎉 Seeding successfully completed! Everything is ready.');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seed };
