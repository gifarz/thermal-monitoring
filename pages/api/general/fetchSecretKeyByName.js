'use server'

import { fetcher } from "@/lib/apiHelper"

export default async function fetchSecretKeyByName(req, res) {

    try {
        const baseUrl = "http://localhost:3003/api/user/secret/login";

        const results = await fetcher(baseUrl);
        console.log('fetchSecretKeyByName', results)

        return res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
