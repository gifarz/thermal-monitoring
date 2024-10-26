export async function fetcher(url, body) {

    const queryParams = `?gte=${body.gte}&lte=${body.lte}`

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(url+queryParams, options);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {

        console.error('API Fetch Error:', error);
        return { error: error };
    }
}
