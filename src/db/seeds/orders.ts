import { db } from '@/db';
import { orders } from '@/db/schema';

async function main() {
    const sampleOrders = [
        {
            productId: 3,
            buyerId: 4,
            sellerId: 2,
            status: 'completed',
            createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
        },
        {
            productId: 2,
            buyerId: 5,
            sellerId: 3,
            status: 'pending',
            createdAt: new Date('2024-01-18T14:20:00Z').toISOString(),
        },
        {
            productId: 6,
            buyerId: 4,
            sellerId: 2,
            status: 'completed',
            createdAt: new Date('2024-01-20T09:15:00Z').toISOString(),
        },
        {
            productId: 11,
            buyerId: 3,
            sellerId: 2,
            status: 'completed',
            createdAt: new Date('2024-01-22T16:45:00Z').toISOString(),
        },
        {
            productId: 16,
            buyerId: 5,
            sellerId: 2,
            status: 'completed',
            createdAt: new Date('2024-01-25T11:30:00Z').toISOString(),
        },
        {
            productId: 20,
            buyerId: 1,
            sellerId: 4,
            status: 'completed',
            createdAt: new Date('2024-01-28T13:00:00Z').toISOString(),
        },
        {
            productId: 8,
            buyerId: 2,
            sellerId: 5,
            status: 'pending',
            createdAt: new Date('2024-02-01T10:00:00Z').toISOString(),
        },
        {
            productId: 15,
            buyerId: 3,
            sellerId: 4,
            status: 'pending',
            createdAt: new Date('2024-02-03T15:30:00Z').toISOString(),
        },
        {
            productId: 17,
            buyerId: 1,
            sellerId: 3,
            status: 'cancelled',
            createdAt: new Date('2024-02-05T12:00:00Z').toISOString(),
        },
        {
            productId: 21,
            buyerId: 5,
            sellerId: 2,
            status: 'cancelled',
            createdAt: new Date('2024-02-07T14:45:00Z').toISOString(),
        },
    ];

    await db.insert(orders).values(sampleOrders);
    
    console.log('✅ Orders seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});