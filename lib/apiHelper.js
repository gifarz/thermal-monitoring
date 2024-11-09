export async function fetcher(url, params) {

    let queryParams 

    if(url == 'http://localhost:3003/api/user/list'){
        queryParams = `?username=${params.username}&password=${params.password}`

    } else if(url.includes("matindok") || url.includes("donggi")){
        queryParams = `?gte=${params.gte}&lte=${params.lte}&page=${params.page}&limit=${params.limit}`

    } else {
        queryParams = ''
    }

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // console.log('url helper', url)
    // console.log('queryParams helper', queryParams)

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
