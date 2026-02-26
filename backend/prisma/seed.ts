// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '@prisma/client';

// const adapter = new PrismaPg({
//     connectionString: process.env.DATABASE_URL!,
// });

// const prisma = new PrismaClient({ adapter });

// async function main() {
//     const vedId = 42;
//     const aadityaId = 43;

//     console.log('🌱 Seeding started...');

//     // ---------------- PERSONAL TRANSACTIONS ----------------
//     await prisma.transaction.createMany({
//         data: [
//             {
//                 userId: vedId,
//                 title: 'Salary',
//                 amount: 50000,
//                 type: 'INCOME',
//                 category: 'Salary',
//             },
//             {
//                 userId: vedId,
//                 title: 'Zomato Dinner',
//                 amount: 450,
//                 type: 'EXPENSE',
//                 category: 'Food',
//             },
//             {
//                 userId: vedId,
//                 title: 'Uber Ride',
//                 amount: 180,
//                 type: 'EXPENSE',
//                 category: 'Transport',
//             },
//             {
//                 userId: aadityaId,
//                 title: 'Freelance Payment',
//                 amount: 20000,
//                 type: 'INCOME',
//                 category: 'Work',
//             },
//             {
//                 userId: aadityaId,
//                 title: 'Shopping',
//                 amount: 2500,
//                 type: 'EXPENSE',
//                 category: 'Shopping',
//             },
//         ],
//     });

//     // ---------------- GROUP ----------------
//     const group = await prisma.group.create({
//         data: {
//             name: 'Goa Trip 🍻',
//             createdBy: vedId,
//             members: {
//                 create: [
//                     { userId: vedId, role: 'ADMIN' },
//                     { userId: aadityaId, role: 'MEMBER' },
//                 ],
//             },
//         },
//     });

//     // ---------------- EXPENSE 1 (Ved paid hotel 2000 split) ----------------
//     const hotelExpense = await prisma.expense.create({
//         data: {
//             groupId: group.id,
//             paidBy: vedId,
//             description: 'Hotel Booking',
//             amount: 2000,
//             participants: {
//                 create: [
//                     {
//                         userId: vedId,
//                         share: 1000,
//                         paidShare: 2000,
//                     },
//                     {
//                         userId: aadityaId,
//                         share: 1000,
//                         paidShare: 0,
//                     },
//                 ],
//             },
//         },
//     });

//     // ---------------- EXPENSE 2 (Aaditya paid dinner 600) ----------------
//     const dinnerExpense = await prisma.expense.create({
//         data: {
//             groupId: group.id,
//             paidBy: aadityaId,
//             description: 'Beach Dinner',
//             amount: 600,
//             participants: {
//                 create: [
//                     {
//                         userId: vedId,
//                         share: 300,
//                         paidShare: 0,
//                     },
//                     {
//                         userId: aadityaId,
//                         share: 300,
//                         paidShare: 600,
//                     },
//                 ],
//             },
//         },
//     });

//     // ---------------- EXPENSE 3 (Ved paid scooter 400) ----------------
//     await prisma.expense.create({
//         data: {
//             groupId: group.id,
//             paidBy: vedId,
//             description: 'Scooter Rent',
//             amount: 400,
//             participants: {
//                 create: [
//                     { userId: vedId, share: 200, paidShare: 400 },
//                     { userId: aadityaId, share: 200, paidShare: 0 },
//                 ],
//             },
//         },
//     });

//     // ---------------- SETTLEMENT ----------------
//     // Aaditya pays Ved back
//     await prisma.settlement.create({
//         data: {
//             groupId: group.id,
//             paidBy: aadityaId,
//             paidTo: vedId,
//             amount: 500,
//             note: 'Partial settlement',
//         },
//     });

//     console.log('✅ Seeding finished!');
// }

