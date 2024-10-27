export async function fetcher(url, params) {

    const queryParams = 
    `?gte=${params.gte}&lte=${params.lte}&page=${params.page}&limit=${params.limit}`

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
