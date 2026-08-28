const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Seeding Pet Café database...');

  // 1. Clean existing data
  await prisma.auditLog.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.pet.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  // 2. Seed Roles
  const adminRole = await prisma.role.create({ data: { name: 'Admin' } });
  const staffRole = await prisma.role.create({ data: { name: 'Staff' } });
  const customerRole = await prisma.role.create({ data: { name: 'Customer' } });

  console.log('Roles seeded.');

  // 3. Seed Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Café Administrator',
      email: 'admin@petcafe.com',
      phone: '+1234567890',
      passwordHash: hashPassword('admin123'),
      roleId: adminRole.id,
      status: 'Active',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      name: 'Emma Johnson (Staff)',
      email: 'staff@petcafe.com',
      phone: '+1987654321',
      passwordHash: hashPassword('staff123'),
      roleId: staffRole.id,
      status: 'Active',
    },
  });

  const customerUser1 = await prisma.user.create({
    data: {
      name: 'Alex Smith',
      email: 'customer@petcafe.com',
      phone: '+1555123456',
      passwordHash: hashPassword('customer123'),
      roleId: customerRole.id,
      status: 'Active',
    },
  });

  const customerUser2 = await prisma.user.create({
    data: {
      name: 'Sophia Martinez',
      email: 'sophia@example.com',
      phone: '+1555987654',
      passwordHash: hashPassword('customer123'),
      roleId: customerRole.id,
      status: 'Active',
    },
  });

  console.log('Users seeded.');

  // 4. Seed Pets
  const pets = [
    {
      name: 'Luna',
      species: 'Cat',
      breed: 'British Shorthair',
      age: 12, // months
      description: 'Luna is a quiet and independent cat who loves sitting near windows. She enjoys gentle chin scratches.',
      photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
      status: 'Available',
      careNotes: 'Feed wet food at 2 PM. Avoid high-pitched noises.',
      restrictions: 'Do not pull her tail. Suitable for all ages.',
    },
    {
      name: 'Milo',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 24, // months
      description: 'Milo is extremely friendly, high-energy, and loves playing fetch. Great with kids!',
      photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
      status: 'Playing',
      careNotes: 'Needs water breaks after playing. Limit treat rewards to 3 per day.',
      restrictions: 'Keep leash nearby. Do not feed chocolate or menu items.',
    },
    {
      name: 'Oliver',
      species: 'Cat',
      breed: 'Ragdoll',
      age: 18, // months
      description: 'Oliver is a gentle giant who goes limp like a ragdoll when held. He loves sleeping in laps.',
      photoUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80',
      status: 'Resting',
      careNotes: 'Brush his coat daily to avoid matting.',
      restrictions: 'Support his hind legs when lifting. Do not disturb while sleeping.',
    },
    {
      name: 'Bella',
      species: 'Rabbit',
      breed: 'Holland Lop',
      age: 8, // months
      description: 'Bella is a curious little rabbit who likes exploring tunnels. She is very soft and active.',
      photoUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80',
      status: 'Available',
      careNotes: 'Must have access to hay at all times. Check ear cleanliness.',
      restrictions: 'Do not lift by the ears. Avoid sudden movements.',
    },
    {
      name: 'Coco',
      species: 'Dog',
      breed: 'Toy Poodle',
      age: 10, // months
      description: 'Coco is an intelligent, hypoallergenic pup. He is a bit shy at first but warms up quickly.',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      status: 'Available',
      careNotes: 'Sensitive skin. Brush carefully.',
      restrictions: 'Approaching slowly is best. Do not startle.',
    },
    {
      name: 'Daisy',
      species: 'Cat',
      breed: 'Maine Coon',
      age: 36, // months
      description: 'Daisy is a large, majestic cat with tufted ears. She has a chirpy meow and loves water fountains.',
      photoUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&auto=format&fit=crop&q=80',
      status: 'Unavailable',
      careNotes: 'Recovering from a minor sprain. Currently resting in the back room.',
      restrictions: 'Not allowed in public play areas until cleared by vet.',
    },
  ];

  for (const pet of pets) {
    await prisma.pet.create({ data: pet });
  }
  console.log('Pets seeded.');

  // 5. Seed Menu Items
  const menuItems = [
    // Coffee
    { name: 'Classic Espresso', category: 'Coffee', description: 'Double shot of our signature house blend espresso.', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1510701114205-0cff47862245?w=500&auto=format&fit=crop&q=80', status: 'Available' },
    { name: 'Caffè Latte', category: 'Coffee', description: 'Espresso with steamed milk and a thin layer of foam.', price: 4.75, imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?w=500&auto=format&fit=crop&q=80', status: 'Available' },
    { name: 'Cappuccino', category: 'Coffee', description: 'Equal parts espresso, steamed milk, and rich foam, dusted with cocoa.', price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=80', status: 'Available' },
    { name: 'Meow-cha (Mocha)', category: 'Coffee', description: 'Rich espresso, dark chocolate sauce, and steamed milk topped with whipped cream.', price: 5.25, imageUrl: 'https://images.unsplash.com/photo-1607681034540-2c46cc71896d?w=500&auto=format&fit=crop&q=80', status: 'Available' },
    
    // Tea
    { name: 'Ceremonial Matcha Latte', category: 'Tea', description: 'High-grade Japanese stone-ground green tea whisked with creamy steamed milk.', price: 5.50, imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80', status: 'Available' },
    { name: 'Jasmine Green Tea', category: 'Tea', description: 'Delicate, fragrant green tea scented with fresh jasmine blossoms.', price: 4.00, imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=80', status: 'Available' },

    // Bakery
    { name: 'Cat-shaped Butter Cookies', category: 'Bakery', description: 'Box of 3 buttery, melt-in-your-mouth shortbread cookies shaped like cats.', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1558961309-dbdf71799f5a?w=500&auto=format&fit=crop&q=80', status: 'Available' },
    { name: 'Chocolate Croissant', category: 'Bakery', description: 'Flaky, buttery puff pastry filled with two dark chocolate batons.', price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80', status: 'Available' },
    { name: 'New York Cheesecake', category: 'Bakery', description: 'Rich, dense, and creamy cheesecake slice with a buttery graham cracker crust.', price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80', status: 'Available' },

    // Beverages
    { name: 'Iced Peach Fruit Tea', category: 'Beverage', description: 'Refreshing black tea brewed with sweet peach puree and fresh mint.', price: 4.75, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80', status: 'Available' },
    { name: 'Fresh Orange Juice', category: 'Beverage', description: '100% freshly squeezed juice from local valencia oranges.', price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80', status: 'Available' }
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }
  console.log('Menu items seeded.');

  // 6. Seed Reservations and Orders
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const reservation1 = await prisma.reservation.create({
    data: {
      userId: customerUser1.id,
      date: today,
      startTime: '14:00',
      partySize: 2,
      status: 'Confirmed',
      notes: 'Loves cats! Prefers a table near Luna.',
    },
  });

  const reservation2 = await prisma.reservation.create({
    data: {
      userId: customerUser2.id,
      date: tomorrow,
      startTime: '16:30',
      partySize: 4,
      status: 'Pending',
      notes: 'Celebratory visit. Wants to play with Milo.',
    },
  });

  console.log('Reservations seeded.');

  // 7. Seed Orders & Payments
  const order1 = await prisma.order.create({
    data: {
      userId: customerUser1.id,
      reservationId: reservation1.id,
      totalAmount: 14.50,
      status: 'Served',
    },
  });

  const catCookie = await prisma.menuItem.findFirst({ where: { name: 'Cat-shaped Butter Cookies' } });
  const latte = await prisma.menuItem.findFirst({ where: { name: 'Caffè Latte' } });

  if (catCookie && latte) {
    await prisma.orderItem.createMany({
      data: [
        { orderId: order1.id, menuItemId: catCookie.id, quantity: 2, unitPrice: catCookie.price, subtotal: catCookie.price * 2 },
        { orderId: order1.id, menuItemId: latte.id, quantity: 1, unitPrice: latte.price, subtotal: latte.price },
      ],
    });
  }

  await prisma.payment.create({
    data: {
      orderId: order1.id,
      amount: 14.50,
      method: 'Online',
      status: 'Completed',
      transactionRef: 'TXN-MOCK-991823',
    },
  });

  console.log('Orders and payments seeded.');

  // 8. Seed Reviews
  await prisma.review.createMany({
    data: [
      {
        userId: customerUser1.id,
        reservationId: reservation1.id,
        rating: 5,
        comment: 'Absolutely delightful experience! Luna was sitting right next to us the whole time. The Meow-cha and cat cookies were delicious!',
        status: 'Approved',
      },
      {
        userId: customerUser2.id,
        rating: 4,
        comment: 'Great atmosphere and very clean. The staff does a wonderful job of keeping the space pleasant for both customers and pets.',
        status: 'Approved',
      },
    ],
  });

  console.log('Reviews seeded.');

  // 9. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { userId: adminUser.id, action: 'CREATE_PET', entityType: 'Pet', entityId: 'Luna' },
      { userId: adminUser.id, action: 'CREATE_MENU_ITEM', entityType: 'MenuItem', entityId: 'Classic Espresso' },
      { userId: staffUser.id, action: 'CONFIRM_RESERVATION', entityType: 'Reservation', entityId: reservation1.id },
    ],
  });

  console.log('Audit logs seeded.');
  console.log('Database seeding successfully completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
