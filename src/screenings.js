
export default async function getScreenings(cmsAdapter) {
    const screenings = await cmsAdapter.loadScreenings();



    //Logik hit
    return screenings;
}
 