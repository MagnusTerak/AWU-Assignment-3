
export default async function getScreenings(cmsAdapter) {
    const screenings = await cmsAdapter.loadScreenings();

      const today = new Date();  
      const inFiveDays = new Date(); 
      inFiveDays.setDate(today.getDate() + 5);  
  
     
      const filteredScreenings = screenings.filter((screening) => {
          const screeningDate = new Date(screening.attributes.start_time);
            console.log(screeningDate);
          return screeningDate >= today && screeningDate <= inFiveDays;
      });
  
      return filteredScreenings;
  
}


 