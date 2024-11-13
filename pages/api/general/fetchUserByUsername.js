'use server'

import { fetcher } from "@/lib/apiHelper"

export default async function fetchUserByUsername(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const { username, password } = req.body;

        const queryParams = { username, password };
        
        const baseUrl = "http://localhost:3003/api/user/list";

        const results = await fetcher(baseUrl, queryParams);

        return res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
