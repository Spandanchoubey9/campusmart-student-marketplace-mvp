import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const sampleUsers = [
        {
            email: 'alex.johnson@mit.edu',
            password: bcrypt.hashSync('password123', 10),
            name: 'Alex Johnson',
            college: 'MIT',
            phone: '617-555-0101',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'sarah.chen@stanford.edu',
            password: bcrypt.hashSync('password123', 10),
            name: 'Sarah Chen',
            college: 'Stanford',
            phone: '650-555-0102',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'michael.brown@harvard.edu',
            password: bcrypt.hashSync('password123', 10),
            name: 'Michael Brown',
            college: 'Harvard',
            phone: '617-555-0103',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'emily.davis@berkeley.edu',
            password: bcrypt.hashSync('password123', 10),
            name: 'Emily Davis',
            college: 'Berkeley',
            phone: '510-555-0104',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'james.wilson@nyu.edu',
            password: bcrypt.hashSync('password123', 10),
            name: 'James Wilson',
            college: 'NYU',
            phone: '212-555-0105',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully - 5 users created');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});