// main()
//     .catch(e => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, TransactionType, GroupRole } from '@prisma/client';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const ved = 42;
    const aaditya = 43;
    const tejas = 45;
    const ansh = 48;

    /* ------------------ GROUP 1 (2 MEMBERS) ------------------ */
    const goa = await prisma.group.create({
        data: {
            name: 'Goa Trip',
            createdBy: ved,
            members: {
                create: [{ userId: ved, role: GroupRole.ADMIN }, { userId: aaditya }],
            },
        },
    });

    // Ved paid hotel split equally
    const hotel = await prisma.expense.create({
        data: {
            groupId: goa.id,
            paidBy: ved,
            description: 'Hotel Booking',
            amount: 4000,
            participants: {
                create: [
                    { userId: ved, share: 2000, paidShare: 2000 },
                    { userId: aaditya, share: 2000, paidShare: 0 },
                ],
            },
        },
    });

    // Aaditya paid dinner but Ved ate more (uneven)
    await prisma.expense.create({
        data: {
            groupId: goa.id,
            paidBy: aaditya,
            description: 'Dinner',
            amount: 1200,
            participants: {
                create: [
                    { userId: ved, share: 900, paidShare: 0 },
                    { userId: aaditya, share: 300, paidShare: 1200 },
                ],
            },
        },
    });

    /* ------------------ GROUP 2 (3 MEMBERS) ------------------ */
    const flat = await prisma.group.create({
        data: {
            name: 'Flatmates',
            createdBy: tejas,
            members: {
                create: [
                    { userId: ved },
                    { userId: tejas, role: GroupRole.ADMIN },
                    { userId: ansh },
                ],
            },
        },
    });

    // Groceries split equally
    await prisma.expense.create({
        data: {
            groupId: flat.id,
            paidBy: tejas,
            description: 'Groceries',
            amount: 1500,
            participants: {
                create: [
                    { userId: ved, share: 500, paidShare: 0 },
                    { userId: tejas, share: 500, paidShare: 1500 },
                    { userId: ansh, share: 500, paidShare: 0 },
                ],
            },
        },
    });

    // Electricity — Ansh not home → excluded
    await prisma.expense.create({
        data: {
            groupId: flat.id,
            paidBy: ved,
            description: 'Electricity Bill',
            amount: 900,
            participants: {
                create: [
                    { userId: ved, share: 450, paidShare: 900 },
                    { userId: tejas, share: 450, paidShare: 0 },
                ],
            },
        },
    });

    /* ------------------ GROUP 3 (4 MEMBERS) ------------------ */
    const office = await prisma.group.create({
        data: {
            name: 'Office Lunch',
            createdBy: aaditya,
            members: {
                create: [
                    { userId: ved },
                    { userId: aaditya, role: GroupRole.ADMIN },
                    { userId: tejas },
                    { userId: ansh },
                ],
            },
        },
    });

    // Even split
    await prisma.expense.create({
        data: {
            groupId: office.id,
            paidBy: ansh,
            description: 'Pizza Party',
            amount: 2000,
            participants: {
                create: [
                    { userId: ved, share: 500, paidShare: 0 },
                    { userId: aaditya, share: 500, paidShare: 0 },
                    { userId: tejas, share: 500, paidShare: 0 },
                    { userId: ansh, share: 500, paidShare: 2000 },
                ],
            },
        },
    });

    // Only 2 people ate dessert
    await prisma.expense.create({
        data: {
            groupId: office.id,
            paidBy: ved,
            description: 'Dessert',
            amount: 800,
            participants: {
                create: [
                    { userId: ved, share: 400, paidShare: 800 },
                    { userId: tejas, share: 400, paidShare: 0 },
                ],
            },
        },
    });

    /* ------------------ SETTLEMENTS ------------------ */
    await prisma.settlement.create({
        data: {
            groupId: goa.id,
            paidBy: aaditya,
            paidTo: ved,
            amount: 500,
            note: 'Partial payback',
        },
    });

    await prisma.settlement.create({
        data: {
            groupId: flat.id,
            paidBy: ansh,
            paidTo: tejas,
            amount: 300,
        },
    });

    /* ------------------ PERSONAL TRANSACTIONS ------------------ */
    const personal = [
        { userId: ved, title: 'Salary', amount: 50000, type: 'INCOME', category: 'Salary' },
        { userId: ved, title: 'Swiggy', amount: 320, type: 'EXPENSE', category: 'Food' },
        { userId: ved, title: 'Uber', amount: 210, type: 'EXPENSE', category: 'Travel' },
        { userId: ved, title: 'Netflix', amount: 199, type: 'EXPENSE', category: 'Subscription' },
        { userId: aaditya, title: 'Freelance', amount: 12000, type: 'INCOME', category: 'Work' },
        { userId: aaditya, title: 'Shopping', amount: 2500, type: 'EXPENSE', category: 'Shopping' },
        { userId: tejas, title: 'Recharge', amount: 399, type: 'EXPENSE', category: 'Bills' },
        { userId: ansh, title: 'Gym', amount: 1500, type: 'EXPENSE', category: 'Health' },
    ];

    for (const t of personal) {
        await prisma.transaction.create({
            data: {
                userId: t.userId,
                title: t.title,
                amount: t.amount,
                type: t.type as TransactionType,
                category: t.category,
            },
        });
    }

    console.log('🌱 Advanced seed completed!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
