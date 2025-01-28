
export const fetchData = async ( filePath ) =>
{
    try {
        const res = await fetch( filePath );
        if ( !res.ok )
        {
            throw new Error(
              `Failed to fetch data from ${filePath}. HTTP status: ${res.status}`,
            );
        }
        const data = await res.json();
        return data
        
    } catch ( error ){
       console.error(`Error fetching data from ${filePath}:`, error);
      return null;
        
    }
}
